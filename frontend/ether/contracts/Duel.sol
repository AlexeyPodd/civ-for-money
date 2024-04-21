// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Duel {
  uint8 commissionPercent = 5;

  address public arbiter;
  address public host;
  address public player2;

  uint public bet;

  uint public timeStart;
  uint public playPeriod;
  
  bool public started;
  bool public closed;
  bool public disagreement;

  mapping(address => bool) drawVotes;
  mapping(address => uint8) placeVotes;

  event Joined(address player2);
  event SlotFreed();
  event Cancel();
  event Start(address player2);
  event Victory(address winner);
  event Draw();
  event Disagreement();

  constructor(address _arbiter, uint _playPeriod) payable {
    require(msg.value > 0, "You should pay your bet");
    arbiter = _arbiter;
    host = msg.sender;
    bet = msg.value;
    playPeriod = _playPeriod;
  }

  function join() external payable {
    require(player2 == address(0), "Slot is already taken");
    require(msg.value >= bet, "Your bet amount is insufficient");
    player2 = msg.sender;
    emit Joined(msg.sender);
  }

  function excludePlayer2() external anyPlayer player2Joined beforeStart {
    (bool s,) = player2.call{value: bet}("");
    require(s);
    player2 = address(0);
    emit SlotFreed();
  }

  function cancel() external onlyHost beforeStart {
    // return all bets to players, close game
    if (player2 != address(0)) {
      (bool s2,) = player2.call{value: bet}("");
      require(s2);
    }
    (bool s,) = host.call{value: bet}("");
    require(s);

    closed = true;
    emit Cancel();
  }

  function start() external onlyHost player2Joined {    
    started = true;
    timeStart = block.timestamp;
    emit Start(player2);
  }

  function voteForDraw() external anyPlayer afterStart {
    // set vote of player, if enough vote - call draw
    // if play period is over - any player can call draw
    if (block.timestamp < timeStart + playPeriod) {
      require(!drawVotes[msg.sender], "You have already voted");
      drawVotes[msg.sender] = true;
      _checkDraw();
    } else {
      _callDraw();
    }
  }

  function _checkDraw() internal {
    if (drawVotes[host] && drawVotes[player2]) {
      _callDraw();
    }
  }

  function voteForPlace(uint8 _place) external anyPlayer afterStart {
    // player set his opinion of place he takes
    // if play period is over - place player calls accepts and game ends
    require(_place == 1 || _place == 2, "Invalid place (should be 1 or 2)");
    placeVotes[msg.sender] = _place;
    if (block.timestamp < timeStart + playPeriod) {     
      if (placeVotes[host] != 0 && placeVotes[player2] != 0) {
        _appointWinner();
    }
    } else {
      _appointWinner();      
    }
  }

  function _appointWinner() internal {
    if (placeVotes[host] != placeVotes[player2]) {
      if (disagreement) disagreement = false;
      if (placeVotes[msg.sender] == 1) {
        _rewardTheWinner(msg.sender);
      } else {
        _rewardTheWinner(msg.sender == host ? player2 : host);
      }
    } else {
      disagreement = true;
      emit Disagreement();
    }
  }

  function forceAppointWinner(address _winner) external onlyArbiter disagreed {
    // arbiter apoint winner if there is disagreement of places taken
    require(host == _winner || player2 == _winner, "Address must be player in this game");
    _rewardTheWinner(_winner);
  }

  function _rewardTheWinner(address _winner) internal {
    (bool s,) = arbiter.call{value: address(this).balance * commissionPercent / 100}("");
    require(s);
    (s,) = _winner.call{value: address(this).balance}("");
    require(s);

    closed = true;
    emit Victory(_winner);
  }

  function forceDraw() external onlyArbiter disagreed {
    _callDraw();
  }

  function _callDraw() internal {
      (bool s,) = arbiter.call{value: address(this).balance * commissionPercent / 100}("");
      require(s);

      uint prizeFund = address(this).balance;
      (s,) = player2.call{value: prizeFund / 2}("");
      require(s);
      (s,) = host.call{value: prizeFund / 2}("");
      require(s);

      closed = true;
      emit Draw();
  }

  modifier beforeStart {
    require(!started, "Game has already been started");
    _;
  }
  modifier afterStart {
    require(started, "Game has not been started yet");
    _;
  }
  modifier onlyArbiter {
    require(msg.sender == arbiter, "You are not arbiter");
    _;
  }
  modifier anyPlayer {
    require(msg.sender == host || msg.sender == player2, "You are not participator");
    _;
  }
  modifier onlyHost {
    require(msg.sender == host, "You are not game host");
    _;
  }
  modifier player2Joined {
    require(player2 != address(0), "Second player has not joined yet");
    _;
  }
  modifier disagreed {
    require(disagreement, "Players did not reached a disagreement");
    _;
  }
}