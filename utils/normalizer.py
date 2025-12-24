def normalize_input(user_input: str, valid_keys: dict):
    user_input = user_input.strip().lower()

    for key in valid_keys:
        if user_input == key.lower():
            return key

    return None
