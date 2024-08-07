import { test, expect } from 'vitest';
import reducer, {
  clearLobbyGames,
  clearUserGames,
  clearUserGamesArchive,
  clearDisputeGames,
  selectLobbyGamesPageSize,
  selectLobbyGames,
  selectTotalLobbyGamesCount,
  selectUserGamesPageSize,
  selectUserGames,
  selectTotalUserGamesCount,
  selectUserGamesArchivePageSize,
  selectUserGamesArchive,
  selectTotalUserGamesArchiveCount,
  selectDisputeGamesPageSize,
  selectDisputeGames,
  selectTotalDisputeGamesCount,
} from './gamesSlice';


test("Should return the initial state", () => {
  expect(reducer(undefined, { type: 'unknown' })).toEqual({
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [],
    },
  });
});

test("Should set empty list at lobbyGames when clearLobbyGames", () => {
  const testState = {
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
  }
  expect(reducer(testState, clearLobbyGames())).toEqual({
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
  });
});

test("Should set empty list at userGames when clearUserGames", () => {
  const testState = {
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
  }
  expect(reducer(testState, clearUserGames())).toEqual({
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
  });
});

test("Should set empty list at userGamesArchive when clearUserGamesArchive", () => {
  const testState = {
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
  }
  expect(reducer(testState, clearUserGamesArchive())).toEqual({
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
  });
});

test("Should set empty list at disputeGames when clearDisputeGames", () => {
  const testState = {
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
  }
  expect(reducer(testState, clearDisputeGames())).toEqual({
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [1, 2, 3],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [],
    },
  });
});

test("Should return lobbyGames.pageSize when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 0,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 0,
        games: [1, 2, 3],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 0,
        games: [1, 2, 3],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 0,
        games: [1, 2, 3],
      },
    }
  };
  expect(selectLobbyGamesPageSize(testState)).toBe(12);
});

test("Should return lobbyGames.games when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 0,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 0,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 0,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 0,
        games: [9],
      },
    }
  };
  expect(selectLobbyGames(testState)).toEqual([1, 2, 3]);
});

test("Should return lobbyGames.totalGamesCount when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectTotalLobbyGamesCount(testState)).toBe(3);
});

test("Should return userGames.pageSize when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectUserGamesPageSize(testState)).toBe(10);
});

test("Should return userGames.games when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectUserGames(testState)).toEqual([4, 5, 6]);
});

test("Should return userGames.totalGamesCount when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectTotalUserGamesCount(testState)).toBe(3);
});

test("Should return userGamesArchive.pageSize when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectUserGamesArchivePageSize(testState)).toBe(10);
});

test("Should return userGamesArchive.games when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectUserGamesArchive(testState)).toEqual([7, 8]);
});

test("Should return userGamesArchive.totalGamesCount when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectTotalUserGamesArchiveCount(testState)).toBe(2);
});

test("Should return disputeGames.pageSize when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectDisputeGamesPageSize(testState)).toBe(12);
});

test("Should return disputeGames.games when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectDisputeGames(testState)).toEqual([9]);
});

test("Should return disputeGames.totalGamesCount when called selector", () => {
  const testState = {
    games: {
      lobbyGames: {
        pageSize: 12,
        totalGamesCount: 3,
        games: [1, 2, 3],
      },
      userGames: {
        pageSize: 10,
        totalGamesCount: 3,
        games: [4, 5, 6],
      },
      userGamesArchive: {
        pageSize: 10,
        totalGamesCount: 2,
        games: [7, 8],
      },
      disputeGames: {
        pageSize: 12,
        totalGamesCount: 1,
        games: [9],
      },
    }
  };
  expect(selectTotalDisputeGamesCount(testState)).toBe(1);
});