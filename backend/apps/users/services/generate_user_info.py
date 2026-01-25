from apps.energy.models import PersonalActivityProfile


def generate_user_info(*, user):
    try:
        personal_profile = PersonalActivityProfile.objects.get(user=user)
    except PersonalActivityProfile.DoesNotExist:
        personal_profile = None

    return {
        "user_id": user.id,
        "email": user.email,
        "nickname": user.nickname,
        "timezone": user.timezone,
        "load_order": personal_profile.load_order if personal_profile else [],
    }
