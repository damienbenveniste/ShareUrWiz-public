from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from stripe.api_resources import account_link
from marketplace.serializers import (
    PostSerializer,
    CategorySerializer,
    AppointmentSerializer
)
from payment.views import Account
from login.serializers import TutorProfileSerializer
from marketplace.models import Post, Category, TutorProfile, Appointment
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from utils.email_utils import EmailUtils
from marketplace.pagination import Pagination, LargePagination
from rest_framework.views import APIView
from django.db.models import Q, F
from datetime import datetime, timedelta
from dateutil import parser
from login.models import User
from utils.email_utils import EmailUtils, EmailTemplates
import requests
from payment.payment_utils import PaymentFactory
import logging
from marketplace.promotions import PromotionFactory

LOGGER = logging.getLogger('watchtower')
DAILY_API_KEY = 'b084094c2b5b120c198b4124aad72bb1c9fc85cea36bc5ff91a08388e6f3511c'


class PostView(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    pagination_class = Pagination

    def create(self, request, *args, **kwargs):

        try:
            serializer = self.get_serializer(data=request.data)
            if 'categories' in request.data:
                for name in request.data['categories']:

                    if not name:
                        raise KeyError('Null category')

                    if not Category.objects.filter(name=name.lower().strip()).exists():
                        category = Category(name=name.lower().strip())
                        category.save()
                    else:
                        category = Category.objects.get(name=name.lower().strip())
                        category.number_used += 1
                        category.save()

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):

        try:

            queryset = self.queryset

            if 'categories[]' in self.request.query_params:
                categories = self.request.query_params.getlist('categories[]')

                if not categories:
                    raise KeyError('Missing categories')

                queryset = queryset.filter(categories__in=categories)

            if 'levels[]' in self.request.query_params:
                levels = self.request.query_params.getlist('levels[]')

                if not levels:
                    raise KeyError('Missing levels')

                queryset = queryset.filter(level__in=levels)

            if 'min_price' in self.request.query_params and 'max_price' in self.request.query_params:
                min_price = self.request.query_params.get('min_price')
                max_price = self.request.query_params.get('max_price')

                if min_price is None or not max_price:
                    raise KeyError('Missing min or max price')

                queryset = queryset.filter(
                    Q(max_price__gte=float(min_price)) & Q(min_price__lte=float(max_price))
                )

            return queryset

        except Exception as e:
            LOGGER.error(e)
            raise(e)


