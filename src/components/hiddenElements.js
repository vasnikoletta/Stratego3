import React, { useState } from 'react';
import { HomeButton, PrepButton } from './context.js';
import { useDispatch, useSelector } from "react-redux";
import { states, setPage } from "./redux/stateManagement.js";
import { strategoServerConnection } from './websocket/strategoServerConnection.js';

export function Rules() {
  return (
    <>
    <div className="Rules">
      <h3>A STRATEGO játék szabályai</h3>
      <p>A játékban két játékos játszik egymással egy-egy hadsereg élén. Cél az ellenfél zászlójának megszerzése. 
        A tábla 10x10 cellából áll. Eredetileg mindkét félnek 40 bábuja van: 1 zászló, 6 bomba, és katonák 1-től 10-es erővel. 
        Egymás bábuit azonban nem látják, csak akkor, amikor két bábu csatázni kezd. Csata akkor jön létre, amikor egy katonánkkal olyan mezőre
        lépünk, ahol az ellenség egy katonája áll. Ekkor az erősebb bábu marad a pályán, a gyengébbik leesik a tábláról. 
        Ha két azonos bábu harcol egymással, akkor mindkettő lekerül a tábláról. Ha bombára lépünk, a katonánk felrobban, a bomba viszont megmarad.
      </p>
      <p>A sereg tagjai:</p>
      <ul>
        <li>1 Tábornagy (10)</li>
        <li>1 Tábornok (9)</li>
        <li>2 Ezredes (8)</li>
        <li>3 Őrnagy (7)</li>
        <li>4 Kapitány (6)</li>
        <li>4 Főhadnagy (5)</li>
        <li>4 Őrmester (4)</li>
        <li>5 Aknász (3)</li>
        <li>8 Felderítő (2)</li>
        <li>1 Kém (1)</li>
      </ul>
      <p>Minden bábu csak 1-et léphet előre, hátra, jobbra, balra. a zászló és az akna értelemszerűen nem tud lépni. 
        A táblán azokra a mezőkre, amelyeket nagyrészt tó fed, nem lehet lépni. 
        Van pár speciális figura:
      </p>
      <ul>
        <li>Felderítő (2): akárhány mezőt átugorva léphet vagy támadhat. A tavat ő sem tudja átugrani.</li>
        <li>Aknász (3): csak ő tudja hatástalanítani a bombát.</li>
        <li>Kém (1): ha támadóként kerül csatába a tábornaggyal (10), legyőzi. Minden más csatában viszont alulmarad.</li>
      </ul>
      <HideRulesButton></HideRulesButton>
    </div>
    </>
  );
}

const HideRulesButton = () => {
  function hideTheRules() {
    const rules = document.querySelector(".Rules");
    rules.style.display = "none";
  }
  return (
    <button onClick={hideTheRules}>Értem</button>
  );
}

export function ShowRulesButton() {
  function showTheRules() {
    const rules = document.querySelector(".Rules");
    rules.style.display = "block";
  }
  return (
    <button onClick={showTheRules}>Játékszabályok</button>
  );
}

export function ShowJoinPlatformButton() {
  function showJoinPlatform() {
    const joinPlatform = document.querySelector(".Join-Room");
    joinPlatform.style.display = "block";
  }
  return (
    <button onClick={showJoinPlatform}>Csatlakozás</button>
  );
}

export const JoinRoom = () => {
  const dispatch = useDispatch();
  //kell meg itt ellenorizni, h az a szoba van-e tele, amelyikbe csatlakozni akartam? (v a szerver biztosítja a jo mukodest?)
  strategoServerConnection.socket.on("room-is-full", (ack) => {
    console.log("Szerver szolt, h megvagyunk.");
    console.log(ack);
    dispatch(setPage(states.PREP));
  });

  const handleJoin = (e) => {
    const roomId = e.currentTarget.value;
    strategoServerConnection.socket.emit("join-room", roomId, (ack) => {
      console.log("csatlakozasi kiserlet szobahoz: "); 
      console.log(ack);
      if (ack.status === "error") {
        console.log("A szobához való csatlakozás sikertelen! " + ack.message);
      }
    });
  }

  return (
    <>
    <div className="Join-Room">
      <h3>Csatlakozás szobához</h3>
      <p>Add meg a szoba számát, amihez csatlakozni szeretnél.</p>

      <form>
        <div>
          <label>Szobaszám: </label>
          <input type="text" name="roomNr" onChange={handleJoin} />
        </div>
      </form>
    </div>
    </>
  );
}