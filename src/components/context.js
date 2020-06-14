import React from 'react';
import { MainPage } from './pages/MainPage.js';
import { WaitPage } from './pages/WaitPage.js';
import { PrepPage } from './pages/PrepPage.js';
import { PrepPage2 } from './pages/PrepPage2.js';
import { GamePage } from './pages/GamePage.js';
import { states, getPage, setPage, getOutOfBattle1, setBoard, initialPrepState, initialArmy, setOOB1, setOOB2, setGameOver, saveRoomId, getOutOfBattle2, setPlayer1Status, getPlayer1Status, getPlayer2Status, setPlayer2Status, store } from './redux/stateManagement.js';
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
  } else if (page === states.PREP2) {
    return (
      <PrepPage2></PrepPage2>
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
  let actualPage = useSelector(getPage);
  let armyList1 = useSelector(getOutOfBattle1);
  let armyList2 = useSelector(getOutOfBattle2);
  let isPlyr1Ready = useSelector(getPlayer1Status);
  let isPlyr2Ready = useSelector(getPlayer2Status);
  const dispatch = useDispatch();

  if (isPlyr1Ready && isPlyr2Ready) {
    dispatch(setPage(states.GAME));
  }

  
  const handleClick = () => {
    if (actualPage === states.PREP) {
      dispatch(setPlayer1Status(true));
      strategoServerConnection.socket.emit("sync-state", isPlyr1Ready, true, (ack) => {
        if (ack.status === "ok") {
          console.log("Az állapot szerver felé elküldve.");
        } else {
          console.log(ack.message);
        }
      });

    } else if (actualPage === states.PREP2) {
      dispatch(setPlayer2Status(true));
      strategoServerConnection.socket.emit("sync-state", isPlyr2Ready, true, (ack) => {
        if (ack.status === "ok") {
          console.log("Az állapot szerver felé elküldve.");
        } else {
          console.log(ack.message);
        }
      });
    }
    
  };
  
  if ((actualPage === states.PREP && armyList1.length > 0) || (actualPage === states.PREP2 && armyList2.lenth > 0)) {
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