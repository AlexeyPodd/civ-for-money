from web3 import Web3

from server.settings import ALCHEMY_HTTP_ADDRESS

web3 = Web3(Web3.HTTPProvider(ALCHEMY_HTTP_ADDRESS))
