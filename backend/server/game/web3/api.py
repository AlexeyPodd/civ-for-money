import json
from web3.exceptions import ContractLogicError

from server.settings import DUELS_V1_ABI, SMART_CONTRACT_ADDRESS
from .provider import web3


class DuelsSmartContractViewAPI:
    """API class for getting info about game from smart contract on blockchain"""
    GAME_PARAMETERS = ['host', 'player2', 'bet', 'timeStart', 'playPeriod',
                       'started', 'closed', 'dispute', 'hostVote', 'player2Vote']

    def __init__(self, game_id: int):
        if game_id < 0:
            raise AttributeError('Game index must be positive')
        self.game_id = game_id

        self.__contract = web3.eth.contract(address=SMART_CONTRACT_ADDRESS, abi=json.loads(DUELS_V1_ABI))

        self.__data = {}
        self.__info_fetched = False

    def fetch_game_info(self):
        try:
            game_info = self.__contract.functions.games(self.game_id).call()
        except ContractLogicError:
            raise ValueError("Game with this index was not created yet")

        for i, param in enumerate(self.GAME_PARAMETERS):
            self.__data[param] = game_info[i]

        self.__info_fetched = True

    def __getattr__(self, item):
        if item not in self.GAME_PARAMETERS:
            raise AttributeError(f"Game does not have parameter '{item}'")

        if not self.__info_fetched:
            raise AttributeError("Game data not available. Call fetch_game_info() first.")

        return self.__data[item]
