import { createStore, combineReducers } from "redux";
export const SIZE = 6;
export const NUMOFSOLDIERS = 2*SIZE-3;
const bombList = [1, 2];
const soldierList = [1, 2, 2, 3, 3, 4, 6, 8, 10];

const PAGE = "PAGE";
const APPOINT = "APPOINT";
const PLAYER = "PLAYER";
const BOARD = "BOARD";
const OOB1 = "OOB1";
const OOB2 = "OOB2";
const GAMEOVER = "GAMEOVER";
const ROOM = "ROOM";
const PLAYERSTATUS1 = "PLAYERSTATUS1";
const PLAYERSTATUS2 = "PLAYERSTATUS2";
const PLAYERSOCKETID1 = "PLAYERSOCKET1";
const PLAYERSOCKETID2 = "PLAYERSOCKET2";
const STARTPOS1 = "STARTPOS1";
const STARTPOS2 = "STARTPOS2";
const GAMEBOARD = "GAMEBOARD";


export const states = {
  MAIN: "MAIN_PAGE",
  WAIT: "WAITING_FOR_SECOND_PLAYER",
  PREP: "PREPARE_GAME",
  PREP2: "PREPARE_GAME_2",
  GAME: "IN_GAME"
}

function createInitialBoard(size) {
  
  let board = [];
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      board.push({index: (i%size)*size + j, score: "", player: 0});
    }
  }
  return board;
}

function createInitialStartPos2(size) {
  let startpos = [];
  for (let i = 0; i < 2; ++i) {
    for (let j = 0; j < size; ++j) {
      startpos.push({index: (i%size)*size + j, score: "", player: 0});
    }
  }
  return startpos;
}

function createInitialStartPos1(size) {
  let startpos = [];
  for (let i = 4; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      startpos.push({index: (i%size)*size + j, score: "", player: 0});
    }
  }
  return startpos;
}

function createArmy(playerId) {
  let listOfPieces = [];
  let soldierID = 100;
  listOfPieces.push({_id: soldierID++, score: "F", player: playerId});
  bombList.map(bomb => (
    listOfPieces.push({_id: soldierID++, score: "B", player: playerId})
  ));
  soldierList.map(sc => (
    listOfPieces.push({_id: soldierID++, score: sc, player: playerId})
  ));
  return listOfPieces;
}

export const initialPrepState = createInitialBoard(SIZE);
export const initialArmy = createArmy(1);
export const initialArmy2 = createArmy(2);
const initialStartPos1 = createInitialStartPos1(SIZE);
const initialStartPos2 = createInitialStartPos2(SIZE);

const pageReducer = (state = states.MAIN, action) => {
  const { type, payload } = action;

  if (type === PAGE) {
    return payload;
  }

  return state;
};

const playerReducer = (state = 1, action) => {
  const {type, payload } = action;
  if (type === PLAYER) {
    return payload;
  }

  return state;
};

const appointReducer = (state = null, action) => {
  const { type, payload } = action;
  if (type === APPOINT  ) {
    return payload;
  }
  return state;
};

const boardReducer = (state = initialPrepState, action) => {
  const {type, payload } = action;
  
  if (type === BOARD) {
    return payload;
  }

  return state;
};

const gameBoardReducer = (state = initialPrepState, action) => {
  const {type, payload } = action;
  
  if (type === GAMEBOARD) {
    return payload;
  }

  return state;
};

const outOfBattleReducer1 = (state = initialArmy, action) => {
  const { type, payload } = action;

  if (type === OOB1) {
    return payload;
  }

  return state;
};

const outOfBattleReducer2 = (state = initialArmy2, action) => {
  const { type, payload } = action;

  if (type === OOB2) {
    return payload;
  }

  return state;
};

const gameOverReducer = (state = false, action) => {
  const {type, payload } = action;

  if (type === GAMEOVER) {
    return payload;
  }
  return state;
};

const roomReducer = (state = null, action) => {
  const {type, payload} = action;
  if (type === ROOM) {
    return payload;
  }
  return state;
};

