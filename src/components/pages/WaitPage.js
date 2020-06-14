import React from 'react';
import { HomeButton } from "../context.js";
import { states, setPage, getRoomId } from '../redux/stateManagement.js';
import { useDispatch, useSelector } from "react-redux";
import { strategoServerConnection } from '../websocket/strategoServerConnection.js';


export function WaitPage() {
  const roomNr = useSelector(getRoomId);
  const dispatch = useDispatch();
  strategoServerConnection.socket.on("room-is-full", (ack) => {
    console.log(ack);
    dispatch(setPage(states.PREP));
  }); 

  return (
    <>
    <h3>Várakozás második játékosra.</h3>
    <p>Szoba azonosítója: {roomNr}.</p>
    <HomeButton/>
    </>
  );
}

export default WaitPage;