from rest_framework.views import APIView
from rest_framework.response import Response
from marketplace.models import Appointment, TutorProfile
from marketplace.serializers import (
    AppointmentSerializer,
)
from payment.payment_utils import PaymentFactory
from login.models import User
from rest_framework import status
from utils.email_utils import EmailUtils, EmailTemplates
import stripe
import os
import logging

LOGGER = logging.getLogger('watchtower')


if os.environ.get('ENV') == 'production':
    host = 'https://www.shareyourwiz.com'
elif os.environ.get('ENV') == 'staging':
    host = 'https://staging.1234.shareyourwiz.com'
else:
    host = 'http://localhost:3000'


class Account:

    @staticmethod
    def create_account():

        try:
            return stripe.Account.create(
                type='standard',
            )

        except Exception as e:
            LOGGER.error(e)
            raise(e)

    @staticmethod
    def create_account_link(tutor):

        try:
            profile_url = os.path.join(host, 'profile-page')
            refresh_url = os.path.join(host, 'refresh-page', tutor.user.id)

            return stripe.AccountLink.create(
                account=tutor.stripe_account_id,
                refresh_url=refresh_url,
                return_url=profile_url,
                type='account_onboarding',
            )

        except Exception as e:
            LOGGER.error(e)
            raise(e)


