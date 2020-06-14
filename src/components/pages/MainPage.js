import React from 'react';
import { WaitButton } from "../context.js";
import { ShowJoinPlatformButton, JoinRoom } from '../hiddenElements.js';

export function MainPage() {
  return (
    <>
      <h1>S T R A T E G O</h1>
      <p>Hozz létre új játékszobát, vagy csatlakozz valakihez, aki játszani szeretne!</p>
      <WaitButton/>
      <ShowJoinPlatformButton />
      <JoinRoom/>
    </>
  );
}

export default MainPage;