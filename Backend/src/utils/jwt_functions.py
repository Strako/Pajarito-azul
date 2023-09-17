"""
    This file contains JWT functions.
"""
import jwt


def encode_data(payload, secret):
    """
    Encode a JWT token.
    description:
        This function receives parameters to encode a JWT token.
    parameters:
        payload: dict
            The payload to encode.
        secret: str
            The secret to encode with.
    returns:
        str
            The encoded JWT token.
    """
    return jwt.encode(payload, secret, algorithm='HS256')


def decode_token(token, secret):
    """
    This function receives parameters to decode a JWT token.
    description:
        Decode a JWT token.
    parameters:
        token: str
            The token to decode.
        secret: str
            The secret to decode with.
    returns:
        dict
            The decoded JWT token.
    """
    return jwt.decode(token, secret, algorithms=['HS256'])