class CreateAccountView(APIView):

    def get(self, request, format=None):

        try:
            user = request.query_params.get('user')
            print(user)
            if not user:
                raise KeyError('Missing user ID')

            tutor = TutorProfile.objects.get(user=user)

            if tutor.stripe_account_id and tutor.account_activated:
                return Response({'charges_enabled': True}, status=status.HTTP_200_OK)

            if not tutor.stripe_account_id:

                account = Account.create_account()
                tutor.stripe_account_id = account.id
                tutor.save(update_fields=['stripe_account_id'])

            else:
                account = stripe.Account.retrieve(tutor.stripe_account_id)

            if account['charges_enabled']:
                if not tutor.account_activated:
                    tutor.account_activated = True
                    tutor.save(update_fields=['account_activated'])
                return Response({'charges_enabled': True}, status=status.HTTP_200_OK)
            else:

                account_links = Account.create_account_link(tutor)
                return Response(account_links)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmPaymentView(APIView):

    def get(self, request, format=None):

        try:

            appointment_id = request.query_params.get('appointment_id')

            if not appointment_id:
                raise KeyError('Missing appointment_id')

            appointment = Appointment.objects.get(id=appointment_id)
            tutor = appointment.tutor
            tutee = appointment.tutee

            if not tutee.stripe_customer_id:
                raise NameError('Tutee does not have account set up')

            if not tutor.account_activated:
                raise NameError('stripe account not set up')

            customer_id = tutee.stripe_customer_id
            account_id = tutor.stripe_account_id
            payment_method_id = appointment.payment_method_id

            if not payment_method_id:
                raise NameError('Could not find payment methods')

            amount = appointment.cost
            fees = PaymentFactory.compute_appointment_fee(
                amount=amount
            )

            amount, fees, credit = PaymentFactory.compute_tutee_credit(
                tutee=tutee,
                amount=amount,
                fees=fees
            )

            amount, fees, balance = PaymentFactory.compute_tutor_balance(
                tutor=tutor,
                amount=amount,
                fees=fees
            )

        except Exception as e:
            LOGGER.error(e)
            raise(e)

        try:

            payment_method = stripe.PaymentMethod.create(
                customer=customer_id,
                payment_method=payment_method_id,
                stripe_account=account_id,
            )

            customer = stripe.Customer.create(
                payment_method=payment_method['id'],
                stripe_account=account_id,
                email=tutee.email,
                name=tutee.username,
            )

            payment_intent = stripe.PaymentIntent.create(
                payment_method_types=['card'],
                amount=amount,
                currency='usd',
                application_fee_amount=fees,
                stripe_account=account_id,
                payment_method=payment_method['id'],
                receipt_email=tutee.email,
                customer=customer['id'],
                confirm=True,
                off_session=True
            )

            appointment.status = 'confirmed'
            appointment.payment_intent_id = payment_intent['id']
            appointment.save(
                update_fields=[
                    'status',
                    'payment_intent_id',
                ]
            )
            if not appointment.cost or appointment.cost != amount:
                appointment.cost = amount
                appointment.save(update_fields=['cost'])

            if tutor.balance != balance:
                tutor.balance = balance
                tutor.save(update_fields=['balance'])

            if tutee.credit != credit:
                tutee.credit = credit
                tutee.save(update_fields=['credit'])

            EmailUtils.send_to(
                TemplateClass=EmailTemplates.AppointmentTuteeConfirmed,
                appointment=appointment
            )

            return Response({
                'succeeded': True,
                'clientSecret': payment_intent.client_secret
            }, status=status.HTTP_202_ACCEPTED)

        except stripe.error.CardError as e:
            err = e.error
            LOGGER.error(e)
            if err.code == 'authentication_required':
                # Bring the customer back on-session to authenticate the purchase
                # You can do this by sending an email or app notification to let them know
                # the off-session purchase failed
                # Use the PM ID and client_secret to authenticate the purchase
                # without asking your customers to re-enter their details
                return Response({
                    'error': 'authentication_required',
                    'paymentMethod': err.payment_method.id,
                    'amount': amount,
                    'card': err.payment_method.card,
                    'clientSecret': err.payment_intent.client_secret
                })

            elif err.code:
                # The card was declined for other reasons (e.g. insufficient funds)
                # Bring the customer back on-session to ask them for a new payment method
                return Response({
                    'error': err.code,
                    'clientSecret': err.payment_intent.client_secret
                })

            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):

        try:

            appointment_id = request.query_params.get('appointment_id')

            if not appointment_id:
                raise KeyError('Missing appointment_id')

            appointment = Appointment.objects.get(id=appointment_id)

            if appointment.status == 'confirmed':

                if not appointment.payment_intent_id:
                    raise NameError('Could not find payment methods')

                if not appointment.tutor.stripe_account_id:
                    raise NameError('Tutor missing account id')

                stripe.Refund.create(
                    payment_intent=appointment.payment_intent_id,
                    stripe_account=appointment.tutor.stripe_account_id
                )

                payment_intent = stripe.PaymentIntent.retrieve(
                    appointment.payment_intent_id,
                    stripe_account=appointment.tutor.stripe_account_id,
                    expand=['charges.data.balance_transaction'],
                )

                fee_details = payment_intent.charges.data[0].balance_transaction.fee_details
                for fee in fee_details:
                    if fee['type'] == 'stripe_fee':
                        fee_stripe_amount = fee['amount']
                        break

                tutor = appointment.tutor
                tutee = appointment.tutee

                tutee.credit = fee_stripe_amount
                tutor.balance = fee_stripe_amount

                tutee.save(update_fields=['credit'])
                tutor.save(update_fields=['balance'])

            EmailUtils.send_to(
                TemplateClass=EmailTemplates.AppointmentTuteeCancelled,
                appointment=appointment
            )

            EmailUtils.send_to(
                TemplateClass=EmailTemplates.AppointmentTutorCancelled,
                appointment=appointment
            )

            appointment.status = 'available'
            appointment.tutee = None
            appointment.room_url = None
            appointment.rating = None
            appointment.payment_intent_id = None
            appointment.payment_method_id = None
            appointment.cost = 100

            appointment.save(update_fields=[
                'status',
                'tutee',
                'room_url',
                'rating',
                'payment_method_id',
                'payment_intent_id',
                'cost'
            ])

            return Response(AppointmentSerializer(appointment).data)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CreateSetupIntent(APIView):

    def get(self, request, format=None):

        try:
            user_id = request.query_params.get('user')

            if not user_id:
                raise KeyError('Missing user ID')

            user = User.objects.get(id=user_id)
            if user.stripe_customer_id:
                customer_id = user.stripe_customer_id
            else:
                customer = stripe.Customer.create(
                    email=user.email,
                    name=user.username,
                )
                customer_id = customer['id']
                user.stripe_customer_id = customer_id
                user.save(update_fields=['stripe_customer_id'])

            intent = stripe.SetupIntent.create(
                customer=customer_id,
                payment_method_types=['card'],
            )

            return Response({'clientSecret': intent['client_secret']})

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_403_FORBIDDEN)


class InvoiceHistoryView(APIView):

    def get(self, request, format=None):

        try:

            user_id = request.query_params.get('user_id')

            if not user_id:
                raise KeyError('Missing user ID')

            user = User.objects.get(id=user_id)

            if not user.stripe_customer_id:
                raise NameError('Not a customer')

            profile_url = os.path.join(host, 'profile-page')

            session = stripe.billing_portal.Session.create(
                customer=user.stripe_customer_id,
                return_url=profile_url,
            )

            return Response({'url': session['url']})

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
