def generate_user_info(*, user):
    return {
        "user_id": user.id,
        "timezone": user.timezone,
        "email": user.email,
        "nickname": user.nickname,
    }
