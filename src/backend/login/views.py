from rest_framework import viewsets
from login.serializers import UserSerializer, SuggestionSerializer
from login.models import User, Suggestion
from rest_framework.response import Response
from rest_framework import status
from utils.email_utils import EmailUtils, EmailTemplates
from rest_framework.views import APIView
import logging

LOGGER = logging.getLogger('watchtower')


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            try:
                EmailUtils.send_to(
                    TemplateClass=EmailTemplates.Login,
                    user=User.objects.get(id=serializer.data['id'])
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            except:
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):

        try: 
            instance = self.get_object()
            EmailUtils.send_to(
                TemplateClass=EmailTemplates.AccountDeleted,
                user=instance
            )
            self.perform_destroy(instance)

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


class SuggestionView(viewsets.ModelViewSet):
    serializer_class = SuggestionSerializer
    queryset = Suggestion.objects.all()


class ReactLoggingView(APIView):

    def post(self, request, format=None):

        print(request.data)

        try:

            error = request.data.get('error')
            error_info = request.data.get('error_info')

            if not error:
                raise KeyError('Missing error')

            if not error_info:
                raise KeyError('Missing error_info')

            LOGGER.error('{}_{}'.format(error, error_info))

            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            LOGGER.error(e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


        

