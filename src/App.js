import React from 'react';
import logo from './logo/stratego.jpg';
import './App.css';
import { Navigation } from "./components/context.js";
import { Rules, ShowRulesButton } from "./components/hiddenElements.js";
import { strategoServerConnection } from './components/websocket/strategoServerConnection';
/*
import { useEffect } from 'react';
import { Provider, useDispatch } from "react-redux";
import { store } from "./components/redux/stateManagement.js";
import { webSocket, webSocketConnect } from './components/websocket/strategoServerConnection';
*/

function App() {

  strategoServerConnection.connect();

  if (strategoServerConnection.isConnected) {
    console.log("Csatlakoztatva a szerverhez.");
  } else {
    console.log("Csatlakozás a szerverhez sikertelen.");
  }
  /*
  constructor(props) {
    super(props)
    webSocket.connectToServer()
  }
  */
  /*
  const dispatch = useDispatch()  
  useEffect(() => {
      dispatch(webSocketConnect())
  }, [dispatch])
  */
  //dispatch(webSocketConnect());
  //webSocket.connectToServer();

  /*
-> index.js-be
      <Provider store = { store }>
</Provider>
  */

  return (
    <div className="App">
      <header className="App-header">
      <img src={logo} alt="logo" className="App-logo" />
      <ShowRulesButton></ShowRulesButton>
      <Rules></Rules>
      </header>
      <div className="App-body">
        <Navigation/>
      </div>
    </div>
  );
}

export default App;