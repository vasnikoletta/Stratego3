import { createStore, combineReducers } from "redux";

export const SIZE = 6;
export const NUMOFSOLDIERS = 2*SIZE-3;
const bombList = [1, 2];
const soldierList = [1, 2, 2, 3, 3, 4, 6, 8, 10];
const enemyList = ["F", "B", 6, 10, 8, 3, "B", 3, 2, 2, 1, 4];

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


export const states = {
  MAIN: "MAIN_PAGE",
  WAIT: "WAITING_FOR_SECOND_PLAYER",
  PREP: "PREPARE_GAME",
  GAME: "IN_GAME"
}

function createEnemy() {
  let listOfEnemy = [];
  let soldierID = 200;
  enemyList.map(sc => (
    listOfEnemy.push({index: soldierID++, score: sc, player: 2})
  ));
  return listOfEnemy;
}

function createInitialBoard(size) {
  
  const initialEnemy = createEnemy();
  let board = [...initialEnemy];
  for (let i = 2; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      board.push({index: (i%size)*size + j, score: "", player: 0});
    }
  }
  return board;
}

function createArmy() {
  let listOfPieces = [];
  let soldierID = 100;
  listOfPieces.push({_id: soldierID++, score: "F", player: 1});
  bombList.map(bomb => (
    listOfPieces.push({_id: soldierID++, score: "B", player: 1})
  ));
  soldierList.map(sc => (
    listOfPieces.push({_id: soldierID++, score: sc, player: 1})
  ));
  return listOfPieces;
}

export const initialPrepState = createInitialBoard(SIZE);
export const initialArmy = createArmy();

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

const outOfBattleReducer1 = (state = initialArmy, action) => {
  const { type, payload } = action;

  if (type === OOB1) {
    return payload;
  }

  return state;
};

const outOfBattleReducer2 = (state = [], action) => {
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

const rootReducer = combineReducers({
  page: pageReducer,
  player: playerReducer,
  appointed: appointReducer,
  board: boardReducer,
  outOfBoard1: outOfBattleReducer1,
  outOfBoard2: outOfBattleReducer2,
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
