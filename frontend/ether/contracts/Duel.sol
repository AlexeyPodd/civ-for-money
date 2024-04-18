// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Duel {
  uint8 commisionProcent = 5;

  address public arbiter;
  address public host;
  address public player2;

  uint public bet;
  
  bool public started;
  bool public finished;
  bool public disagreement;

  mapping(address => bool) drawVotes;
  mapping(address => uint8) placeVotes;

  constructor(address _arbiter) payable {
    arbiter = _arbiter;
    host = msg.sender;
    bet = msg.value;
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
    finished = true;
  }

  function start() external onlyHost player2Joined {    
    started = true;
  }

  function voteForDraw() external anyPlayer afterStart {
    require(!drawVotes[msg.sender], "You already voted");
    drawVotes[msg.sender] = true;
    _checkDraw();
  }

  function _checkDraw() internal {
    if (drawVotes[host] && drawVotes[player2]) {
      (bool s,) = arbiter.call{value: address(this).balance * commisionProcent / 100}("");
      require(s);

      uint prizeFund = address(this).balance;
      (s,) = player2.call{value: prizeFund / 2}("");
      require(s);
      (s,) = host.call{value: prizeFund / 2}("");
      require(s);

      finished = true;
    }
  }

  function voteForPlace(uint8 _place) external anyPlayer afterStart {
    require(placeVotes[msg.sender] == 0, "You already voted");
    require(_place == 1 || _place == 2, "Invalid place (should be 1 or 2)");
    placeVotes[msg.sender] = _place;
    _checkPlaces();
  }

  function _checkPlaces() internal {
    if (placeVotes[host] != 0 && placeVotes[player2] != 0) {
      finished = true;
      if (placeVotes[host] != placeVotes[player2]) {
        if (placeVotes[host] == 1) {
          _rewardTheWinner(host);
        } else {
          _rewardTheWinner(player2);
        }
      } else {
        disagreement = true;
      }
    }
  }

  function appointWinner(address _winner) external {
    require(msg.sender == arbiter, "You are not arbiter");
    require(disagreement, "Players did not reached a disagreement");
    require(host == _winner || player2 == _winner, "Address must be player in this game");
    _rewardTheWinner(_winner);
  }

  function _rewardTheWinner(address _winner) internal {
    (bool s,) = arbiter.call{value: address(this).balance * commisionProcent / 100}("");
    require(s);
    (s,) = _winner.call{value: address(this).balance}("");
    require(s);
  }

  modifier beforeStart {
    require(!started, "Game has already been started");
    _;
  }
  modifier afterStart {
    require(started, "Game has not been started yet");
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
}