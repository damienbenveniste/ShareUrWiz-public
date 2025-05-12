
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dataclasses import dataclass
from django.db import models
import logging

LOGGER = logging.getLogger('watchtower')

SENDGRID_API_KEY = '...'
FROM_EMAIL = ('notification@shareyourwiz.com', 'Shareyourwiz')


class EmailUtils:

    @staticmethod
    def send_to(TemplateClass, **kwargs):

        try:
            template_class = TemplateClass(**kwargs)

            subject = template_class.SUBJECT
            message_content = template_class.SIGNED_TEXT
            send_to = template_class.send_to

            message = Mail(
                from_email=FROM_EMAIL,
                to_emails=send_to,
                subject=subject,
                html_content=message_content
            )
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            sg.send(message)
        except Exception as e:
            LOGGER.error(e)


class EmailTemplates:

    @dataclass
    class BaseTemplate:

        SIGNATURE = """
        <br/><br/>Thank you!<br/>
        The Shareyourwiz team<br/>
        <a href='https://www.shareyourwiz.com/' target="_blank" rel="noopener noreferrer">shareyourwiz.com</a><br/><br/>
        """

        TEXT = ''

        @property
        def SIGNED_TEXT(self):
            return self.TEXT + self.SIGNATURE

    @dataclass
    class Login(BaseTemplate):

        user: models.Model

        SUBJECT = 'Welcome to Shareyourwiz!'

        _TEXT = """
        Welcome {username}!<br/><br/>

        You can now post tutoring requests, message tutors, set appointments up and even become
        a Tutor yourself. Get ready to learn a ton!<br/><br/>

        You can go to your profile at <a href='https://www.shareyourwiz.com/profile-page' target="_blank" rel="noopener noreferrer">shareyourwiz/profile</a>
        """

        @property
        def TEXT(self):
            return self._TEXT.format(username=self.user.username)

        @property
        def send_to(self):
            return self.user.email

    @dataclass
    class AppointmentTuteeBooked(BaseTemplate):

        appointment: models.Model

        _SUBJECT = 'You booked an Appointment with {first_name} {last_name}'

        _TEXT = """
        Hi {username}!<br/><br/>

        You have booked an appointment with {first_name} {last_name} for ${cost}. You sent the tutor the following message:<br/>
        "{message}" <br/><br/>

        You will not be charged until the Tutor confirms the appointment. You can cancel the appointment anytime at no charge before the Tutor 
        confirms. You can go to your profile at <a href='https://www.shareyourwiz.com/profile-page' target="_blank" rel="noopener noreferrer">shareyourwiz/profile</a>
        """

        @property
        def TEXT(self):
            return self._TEXT.format(
                username=self.appointment.tutee.username,
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
                cost='{:.2f}'.format(self.appointment.cost / 100),
                message=self.appointment.message
            )
        
        @property
        def SUBJECT(self):
            return self._SUBJECT.format(
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
            )
        
        @property
        def send_to(self):
            return self.appointment.tutee.email

    @dataclass
    class AppointmentTutorBooked(BaseTemplate):

        appointment: models.Model

        _SUBJECT = '{username} booked an Appointment with you'

        _TEXT = """
        Hi {first_name} {last_name}!<br/><br/>

        {username} booked an appointment with you for ${cost}. The Tutee sent you the following message:<br/>
        "{message}" <br/><br/>

        You will not receive payment until you confirm the appointment. The Tutee can cancel the appointment anytime at no charge before you
        confirm. You can go to your profile at <a href='https://www.shareyourwiz.com/profile-page' target="_blank" rel="noopener noreferrer">shareyourwiz/profile</a>
        """

        @property
        def TEXT(self):
            return self._TEXT.format(
                username=self.appointment.tutee.username,
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
                cost='{:.2f}'.format(self.appointment.cost / 100),
                message=self.appointment.message
            )
        
        @property
        def SUBJECT(self):
            return self._SUBJECT.format(
                username=self.appointment.tutee.username
            )

        @property
        def send_to(self):
            return self.appointment.tutor.user.email

    @dataclass
    class AppointmentTuteeConfirmed(BaseTemplate):

        appointment: models.Model

        _SUBJECT = '{first_name} {last_name} confirmed your Appointment!'

        _TEXT = """
        Hi {username}!<br/><br/>

        {first_name} {last_name} confirmed your Appointment for ${cost}.<br/><br/>

        You can go to your profile at 
        <a href='https://www.shareyourwiz.com/profile-page' target="_blank" rel="noopener noreferrer">shareyourwiz/profile</a>
        """

        @property
        def TEXT(self):
            return self._TEXT.format(
                username=self.appointment.tutee.username,
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
                cost='{:.2f}'.format(self.appointment.cost / 100)
            )
        
        @property
        def SUBJECT(self):
            return self._SUBJECT.format(
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
            )

        @property
        def send_to(self):
            return self.appointment.tutee.email

    @dataclass
    class AppointmentTuteeCancelled(BaseTemplate):

        appointment: models.Model

        _SUBJECT = 'Your Appointment with {first_name} {last_name} has been cancelled!'

        _TEXT = """
        Hi {username}!<br/><br/>

        Your Appointment with {first_name} {last_name} has been cancelled. Charges may apply.<br/><br/>

        You can go to your profile at 
        <a href='https://www.shareyourwiz.com/profile-page' target="_blank" rel="noopener noreferrer">shareyourwiz/profile</a>
        """

        @property
        def TEXT(self):
            return self._TEXT.format(
                username=self.appointment.tutee.username,
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
            )
        
        @property
        def SUBJECT(self):
            return self._SUBJECT.format(
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
            )
        
        @property
        def send_to(self):
            return self.appointment.tutee.email

    @dataclass
    class AppointmentTutorCancelled(BaseTemplate):

        appointment: models.Model

        _SUBJECT = 'Your Appointment with {username} has been cancelled!'

        _TEXT = """
        Hi {first_name} {last_name}!<br/><br/>

        Your Appointment with {username} has been cancelled. Charges may apply.<br/><br/>

        You can go to your profile at 
        <a href='https://www.shareyourwiz.com/profile-page' target="_blank" rel="noopener noreferrer">shareyourwiz/profile</a>
        """

        @property
        def TEXT(self):
            return self._TEXT.format(
                username=self.appointment.tutee.username,
                first_name=self.appointment.tutor.first_name,
                last_name=self.appointment.tutor.last_name,
            )
        
        @property
        def SUBJECT(self):
            return self._SUBJECT.format(
                username=self.appointment.tutee.username
            )

        @property
        def send_to(self):
            return self.appointment.tutor.user.email

    @dataclass
    class AccountDeleted(BaseTemplate):

        user: models.Model

        SUBJECT = 'Your account has been deleted!'

        _TEXT = """
        Hi {name}!<br/><br/>

        We are sad to see go but we hope you learned a ton! You can always come back whenever you want. Until next time!<br/><br/>

        You can go to your profile at 
        <a href='https://www.shareyourwiz.com/profile-page' target="_blank" rel="noopener noreferrer">shareyourwiz/profile</a>
        """

        @property
        def TEXT(self):

            if self.user.tutor: 
                name = '{} {}'.format(
                    self.user.tutor.first_name, 
                    self.user.tutor.last_name
                )
            else:
                name = self.user.username

            return self._TEXT.format(name=name)

        @property
        def send_to(self):
            return self.user.email
    