class CategoryView(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    pagination_class = None


class TutorProfileView(viewsets.ModelViewSet):
    serializer_class = TutorProfileSerializer
    queryset = TutorProfile.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = Pagination

    def create(self, request, *args, **kwargs):

        try:

            tutor_data = request.data.copy()

            tutor_data = PromotionFactory.apply_promotion(
                tutor_data
            )

            if 'user' not in tutor_data:
                raise KeyError('Missing user id')

            if TutorProfile.objects.filter(user=tutor_data.get('user')).exists():
                return Response(request.data, status=status.HTTP_208_ALREADY_REPORTED)

            account = Account.create_account()
            if not account or not account.id:
                raise ValueError('Problem with the account creation')

            tutor_data['stripe_account_id'] = account.id
            tutor_data.setlist('specialties', [s.lower().strip() for s in tutor_data.getlist('specialties')])
            serializer = self.get_serializer(data=tutor_data)

            if 'specialties' in tutor_data:
                for name in tutor_data.getlist('specialties'):

                    if not name:
                        raise KeyError('Null category')

                    if not Category.objects.filter(name=name).exists():
                        category = Category(name=name)
                        category.save()
                    else:
                        category = Category.objects.get(name=name)
                        category.number_used += 1
                        category.save(update_fields=[
                            'number_used'
                        ])

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            tutor = TutorProfile.objects.get(user=tutor_data['user'])
            account_link = Account.create_account_link(tutor)
            return Response(account_link, status=status.HTTP_201_CREATED, headers=headers)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):

        try:

            queryset = self.queryset

            if 'categories[]' in self.request.query_params:
                categories = self.request.query_params.get('categories[]')

                if not categories:
                    raise KeyError('Missing categories')

                queryset = queryset.filter(specialties__in=categories)

            if 'min_price' in self.request.query_params and 'max_price' in self.request.query_params:
                min_price = self.request.query_params.get('min_price')
                max_price = self.request.query_params.get('max_price')

                if min_price is None or not max_price:
                    raise KeyError('Missing min or max price')

                queryset = queryset.filter(
                    Q(price__gte=float(min_price)) & Q(price__lte=float(max_price))
                )

            if 'timeStart' in self.request.query_params and 'timeEnd' in self.request.query_params:
                time_start = self.request.query_params.get('timeStart')
                time_end = self.request.query_params.get('timeEnd')

                if not time_start or not time_end:
                    raise KeyError('Missing timeStart or timeEnd')

                queryset = queryset.filter(
                    Q(appointments__date_time__gte=time_start) &
                    Q(appointments__date_time__lte=time_end) &
                    Q(appointments__tutee=None)
                )

            return queryset.distinct()

        except Exception as e:
            LOGGER.error(e)
            raise(e)

    def update(self, request, *args, **kwargs):

        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            tutor_data = request.data.copy()
            if 'specialties' in tutor_data:
                tutor_data.setlist('specialties', [s.lower() for s in tutor_data.getlist('specialties')])
    
            serializer = self.get_serializer(
                instance, data=tutor_data, partial=partial)

            if 'specialties' in tutor_data:
                for name in tutor_data.getlist('specialties'):

                    if not name:
                        raise KeyError('Null category')

                    if not Category.objects.filter(name=name).exists():
                        category = Category(name=name)
                        category.save()

            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        
        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AppointmentView(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()

    def create(self, request, *args, **kwargs):

        try:
            serializer = self.get_serializer(
                data=request.data, many=isinstance(request.data, list))
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # todo: use update to confirm appointments
    def update(self, request, *args, **kwargs):

        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            tutor = instance.tutor

            serializer = self.get_serializer(
                instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)

            if 'rating' in request.data:
                rating = request.data['rating']

                if rating is None:
                    raise KeyError('Missing rating')

                tutor.rating = ((tutor.rating * tutor.num_rating) +
                                rating) / (tutor.num_rating + 1)
                tutor.num_rating += 1
                tutor.save()

            self.perform_update(serializer)
            return Response(serializer.data)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):

        try:
            instance = self.get_object()
            # if 'user_id' not in request.data:
            #     return Response({'error': 'user id not provided'}, status=status.HTTP_400_BAD_REQUEST)

            # user_id = request.data.get('user_id')
            # if user_id not in (instance.tutee.id, instance.tutor.user.id):
            #     return Response({'error': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)

            headers = {'Authorization': 'Bearer {}'.format(DAILY_API_KEY)}

            if instance.room_url is None:

                not_before = instance.date_time - timedelta(minutes=15)
                expiration_time = instance.date_time + timedelta(minutes=instance.duration + 30)
                params = {
                    'privacy': "private",
                    'properties': {
                        'enable_chat': True,
                        'exp': expiration_time.timestamp(),
                        'enable_prejoin_ui': True,
                        'signaling_impl': 'ws',
                        'nbf': not_before.timestamp()
                    }
                }

                URL = 'https://api.daily.co/v1/rooms'
                room = requests.post(URL, headers=headers, json=params)
                instance.room_url = room.json()['url']
                instance.save(update_fields=['room_url'])

            room_url = instance.room_url
            room_name = room_url.split('/')[-1]

            params = {
                'properties': {
                    'room_name': room_name,
                }
            }

            URL = 'https://api.daily.co/v1/meeting-tokens'
            token = requests.post(URL, headers=headers, json=params)
            serializer = self.get_serializer(instance)

            data = serializer.data.copy()
            data['token'] = token.json()['token']

            return Response(data)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):

        try:

            queryset = self.queryset

            if 'tutor' in self.request.query_params and 'date' in self.request.query_params:
                tutor_id = self.request.query_params.get('tutor')
                date = self.request.query_params.get('date')

                if not tutor_id:
                    raise KeyError('Missing tutor ID')
                
                if not date:
                    raise KeyError('Missing date')

                if 'available' in self.request.query_params:

                    available = self.request.query_params.get('available')
                    if available is None or available not in ('true', 'false'):
                        raise KeyError('Missing available')

                    if available == 'true':
                        queryset = queryset.filter(
                            Q(tutor=tutor_id) & Q(tutee__isnull=True) & Q(
                                date_time__gte=date)
                        )
                    elif available == 'false':
                        queryset = queryset.filter(
                            Q(tutor=tutor_id) & Q(date_time__gte=date)
                        )

            return queryset

        except Exception as e:
            LOGGER.error(e)
            raise(e)


