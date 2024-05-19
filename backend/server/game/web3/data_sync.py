from .api import DuelSmartContractViewAPI


def sync_status(game, status):
    match status:
        case "started":
            game.started = DuelSmartContractViewAPI(game.sc_address).started
        case "closed":
            game.closed = DuelSmartContractViewAPI(game.sc_address).closed
        case "dispute":
            game.dispute = DuelSmartContractViewAPI(game.sc_address).dispute
        case _:
            raise ValueError(f"Game does not have status {status}.")
