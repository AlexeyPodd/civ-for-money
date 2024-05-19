from server.settings import DUEL_ABI
from .provider import web3
import json


class DuelSmartContractViewAPI:
    def __init__(self, address):
        self.contract = web3.eth.contract(address=address, abi=DUEL_ABI)
        self.__contract_views = self.__get_contract_views(DUEL_ABI)

    @staticmethod
    def __get_contract_views(abi_string):
        abi_list = json.loads(abi_string)
        return [method['name'] for method in abi_list
                if method['type'] == 'function' and method['stateMutability'] == 'view']

    def __getattr__(self, item):
        if item not in self.__contract_views:
            raise AttributeError(f"Contract does not have view function '{item}'")

        return getattr(self.contract.functions, item)().call()
