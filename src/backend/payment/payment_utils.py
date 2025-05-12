
from marketplace.models import(
    TutorProfile,
    Appointment
)
from login.models import User
import logging

LOGGER = logging.getLogger('watchtower')


class PaymentFactory:

    MINIMUM_FEE = 100
    SYW_PERCENTAGE = 0.1
    HOUR_MINUTE = 60
    DOLLAR_TO_CENT = 100

    @classmethod
    def compute_appointment_cost(
        cls,
        appointment: Appointment,
        tutor: TutorProfile) -> int: 

        try:
            price = tutor.price
            duration = appointment.duration

            return int(price / cls.HOUR_MINUTE * duration * cls.DOLLAR_TO_CENT)

        except Exception as e:
            LOGGER.error(e)
            raise(e)

    @classmethod
    def compute_appointment_fee(
        cls,
        amount: int) -> int:

        try:
            return int(max(amount * cls.SYW_PERCENTAGE, cls.MINIMUM_FEE))
        except Exception as e:
            LOGGER.error(e)
            raise(e)

    @classmethod
    def compute_tutee_credit(
        cls,
        tutee: User,
        amount: int,
        fees: int) -> int:

        try:

            credit = tutee.credit
            if credit > 0:
                # we reduce the total amount
                # and reduce the fees: SYW eats the cost
                if fees >= credit:
                    fees -= credit
                    amount -= credit
                    credit = 0
                else:
                    credit -= fees
                    amount -= fees
                    fees = 0

            return amount, fees, credit

        except Exception as e:
            LOGGER.error(e)
            raise(e)    

    @classmethod
    def compute_tutor_balance(
        cls,
        tutor: TutorProfile,
        amount: int,
        fees: int) -> int:

        try:

            balance = tutor.balance
            credit = -balance
            if balance > 0:
                # We increase our fees up to the total amount
                # The tutor eats the cost
                if balance + fees <= amount:
                    fees += balance
                    balance = 0
                else:
                    balance -= amount - fees
                    fees = amount
            elif credit > 0:
                if fees >= credit:
                    fees -= credit
                    credit = 0
                else:
                    credit -= fees
                    fees = 0

            return amount, fees, balance

        except Exception as e:
            LOGGER.error(e)
            raise(e)



