def verify_token(token: str) -> bool:
    """
    Example: simple token verification.
    """
    # In production, replace with real JWT or OAuth verification
    return token == "secret-token"
