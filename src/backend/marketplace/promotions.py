

EXISTING_PROMOTION = {
    'i-love-teaching': 10000
}

class PromotionFactory:

    @staticmethod
    def apply_promotion(tutor_data):

        if 'promocode' not in tutor_data:
            return tutor_data
        
        promocode = tutor_data.pop('promocode')
        if isinstance(promocode, list):
            promocode = promocode.pop()

        tutor_data['balance'] = -EXISTING_PROMOTION.get(promocode.strip().lower(), 0)
        return tutor_data


