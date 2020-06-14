import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { appointPiece, getAppointed, getPlayer } from "../redux/stateManagement.js";

export const Piece = ({ attrs }) => {
  const [score, id] = attrs;
  const appointed = useSelector(getAppointed);
  const player = useSelector(getPlayer);
  const dispatch = useDispatch();

  let classNames = "piece";
  if (appointed !== null && appointed.id === id && id >= player*100) {
    classNames += " selected-piece";
  }
  
  const handleClick = () => {
    if (appointed !== null && appointed.id === id) {
      dispatch(appointPiece(null));
    } else if (player === 1 && id < 200) {
      dispatch(appointPiece({id}));  
    } else if (player === 2 && id >= 200) {
      dispatch(appointPiece({id}));
    }
  };

  if (id >= 200) classNames += " enemyPiece";

  return (
    <div className = { classNames } onClick = { handleClick }>
      <p>{ score }</p>
    </div>
  );
}