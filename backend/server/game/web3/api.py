import json
from web3.exceptions import ContractLogicError

from server.settings import DUELS_V1_ABI, SMART_CONTRACT_ADDRESS
from .provider import web3


class DuelSmartContractViewAPI:
    def __init__(self, game_id: int):
        if game_id < 0:
            raise AttributeError('Game index must be positive')

        self.__contract = web3.eth.contract(address=SMART_CONTRACT_ADDRESS, abi=json.loads(DUELS_V1_ABI))

        try:
            self.__game_info = self.__contract.functions.games(game_id).call()
        except ContractLogicError:
            raise ValueError("Game with this index was not created yet")

    # def __getattr__(self, item):
    #     if item not in self.__contract_views:
    #         raise AttributeError(f"Contract does not have view function '{item}'")
    #
    #     return getattr(self.contract.functions, item)().call()
