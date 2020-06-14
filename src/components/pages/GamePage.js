import React from 'react';
import { HomeButton } from "../context.js";
import { getBoard, getOutOfBattle1, getOutOfBattle2, getPlayer, getAppointed, isGameOver } from '../redux/stateManagement.js';
import { initialPrepState, initialArmy, SIZE, NUMOFSOLDIERS} from '../redux/stateManagement.js';
import { setBoard, setOOB1, setOOB2, appointPiece, tooglePlayer, setGameOver } from '../redux/stateManagement.js';
import { useDispatch, useSelector } from "react-redux";
import { Piece } from '../pieces/pieces.js';

export function GamePage() {
  const actPlayer = useSelector(getPlayer);
  const appointed = useSelector(getAppointed);
  const boardState = useSelector(getBoard);
  const oob1 = useSelector(getOutOfBattle1);
  const oob2 = useSelector(getOutOfBattle2);
  //const isGO = useSelector(isGameOver);
  const dispatch = useDispatch();
  
  function showAvailableFields() {
    let availables = [];
    if (appointed != null) {
      const appointedPiece = boardState.find((s) => s.index === appointed.id);
      const score = appointedPiece.score;
      const index = boardState.indexOf(appointedPiece);
      if (score !== 2 && score !== "B" && score !== "F") {
        if (index - SIZE >= 0) availables.push(index-SIZE);
        if (index + SIZE < SIZE*SIZE) availables.push(index+SIZE);
        if (index % SIZE > 0) availables.push(index-1);
        if (index % SIZE < SIZE-1) availables.push(index+1);
      } else if (score === 2) {
        let tempind = index - SIZE;
        while (tempind >= 0 && boardState[tempind].player === 0) {
          availables.push(tempind);
          tempind -= SIZE;
        }
        if (tempind > 0 && boardState[tempind].player !== actPlayer) {
          availables.push(tempind);
        }
        tempind = index + SIZE;
        while (tempind < SIZE*SIZE && boardState[tempind].player === 0) {
          availables.push(tempind);
          tempind += SIZE;
        }
        if (tempind < SIZE*SIZE && boardState[tempind].player !== actPlayer) {
          availables.push(tempind);
        }
        tempind = index;
        while (tempind % SIZE > 0 && boardState[tempind-1].player === 0) {
          tempind -= 1;
          availables.push(tempind);
        }
        if (tempind % SIZE > 0 && boardState[tempind-1].player !== actPlayer) {
          availables.push(tempind-1);
        }
        tempind = index;
        while (tempind % SIZE < SIZE-1 && boardState[tempind+1].player === 0) {
          tempind += 1;
          availables.push(tempind);
        }
        if (tempind % SIZE < SIZE-1 && boardState[tempind+1].player !== actPlayer) {
          availables.push(tempind+1);
        }
      }
    }
    return availables;
  }

  function createBoard(boardSt) {
    let table = [];
    let availables = [];
    if (appointed != null) availables = showAvailableFields();
    //console.log("A tablazat cellainak adaatai:");
    for (let i = 0; i < SIZE; ++i) {
      let child = [];
      for (let j = 0; j < SIZE; ++j) {
        let ind = (i % SIZE)*SIZE + j;
        let index = boardSt[ind].index;
        let player = boardSt[ind].player;
        let score = boardSt[ind].score;
        let classNames = "prep-field-cell";
        //console.log("index: " + ind + ", id: " + index + ", player: " + player + ", score: " + score + ".");
        let isAvailable = availables.filter((i) => i === ind);
        
        if (isAvailable.length > 0 && actPlayer !== player) classNames = "prep-field-cell available-board-cell";

        if (player === 0) {
          child.push(<td className={ classNames } plyr = {player} ind = {index}>{ index }</td>);
        } else {
          child.push(<td className={ classNames } plyr = {player} ind = {index}><Piece attrs = {[ score, index ]} ></Piece></td>);
        }
      }
      table.push(<tr>{child}</tr>);
    }
    return <table className="board" onClick = {handleStep}><tbody>{table}</tbody></table>;
  }

  const handleStep = (e) => {
    const cell = e.target;
    const indx = parseInt(cell.getAttribute("ind"));
    const plyr = parseInt(cell.getAttribute("plyr"));

    if (appointed !== null && plyr !== actPlayer) {
      const availableCells = showAvailableFields();
      const clickedBoardCell = boardState.find((s) => s.index === indx);
      const toIndex = boardState.indexOf(clickedBoardCell);
      const selectedPiece = boardState.find((s) => s.index === appointed.id);
      const fromIndex = boardState.indexOf(selectedPiece);
      
      if (availableCells.find((e) => e === toIndex) !== undefined) {
        
        if (boardState[toIndex].player === 0) {
          stepToEmptyField(toIndex, fromIndex, selectedPiece);
        } else {
          console.log("Tamadas!");
          console.log("Tamado: " + actPlayer + ". jatekos, ereje: " + selectedPiece.score + ".");
          console.log("A megtamadott jatekos ereje: " + clickedBoardCell.score + ".");
          battle(toIndex, fromIndex);
        }
      }
    }
  };

  const stepToEmptyField = (toIndex, fromIndex, selectedPiece) => {
        let newBoardState = [...boardState];
        const clearPosition = {index: fromIndex, score: "", player: 0};
        newBoardState[fromIndex] = clearPosition;
        newBoardState[toIndex] = selectedPiece;
        dispatch(setBoard(newBoardState));
        dispatch(appointPiece(null));
        changePlayer();

  };

  const battle = (toIndex, fromIndex) => {
    let selectedPiece = boardState[fromIndex];
    let attackedPiece = boardState[toIndex];
    if (attackedPiece.score === "B") {
      if (selectedPiece.score === 3) {
        deactivateBomb(toIndex, fromIndex, selectedPiece);
      } else {
        attackerDies(fromIndex, selectedPiece);  
      }
      
    } else if (attackedPiece.score === "F") {
      attackerWins();
    } else if (selectedPiece.score === 1 && attackedPiece.score === 10) {
      attackedDies(fromIndex, toIndex, selectedPiece, attackedPiece);
    } else if (selectedPiece.score === 10 && attackedPiece.score === 1) {
      attackerDies(fromIndex, toIndex, selectedPiece);
    } else if (selectedPiece.score < attackedPiece.score) {
      attackerDies(fromIndex, selectedPiece);
    } else if (selectedPiece.score > attackedPiece.score) {
      attackedDies(fromIndex, toIndex, selectedPiece, attackedPiece);
    } else if (selectedPiece.score === attackedPiece.score) {
      bothDies(fromIndex, toIndex, selectedPiece, attackedPiece);
    }
  };

  const deactivateBomb = (to, from, selected) => {
    let newBoardState = [...boardState];
    const clearPosition = {index: from, score: "", player: 0};
    newBoardState[to] = selected;
    newBoardState[from] = clearPosition;
    dispatch(setBoard(newBoardState));
    dispatch(appointPiece(null));
    changePlayer();
  };

  const attackerDies = (from, soldier) => {
    let attackerIsPlayer2 = soldier.index >= 200;
    let newBoardState = [...boardState];
    const clearPosition = {index: from, score: "", player: 0};
    if (attackerIsPlayer2) {
      let newOutOfBoard = [...oob2];
      newOutOfBoard.push(soldier);
      dispatch(setOOB2(newOutOfBoard));
    } else {
      let newOutOfBoard = [...oob1];
      newOutOfBoard.push(soldier);
      dispatch(setOOB1(newOutOfBoard));
    }
    newBoardState[from] = clearPosition;
    dispatch(setBoard(newBoardState));
    dispatch(appointPiece(null));
    changePlayer();
  };

  const attackedDies = (from, to, attacker, attacked) => {
    let attackerIsPlayer2 = attacker.index >= 200;
    let newBoardState = [...boardState];
    const clearPosition = {index: from, score: "", player: 0};
    newBoardState[to] = attacker;
    newBoardState[from] = clearPosition;
    let newOutOfBoard;
    if (attackerIsPlayer2) {
      newOutOfBoard = [...oob1];
      newOutOfBoard.push(attacked);
      dispatch(setOOB1(newOutOfBoard));
    } else {
      newOutOfBoard = [...oob2];
      newOutOfBoard.push(attacked);
      dispatch(setOOB2(newOutOfBoard));
    }
    dispatch(setBoard(newBoardState));
    dispatch(appointPiece(null));
    changePlayer();
  };

  const bothDies = (from, to, attacker, attacked) => {
    let newBoardState = [...boardState];
    let newOutOfBoard1 = [...oob1];
    let newOutOfBoard2 = [...oob2];
    let attackerIsPlayer2 = attacker.index >= 200;
    const clearPositionFrom = {index: from, score: "", player: 0};
    const clearPositionTo = {index: to, score: "", player: 0};
    if (attackerIsPlayer2) {
      newOutOfBoard2.push(attacker);
      newOutOfBoard1.push(attacked);
    } else {
      newOutOfBoard1.push(attacker);
      newOutOfBoard2.push(attacked);
    }
    dispatch(setOOB2(newOutOfBoard2));
    dispatch(setOOB1(newOutOfBoard1));
    newBoardState[from] = clearPositionFrom;
    newBoardState[to] = clearPositionTo;
    dispatch(setBoard(newBoardState));
    dispatch(appointPiece(null));
    changePlayer();
  };

  const attackerWins = () => {
    dispatch(setGameOver(true));
    dispatch(appointPiece(null));
    dispatch(setBoard(initialPrepState));
    dispatch(setOOB1(initialArmy));
    dispatch(setOOB2([]));
    console.log(actPlayer + ". számú játékos megszerezte a zászlót, igy megnyerte a játékot.");
  };

  const changePlayer = () => {
    if (actPlayer === 1) {
      dispatch(tooglePlayer(2));
    } else {
      dispatch(tooglePlayer(1));
    }
  };

  const checkNumberOfSoldiersAlive = () => {
    if (oob1.length === NUMOFSOLDIERS || oob2.length === NUMOFSOLDIERS) {
      //azon a jatekoson van a sor, aki mar nem tud lepni
      console.log("Az ellenség összes katonája meghalt.");
      dispatch(setGameOver(true));
    }
  };

  const Board = () => {
    checkNumberOfSoldiersAlive();
    const isGO = useSelector(isGameOver);
    let winnerPlayerNr = 0;
    if (oob1.length === NUMOFSOLDIERS) { 
      winnerPlayerNr = 2; 
    } else if (oob1.length === NUMOFSOLDIERS) {
      winnerPlayerNr = 1;
    } else if (isGO) {
      winnerPlayerNr = actPlayer;
    }
    let lost = [];
    oob1.map((s) => lost.push(<Piece attrs = {[s.score, s._id]} disabled></Piece>));

    if (isGO) {
      return (
        <>
        <div>
          <p>A játéknak vége.</p>
          <p>A győztes játékos száma: {winnerPlayerNr}.</p>
        </div>
        <div className = "lost">
          <div className = "cemetery">R.I.P.</div>
          <div className = "lost-soldiers">
            { lost }
          </div>
        </div>
        </>

      );
    } else { 

      return (
        <>
        <div>
          <p>A soron következő játékos: {actPlayer} .</p>
        </div>
        {createBoard(boardState)}
        <div className = "lost">
          <div className = "cemetery">R.I.P.</div>
          <div className = "lost-soldiers">
            { lost }
          </div>
        </div>
        </>
      );
    }
  }


  return (
    <>
    <div className = "game">
    <h3>Játék</h3>
    <Board></Board>
    <HomeButton/>
    </div>
    </>
  );
}

export default GamePage;