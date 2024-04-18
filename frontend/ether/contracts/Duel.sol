// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Duel {
  uint8 commisionProcent = 5;

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

  event Cancel();
  event Start(address player2);
  event Victory(address winner);
  event Draw();
  event Disagreement();

  constructor(address _arbiter, uint _playPeriod) payable {
    arbiter = _arbiter;
    host = msg.sender;
    bet = msg.value;
    playPeriod = _playPeriod;
  }

  function join() external payable beforeStart {
    require(player2 == address(0), "Slot is already taken");
    require(msg.value >= bet, "Your bet amount is insufficient");
    player2 = msg.sender;
  }

  function excludePlayer2() internal anyPlayer player2Joined beforeStart {
    (bool s,) = player2.call{value: bet}("");
    require(s);
    player2 = address(0);
  }

  function cancel() external onlyHost beforeStart {
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
    if (block.timestamp < timeStart + playPeriod) {
      require(!drawVotes[msg.sender], "You already voted");
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
    require(_place == 1 || _place == 2, "Invalid place (should be 1 or 2)");
    if (block.timestamp < timeStart + playPeriod) {
      require(placeVotes[msg.sender] == 0, "You already voted");      
      placeVotes[msg.sender] = _place;
      _checkPlaces();
    } else {
      placeVotes[msg.sender] = _place;
      _appointWinner();      
    }
  }

  function _checkPlaces() internal {
    if (placeVotes[host] != 0 && placeVotes[player2] != 0) {
      _appointWinner();
    }
  }

  function _appointWinner() internal {
    if (placeVotes[host] != placeVotes[player2]) {
      if (placeVotes[msg.sender] == 1) {
        _rewardTheWinner(msg.sender);
      } else {
        _rewardTheWinner(msg.sender == host ? player2 : host);
      }
    } else {
      disagreement = true;
      emit Disagreement();
    }
    closed = true;
  }

  function forceAppointWinner(address _winner) external onlyArbiter disagreed {
    require(host == _winner || player2 == _winner, "Address must be player in this game");
    _rewardTheWinner(_winner);
  }

  function _rewardTheWinner(address _winner) internal {
    (bool s,) = arbiter.call{value: address(this).balance * commisionProcent / 100}("");
    require(s);
    (s,) = _winner.call{value: address(this).balance}("");
    require(s);
    emit Victory(_winner);
  }

  function forceDraw() external onlyArbiter disagreed {
    _callDraw();
  }

  function _callDraw() internal {
      (bool s,) = arbiter.call{value: address(this).balance * commisionProcent / 100}("");
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