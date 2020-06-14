import React from 'react';
import { GameButton, HomeButton } from '../context';
import { SIZE, getOutOfBattle2, getBoard, getAppointed, setOOB2, setPage, states, getPlayer1Status, getPlayer2Status } from '../redux/stateManagement.js';
import { setBoard, appointPiece, getStartPos2, setStartPos2, setPlayer1Status } from '../redux/stateManagement.js';
import { useDispatch, useSelector } from 'react-redux';
import { Piece } from '../pieces/pieces.js';
import {strategoServerConnection} from '../websocket/strategoServerConnection.js';

export function PrepPage2() {
  //const room = 1;
  let armyList2 = useSelector(getOutOfBattle2);
  let boardState = useSelector(getBoard);
  let startpos2 = useSelector(getStartPos2);
  const isPlyr1Ready = useSelector(getPlayer1Status);
  const isPlyr2Ready = useSelector(getPlayer2Status);
  const appointed = useSelector(getAppointed);
  const dispatch = useDispatch();

  strategoServerConnection.socket.on("state-changed", (ack) => {
    console.log(ack);
    dispatch(setPlayer1Status(ack.state));
  });

  if (isPlyr1Ready && isPlyr2Ready) {
    dispatch(setPage(states.GAME));
  }

  function createTable(boardSt) {
    let table = [];
    let classNames = "prep-field-cell";
    for (let i = 0; i < SIZE; ++i) {
      let child = [];
      for (let j = 0; j < SIZE; ++j) {
        let index = boardSt[(i % SIZE)*SIZE + j].index;
        let player = boardSt[(i % SIZE)*SIZE + j].player;
        let score = boardSt[(i % SIZE)*SIZE + j].score;

        if (player === 0) {
          if (index < 12) { classNames = "prep-field-cell free-prep-field-cell";
        } else {
          classNames = "prep-field-cell";
        }
        child.push(<td className={ classNames } plyr = {player} ind = {index}> { index } </td>);
        } else {
          classNames = "prep-field-cell";
          child.push(<td className={ classNames } plyr = {player} ind = {index}><Piece attrs = {[ score, index ]} ></Piece></td>);
        }
      }
      table.push(<tr>{child}</tr>);
    }
    return <table className="prep-field" onClick={handlePrepBoardClick}><tbody>{table}</tbody></table>;
  }

  const handlePrepBoardClick = (e) => {
    
    const cell = e.target;
    const indx = parseInt(cell.getAttribute("ind"));
    const plyr = parseInt(cell.getAttribute("plyr"));
    
    if (appointed !== null && indx < 12 && plyr === 0) {
      
      const newOob = armyList2.filter((s) => s._id !== appointed.id);
      const newBoardState = [...boardState];
      let newStartPosition = [...startpos2];
      let selectedPiece = armyList2.find((s) => s._id === appointed.id);
      if (selectedPiece === undefined) {
        selectedPiece = boardState.find((s) => s.index === appointed.id && s.player !== 0);
        const clearPosition = {index: boardState.indexOf(selectedPiece), score: "", player: 0};
        newBoardState[indx] = selectedPiece;
        newStartPosition[indx] = selectedPiece;
        newBoardState[boardState.indexOf(selectedPiece)] = clearPosition;
        newStartPosition[boardState.indexOf(selectedPiece)] = clearPosition; 
        dispatch(setBoard(newBoardState));
        dispatch(setStartPos2(newStartPosition));
      } else {

        const newPieceOnBoard = {index: selectedPiece._id, score: selectedPiece.score, player: selectedPiece.player};
        newBoardState[indx] = newPieceOnBoard;
        newStartPosition[indx] = newPieceOnBoard;
        dispatch(setOOB2(newOob));
        dispatch(setBoard(newBoardState));
        dispatch(setStartPos2(newStartPosition));
      }
        dispatch(appointPiece(null));
    }
  };

  const handleHandClick = () => {
    if (appointed !== null) {
      let selectedPiece = armyList2.find((s) => s._id === appointed.id);
      if (selectedPiece === undefined) {
        
        selectedPiece = boardState.find((s) => s.index === appointed.id && s.player !== 0);
        const newPieceInHand = {_id: selectedPiece.index, score: selectedPiece.score, player: selectedPiece.player};
        const clearPosition = {index: boardState.indexOf(selectedPiece), score: "", player: 0};
        
        let newArmyList = [...armyList2];
        newArmyList.push(newPieceInHand);
        let newBoardState = [...boardState];
        let newStartPosition = [...startpos2];
        newBoardState[boardState.indexOf(selectedPiece)] = clearPosition;
        newStartPosition[boardState.indexOf(selectedPiece)] = clearPosition;
        
        dispatch(setOOB2(newArmyList));
        dispatch(setBoard(newBoardState));
        dispatch(setStartPos2(newStartPosition));
        dispatch(appointPiece(null));
      }
    }
  };
  
  const army = [];
  armyList2.map((p) => army.push(<Piece attrs = {[p.score, p._id]}></Piece>));

  return (
    <>
    <div className = "preparation">
      <h3>ELŐKÉSZÍTÉS</h3>
      <p>Hozd létre a sereged kezdőállását!</p>
      <p>A zászló (F), a bombák (B) és a katonák az egérrel jelölhetők ki, majd egérkattintással illeszthetők a megengedett - sárga keretes - mezőkbe.
        Ha meggondolod magad, változtathatsz a bábu elhelyezésén.
        A különböző rangú katonák tulajdonságainak leírását a játékszabályoknál találod.
      </p>

      <div className = "army" onClick = {handleHandClick}>
       
        { army }

      </div>
      
      {createTable(boardState)}
      
      <GameButton/>
      <HomeButton/>
    </div>
    </>
  );
}

export default PrepPage2;