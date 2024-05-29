// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Duels {
  enum ResultVote { NotVoted, First, Second, Draw }

  address public arbiter;
  uint8 commissionPercent;
  uint minimalBet;

  struct Game {
    address host;
    address player2;
    uint bet;
    uint timeStart;
    uint playPeriod;  
    bool started;
    bool closed;
    bool disagreement;
    ResultVote hostVote;
    ResultVote player2Vote;
  }

  Game[] public games;

  event Joined(uint id, address player2);
  event SlotFreed(uint id);
  event Cancel(uint id);
  event Start(uint id, address player2);
  event Victory(uint id, address winner);
  event Draw(uint id);
  event Disagreement(uint id);

  constructor(uint _minimalBet, uint8 _commissionPercent) {
    arbiter = msg.sender;
    commissionPercent = _commissionPercent;
    minimalBet = _minimalBet;
  }

  function createGame(uint _playPeriod) external payable returns(uint gameIndex) {
    require(msg.value >= minimalBet, 'Your bet is too small');
    gameIndex = games.length;
    games.push(Game(
      msg.sender,
      address(0), 
      msg.value,
      0, 
      _playPeriod,
      false,
      false,
      false,
      ResultVote.NotVoted,
      ResultVote.NotVoted
    ));
  }

  function join(uint _gameIndex) external payable {
    require(games.length > _gameIndex, "Game was not created yet");
    // read game instance from storage once for reducing its cost
    Game memory game = games[_gameIndex];
    require(game.player2 == address(0), "Slot is already taken");
    require(msg.value >= game.bet, "Your bet amount is insufficient");
    games[_gameIndex].player2 = msg.sender;
    emit Joined(_gameIndex, msg.sender);
  }

  function excludePlayer2(uint _gameIndex) external {
    require(games.length > _gameIndex, "Game was not created yet");
    Game memory game = games[_gameIndex];
    require(
      msg.sender == game.host || msg.sender == game.player2, 
      "You are not participator"
    );
    require(game.player2 != address(0), "Second player has not joined yet");
    require(!game.started, "Game has already been started");
    (bool s,) = game.player2.call{value: game.bet}("");
    require(s);
    games[_gameIndex].player2 = address(0);
    emit SlotFreed(_gameIndex);
  }

  function cancel(uint _gameIndex) external {
    require(games.length > _gameIndex, "Game was not created yet");
    Game memory game = games[_gameIndex];
    require(!game.started, "Game has already been started");
    require(msg.sender == game.host, "You are not game host");
    // return all bets to players, close game
    if (game.player2 != address(0)) {
      (bool s2,) = game.player2.call{value: game.bet}("");
      require(s2);
    }
    (bool s,) = game.host.call{value: game.bet}("");
    require(s);

    games[_gameIndex].closed = true;
    emit Cancel(_gameIndex);
  }

  function start(uint _gameIndex) external {
    require(games.length > _gameIndex, "Game was not created yet");
    Game memory game = games[_gameIndex];
    require(msg.sender == game.host, "You are not game host");
    require(game.player2 != address(0), "Second player has not joined yet");
    game.started = true;
    game.timeStart = block.timestamp;
    // writing to storage
    games[_gameIndex] = game;
    emit Start(_gameIndex, game.player2);
  }

  function voteResult(uint _gameIndex, ResultVote _place) external {
    require(games.length > _gameIndex, "Game was not created yet"); 
    require(uint8(_place) == 1 
      || uint8(_place) == 2 
      || uint8(_place) == 3,
      "Invalid vote value"
    );
    Game memory game = games[_gameIndex];
    require(
      msg.sender == game.host || msg.sender == game.player2,
      "You are not participator"
    );
    require(game.started, "Game has not been started yet");
    require(!game.closed, "Game was closed");

    // set vote
    if (msg.sender == game.host) {
      games[_gameIndex].hostVote = _place;
      game.hostVote = _place;
    }
    else {
      games[_gameIndex].player2Vote = _place;
      game.player2Vote = _place;
    }

    // both players voted
    if (game.hostVote != ResultVote.NotVoted && game.player2Vote != ResultVote.NotVoted) {
      if (game.hostVote == ResultVote.First && game.player2Vote == ResultVote.Second) {
        if (game.disagreement) games[_gameIndex].disagreement = false;
        _rewardTheWinner(_gameIndex, game, game.host);
      }
      else if (game.hostVote == ResultVote.Second && game.player2Vote == ResultVote.First) {
        if (game.disagreement) games[_gameIndex].disagreement = false;
        _rewardTheWinner(_gameIndex, game, game.player2);
      }
      else if (game.hostVote == ResultVote.Draw && game.player2Vote == ResultVote.Draw) {
        if (game.disagreement) games[_gameIndex].disagreement = false;
        _callDraw(_gameIndex, game);
      }
      else {
        games[_gameIndex].disagreement = true;
        emit Disagreement(_gameIndex);
      }
    }

    // if playPeriod is over and other player not voted - any vote accepts as source of truth
    else if (block.timestamp > game.timeStart + game.playPeriod
        && (game.hostVote == ResultVote.NotVoted || game.player2Vote == ResultVote.NotVoted)) {
      if (_place == ResultVote.First) {
        _rewardTheWinner(_gameIndex, game, msg.sender);
      }
      else if (_place == ResultVote.Second) {
        _rewardTheWinner(_gameIndex, game, msg.sender == game.host ? game.player2 : game.host);
      }
      else {
        _callDraw(_gameIndex, game);
      }
    }
  }

  function forceAppointWinner(uint _gameIndex, address _winner) external onlyArbiter {
    // arbiter apoint winner if there is disagreement of places taken
    require(games.length > _gameIndex, "Game was not created yet");
    Game memory game = games[_gameIndex];
    require(game.disagreement, "Players did not reached a disagreement");
    require(game.host == _winner || game.player2 == _winner, "Address must be player in this game");
    _rewardTheWinner(_gameIndex, game, _winner);
  }

  function _rewardTheWinner(uint _gameIndex, Game memory game, address _winner) internal {
    require(!game.closed, "Game has already been closed");
    uint commission = game.bet * 2 * commissionPercent / 100;
    (bool s,) = arbiter.call{value: commission}("");
    require(s);

    uint prizeFund = game.bet * 2 - commission; 
    (s,) = _winner.call{value: prizeFund}("");
    require(s);

    games[_gameIndex].closed = true;
    emit Victory(_gameIndex, _winner);
  }

  function forceDraw(uint _gameIndex) external onlyArbiter {
    require(games.length > _gameIndex, "Game was not created yet");
    Game memory game = games[_gameIndex];
    require(game.disagreement, "Players did not reached a disagreement");
    _callDraw(_gameIndex, game);
  }

  function _callDraw(uint _gameIndex, Game memory game) internal {
    require(!game.closed, "Game has already been closed");
    uint commission = game.bet * 2 * commissionPercent / 100;
    (bool s,) = arbiter.call{value: commission}("");
    require(s);

    uint prizeFund = game.bet * 2 - commission;
      
    (s,) = game.player2.call{value: prizeFund / 2}("");
    require(s);
    (s,) = game.host.call{value: prizeFund / 2}("");
    require(s);

    games[_gameIndex].closed = true;
    emit Draw(_gameIndex);
  }

  modifier onlyArbiter {
    require(msg.sender == arbiter, "You are not arbiter");
    _;
  }
}