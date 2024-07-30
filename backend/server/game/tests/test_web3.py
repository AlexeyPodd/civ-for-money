from random import choice
from unittest.mock import patch, Mock

from django.test import SimpleTestCase
from eth_account import Account
from eth_account.messages import encode_defunct
from web3.exceptions import ContractLogicError

from ..web3.api import DuelsSmartContractViewAPI
from ..web3.utils import recover_address


class TestUtils(SimpleTestCase):
    hex_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

    def test_recover_address(self):
        msg = 'test message'
        msg_hash = encode_defunct(text=msg)
        priv_key = '0x' + ''.join([choice(self.hex_chars) for _ in range(64)])
        account = Account.from_key(priv_key)
        signature = account.sign_message(msg_hash).signature

        recovered_address = recover_address(msg, signature)

        self.assertEqual(recovered_address, account.address)


class TestDuelsSmartContractViewAPI(SimpleTestCase):
    def test_negative_game_id_raises_AttributeError(self):
        with self.assertRaises(AttributeError):
            DuelsSmartContractViewAPI(-12)

    @patch('game.web3.api.web3.eth.contract')
    def test_correct_api_initialization(self, mock_contract):
        mock_contract.return_value = Mock()

        contract_api = DuelsSmartContractViewAPI(12)

        self.assertFalse(contract_api._DuelsSmartContractViewAPI__info_fetched)
        self.assertEqual(contract_api._DuelsSmartContractViewAPI__data, {})

    @patch('game.web3.api.web3.eth.contract')
    def test_fetching_data_of_not_created_yet_game(self, mock_contract):
        mock_contract.return_value.functions.games.return_value.call.side_effect = ContractLogicError

        contract_api = DuelsSmartContractViewAPI(12)

        with self.assertRaises(ValueError):
            contract_api.fetch_game_info()

    @patch('game.web3.api.web3.eth.contract')
    def test_fetching_data_success(self, mock_contract):
        expected_parameters = [i for i in range(len(DuelsSmartContractViewAPI.GAME_PARAMETERS))]
        mock_contract.return_value.functions.games.return_value.call.return_value = expected_parameters

        contract_api = DuelsSmartContractViewAPI(12)
        contract_api.fetch_game_info()

        self.assertTrue(contract_api._DuelsSmartContractViewAPI__info_fetched)
        self.assertEqual(
            contract_api._DuelsSmartContractViewAPI__data,
            {param: expected_parameters[i] for i, param in enumerate(DuelsSmartContractViewAPI.GAME_PARAMETERS)},
        )

    @patch('game.web3.api.web3.eth.contract')
    def test_trying_to_get_not_existing_parameter(self, mock_contract):
        expected_parameters = [i for i in range(len(DuelsSmartContractViewAPI.GAME_PARAMETERS))]
        mock_contract.return_value.functions.games.return_value.call.return_value = expected_parameters

        contract_api = DuelsSmartContractViewAPI(12)
        contract_api.fetch_game_info()

        with self.assertRaises(AttributeError):
            contract_api.not_existing_parameter

    @patch('game.web3.api.web3.eth.contract')
    def test_trying_to_get_parameter_before_fetching_info_from_chain(self, mock_contract):
        expected_parameters = [i for i in range(len(DuelsSmartContractViewAPI.GAME_PARAMETERS))]
        mock_contract.return_value.functions.games.return_value.call.return_value = expected_parameters

        contract_api = DuelsSmartContractViewAPI(12)

        with self.assertRaises(AttributeError):
            contract_api.host

    @patch('game.web3.api.web3.eth.contract')
    def test_getting_parameter_successfully(self, mock_contract):
        expected_parameters = [i for i in range(len(DuelsSmartContractViewAPI.GAME_PARAMETERS))]
        mock_contract.return_value.functions.games.return_value.call.return_value = expected_parameters

        contract_api = DuelsSmartContractViewAPI(12)
        contract_api.fetch_game_info()

        self.assertEqual(contract_api.bet, expected_parameters[2])

    @patch('game.web3.api.web3.eth.contract')
    def test_get_None_for_event_not_occurred_in_specified_block(self, mock_contract):
        mock_contract.return_value.events.test_event.create_filter.return_value.get_all_entries.return_value = []

        contract_api = DuelsSmartContractViewAPI(12)
        event_data = contract_api.get_event_data('test_event', 15)

        self.assertIsNone(event_data)

    @patch('game.web3.api.web3.eth.contract')
    def test_get_correct_event_data(self, mock_contract):
        mock_event_log = Mock()
        mock_event_log.args = 'expected_event_data'
        (mock_contract.return_value.events
         .test_event.create_filter.return_value.get_all_entries).return_value = [mock_event_log]

        contract_api = DuelsSmartContractViewAPI(12)
        event_data = contract_api.get_event_data('test_event', 15)

        self.assertEqual(event_data, 'expected_event_data')
