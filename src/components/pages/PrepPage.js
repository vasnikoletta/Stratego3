import React from 'react';
import { GameButton, HomeButton } from '../context';
import { SIZE, setPage, getOutOfBattle1, setPlayer2Status, getBoard, getAppointed, setOOB1, setBoard } from '../redux/stateManagement.js';
import { states, getStartPos1, setStartPos1, appointPiece, getPlayer1Status, getPlayer2Status } from '../redux/stateManagement.js';
import { useDispatch, useSelector } from 'react-redux';
import { Piece } from '../pieces/pieces.js';
import { strategoServerConnection } from '../websocket/strategoServerConnection.js';

export function PrepPage() {
  let armyList1 = useSelector(getOutOfBattle1);
  let boardState = useSelector(getBoard);
  let startpos1 = useSelector(getStartPos1);
  const isPlyr1Ready = useSelector(getPlayer1Status);
  const isPlyr2Ready = useSelector(getPlayer2Status);
  const appointed = useSelector(getAppointed);
  const dispatch = useDispatch();

  strategoServerConnection.socket.on("state-changed", (ack) => {
    console.log(ack);
    dispatch(setPlayer2Status(ack.state));
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
          if (index >= 24) classNames = "prep-field-cell free-prep-field-cell";
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
    
    if (appointed !== null && indx >= 24 && plyr === 0) {
      
      const newOob = armyList1.filter((s) => s._id !== appointed.id);
      const newBoardState = [...boardState];
      let newStartPosition = [...startpos1];
      let selectedPiece = armyList1.find((s) => s._id === appointed.id);
      if (selectedPiece === undefined) {
        selectedPiece = boardState.find((s) => s.index === appointed.id && s.player !== 0);
        const clearPosition = {index: boardState.indexOf(selectedPiece), score: "", player: 0};
        newBoardState[indx] = selectedPiece;
        
        newStartPosition[indx-24] = selectedPiece;
        newBoardState[boardState.indexOf(selectedPiece)] = clearPosition;
        newStartPosition[boardState.indexOf(selectedPiece)-24] = clearPosition; 
        dispatch(setBoard(newBoardState));
        dispatch(setStartPos1(newStartPosition));
      } else {

        const newPieceOnBoard = {index: selectedPiece._id, score: selectedPiece.score, player: selectedPiece.player};
        newBoardState[indx] = newPieceOnBoard;
        newStartPosition[indx-24] = newPieceOnBoard;
        dispatch(setOOB1(newOob));
        dispatch(setBoard(newBoardState));
        dispatch(setStartPos1(newStartPosition));
      }
        dispatch(appointPiece(null));
    }
  };

  const handleHandClick = () => {
    if (appointed !== null) {
      let selectedPiece = armyList1.find((s) => s._id === appointed.id);
      if (selectedPiece === undefined) {
        
        selectedPiece = boardState.find((s) => s.index === appointed.id && s.player !== 0);
        const newPieceInHand = {_id: selectedPiece.index, score: selectedPiece.score, player: selectedPiece.player};
        const clearPosition = {index: boardState.indexOf(selectedPiece), score: "", player: 0};
        
        let newArmyList = [...armyList1];
        newArmyList.push(newPieceInHand);
        let newBoardState = [...boardState];
        let newStartPosition = [...startpos1];
        newBoardState[boardState.indexOf(selectedPiece)] = clearPosition;
        newStartPosition[boardState.indexOf(selectedPiece)-24] = clearPosition;
        
        dispatch(setOOB1(newArmyList));
        dispatch(setBoard(newBoardState));
        dispatch(appointPiece(null));
        dispatch(setStartPos1(newStartPosition));
      }
    }
  };
  
  const army = [];
  armyList1.map((p) => army.push(<Piece attrs = {[p.score, p._id]}></Piece>));

  return (
    <>
    <div className = "preparation">
      <h3>ELŐKÉSZÍTÉS</h3>
      <p>Hozd létre a sereged kezdőállását!</p>
      <p>A zászló (F), a bombák (B) és a katonák az egérrel jelölhetők ki, majd egérkattintással illeszthetők a megengedett - sárga keretes - mezőkbe.
        Ha meggondolod magad, változtathatsz a bábu elhelyezésén.
        A különböző rangú katonák tulajdonságainak leírását a játékszabályoknál találod.
      </p>
      
      {createTable(boardState)}
      
      <div className = "army" onClick = {handleHandClick}>
       
        { army }

      </div>
      <GameButton/>
      <HomeButton/>
    </div>
    </>
  );
}

export default PrepPage;