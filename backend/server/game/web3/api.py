from server.settings import DUEL_ABI
from .provider import web3


class DuelSmartContractAPI:
    def __init__(self, address):
        self.contract = web3.eth.contract(address=address, abi=DUEL_ABI)

    @property
    def arbiter(self):
        return self.contract.functions.arbiter().call()

    @property
    def host(self):
        return self.contract.functions.host().call()

    @property
    def player2(self):
        return self.contract.functions.player2().call()

    @property
    def started(self):
        return self.contract.functions.started().call()

    @property
    def closed(self):
        return self.contract.functions.closed().call()

    @property
    def disagreement(self):
        return self.contract.functions.disagreement().call()
