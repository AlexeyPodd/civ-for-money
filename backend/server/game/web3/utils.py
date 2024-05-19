from eth_account.messages import encode_defunct

from .provider import web3


def recover_address(message, signature):
    message_hash = encode_defunct(text=message)
    address = web3.eth.account.recover_message(message_hash, signature=signature)
    return address