class AppointmentListView(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    pagination_class = Pagination
    queryset = Appointment.objects.all()

    def get_queryset(self):

        try:

            queryset = self.queryset

            if 'tutor' in self.request.query_params:
                tutor_id = self.request.query_params.get('tutor')

                if not tutor_id:
                    raise KeyError('Missing Tutor ID')

                queryset = queryset.filter(
                    Q(tutor=tutor_id) & Q(tutee__isnull=False)
                )

            elif 'tutee' in self.request.query_params:
                tutee_id = self.request.query_params.get('tutee')

                if not tutee_id:
                    raise KeyError('Missing Tutee ID')

                queryset = queryset.filter(tutee=tutee_id)

            if 'date' in self.request.query_params:
                date = parser.parse(self.request.query_params.get('date'))
                future = self.request.query_params.get('future')

                if not date:
                    raise KeyError('Missing Date')
                
                if not future or future not in ('true', 'false'):
                    raise KeyError('Missing future')

                if future == 'true':

                    queryset = queryset.filter(
                        date_time__gte=date - timedelta(minutes=1) * F('duration')
                    )
                else:
                    queryset = queryset.filter(
                        date_time__lte=date - timedelta(minutes=1) * F('duration')
                    ).order_by('-date_time')

            if 'status' in self.request.query_params:
                status = self.request.query_params.get('status')

                if not status or status not in ('available', 'pending', 'confirmed'):
                    raise KeyError('Missing status')

                queryset = queryset.filter(
                    status=status
                )

            return queryset
        
        except Exception as e:
            LOGGER.error(e)
            raise(e)


class AppointmentCalendarView(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    pagination_class = LargePagination
    queryset = Appointment.objects.all()

    def get_queryset(self):

        try:
            queryset = self.queryset

            if 'tutor' in self.request.query_params:
                tutor_id = self.request.query_params.get('tutor')

                if not tutor_id:
                    raise KeyError('Missing Tutor ID')

                queryset = queryset.filter(tutor=tutor_id)

            elif 'tutee' in self.request.query_params:
                tutee_id = self.request.query_params.get('tutee')

                if not tutee_id:
                    raise KeyError('Missing Tutee ID')

                queryset = queryset.filter(tutee=tutee_id)

            start_date = self.request.query_params.get('startDate')
            end_date = self.request.query_params.get('endDate')

            if not start_date:
                    raise KeyError('Missing start_date')

            if not end_date:
                    raise KeyError('Missing end_date')

            queryset = queryset.filter(
                 Q(date_time__gte=start_date) & Q(date_time__lt=end_date)
            )

            return queryset
        
        except Exception as e:
            LOGGER.error(e)
            raise(e)


class ConfirmAppointment(APIView):

    def put(self, request, format=None):

        try:

            appointment_id = request.data.get('appointment_id')
            user_id = request.data.get('user_id')
            message = request.data.get('message')
            payment_method_id = request.data.get('payment_method_id')

            if not appointment_id:
                raise KeyError('Missing Appointment ID')

            if not user_id:
                raise KeyError('Missing user ID')
            
            if not message:
                raise KeyError('Missing Message')

            if not payment_method_id:
                raise KeyError('Missing payment_method_id')

            appointment = Appointment.objects.get(id=appointment_id)
            tutor = appointment.tutor
            user = User.objects.get(id=user_id)
            appointment.tutee = user
            appointment.message = message
            appointment.payment_method_id = payment_method_id
            appointment.status = 'pending'
            appointment.cost = PaymentFactory.compute_appointment_cost(
                appointment=appointment,
                tutor=tutor
            )
            appointment.save(update_fields=[
                'tutee',
                'message',
                'payment_method_id',
                'status',
                'cost'
            ])

            EmailUtils.send_to(
                TemplateClass=EmailTemplates.AppointmentTuteeBooked,
                appointment=appointment
            )

            EmailUtils.send_to(
                TemplateClass=EmailTemplates.AppointmentTutorBooked,
                appointment=appointment
            )

            return Response(AppointmentSerializer(appointment).data)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    
