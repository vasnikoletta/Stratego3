import React from 'react';
import { MainPage } from './pages/MainPage.js';
import { WaitPage } from './pages/WaitPage.js';
import { PrepPage } from './pages/PrepPage.js';
import { GamePage } from './pages/GamePage.js';
import { states, getPage, setPage, getOutOfBattle1, setBoard, initialPrepState, initialArmy, setOOB1, setOOB2, setGameOver, saveRoomId } from './redux/stateManagement.js';
import { useDispatch, useSelector } from "react-redux";
import { strategoServerConnection } from './websocket/strategoServerConnection.js';

export const Navigation = () => {
  const page = useSelector(getPage);
  
  if (page === states.MAIN) {
    return (
      <MainPage></MainPage>
    );
  } else if (page === states.WAIT) {
    return (
      <WaitPage></WaitPage>
    );
  } else if (page === states.PREP) {
    return (
      <PrepPage></PrepPage>
    );
  } else if (page === states.GAME) {
    return (
      <GamePage></GamePage>
    );
  } else {
    console.log("A default agon vagyunk.");
    return (
      <MainPage></MainPage>
    );
  }
}

export const HomeButton = () => {
  
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setBoard(initialPrepState));
    dispatch(setOOB1(initialArmy));
    dispatch(setOOB2([]));
    dispatch(setPage(states.MAIN));
    dispatch(setGameOver(false));
  }

  return (
    <button onClick={handleClick}>
      Vissza
    </button>
  );
}

export const WaitButton = () => {
  const dispatch = useDispatch();
  const handleClick = () => {
    strategoServerConnection.socket.emit("create-room", (ack) => {
      if (ack.status === "ok") {
        console.log(ack.roomId);
        dispatch(saveRoomId(ack.roomId));
        dispatch(setPage(states.WAIT));
      } else {
        console.log(ack.message);
      }
    });
  };
  
  return (
    <button onClick={handleClick}>
      Új játék
    </button>
  );
}

export const PrepButton = () => {
  const dispatch = useDispatch();
  const handleClick = () => dispatch(setPage(states.PREP));
  
  return (
    <button onClick={handleClick}>
      Előkészítés
    </button>
  );
}

export const GameButton = () => {
  let armyList = useSelector(getOutOfBattle1);
  const dispatch = useDispatch();
  const handleClick = () => dispatch(setPage(states.GAME));
  
  if (armyList.length > 0) {
    return (
      <button onClick={handleClick} disabled>
        Tovább
      </button>
    );
  } else {
    return (
      <button onClick={handleClick}>
        Tovább
      </button>
    );
  }
}