def generate_user_info(*, user):
    return {
        "user_id": user.id,
        "email": user.email,
        "nickname": user.nickname,
    }