const player1isReadyReducer = (state = false, action) => {
  const {type, payload} = action;
  if (type === PLAYERSTATUS1) {
    return payload;
  }
  return state;
};

const player2isReadyReducer = (state = false, action) => {
  const {type, payload} = action;
  if (type === PLAYERSTATUS2) {
    return payload;
  }
  return state;
};

const player1idReducer = (state = null, action) => {
  const {type, payload} = action;
  if (type === PLAYERSOCKETID1) {
    return payload;
  }
  return state;
};

const player2idReducer = (state = null, action) => {
  const {type, payload} = action;
  if (type === PLAYERSOCKETID2) {
    return payload;
  }
  return state;
};

const startReducer1 = (state = initialStartPos1, action) => {
  const {type, payload} = action;
  if (type === STARTPOS1) {
    return payload;
  }
  return state;
};

const startReducer2 = (state = initialStartPos2, action) => {
  const {type, payload} = action;
  if (type === STARTPOS2) {
    return payload;
  }
  return state;
};

const rootReducer = combineReducers({
  page: pageReducer,
  player: playerReducer,
  appointed: appointReducer,
  board: boardReducer,
  gameBoard: gameBoardReducer,
  outOfBoard1: outOfBattleReducer1,
  outOfBoard2: outOfBattleReducer2,
  player1StartPosition: startReducer1,
  player2StartPosition: startReducer2,
  gameOver: gameOverReducer,
  roomId: roomReducer,
  player1socketId: player1idReducer,
  player2socketId: player2idReducer,
  player1isReady: player1isReadyReducer,
  player2isReady: player2isReadyReducer
});

export const store = createStore(rootReducer);

export const getPage = (state) => state.page;
export const getPlayer = (state) => state.player;
export const getAppointed = (state) => state.appointed;
export const getBoard = (state) => state.board;
export const getOutOfBattle1 = (state) => state.outOfBoard1;
export const getOutOfBattle2 = (state) => state.outOfBoard2;
export const isGameOver = (state) => state.gameOver;
export const getRoomId = (state) => state.roomId;
export const getPlayer1Status = (state) => state.player1isReady;
export const getPlayer2Status = (state) => state.player2isReady;
export const getPlayer1SocketId = (state) => state.player1socketId;
export const getPlayer2SocketId = (state) => state.player2socketId;
export const getStartPos1 = (state) => state.player1StartPosition;
export const getStartPos2 = (state) => state.player2StartPosition;
export const getGameBoard = (state) => state.gameBoard;

//action creators
export const setPage = (x) => ({
  type: PAGE,
  payload: x
});

export const tooglePlayer = (x) => ({
  type: PLAYER,
  payload: x
});

export const appointPiece = (piece) => ({
  type: APPOINT,
  payload: piece
});

export const setBoard = (board) =>({
  type: BOARD,
  payload: board
});

export const setOOB1 = (soldierList) =>({
  type: OOB1,
  payload: soldierList
});

export const setOOB2 = (soldierList) =>({
  type: OOB2,
  payload: soldierList
});

export const setGameOver = (x) => ({
  type: GAMEOVER,
  payload: x
});

export const saveRoomId = (x) => ({
  type: ROOM,
  payload: x
});

export const savePlayer1SocketId = (x) => ({
  type: PLAYERSOCKETID1,
  payload: x
});

export const savePlayer2SocketId = (x) => ({
  type: PLAYERSOCKETID2,
  payload: x
});

export const setPlayer1Status = (b) => ({
  type: PLAYERSTATUS1,
  payload: b
});

export const setPlayer2Status = (b) => ({
  type: PLAYERSTATUS2,
  payload: b
});

export const setStartPos1 = (x) => ({
  type: STARTPOS1,
  payload: x
});

export const setStartPos2 = (x) => ({
  type: STARTPOS2,
  payload: x
});

export const setGameBoard = (x) => ({
  type: GAMEBOARD,
  payload: x
});
