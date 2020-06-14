import io from 'socket.io-client';

export class StrategoServerConnection {
  connect() {
    const server = "http://webprogramozas.inf.elte.hu:3030";
    this.socket = io(server);
  }
 
  get isConnected() {
    return Boolean(this.socket);
  }
}

export const strategoServerConnection = new StrategoServerConnection();

 /*
  sendMessage(target, message) {
    this.socket.emit(target, message);
  }

  onReceiveMessage(target, callback) {
    const listener = (message) => {
      if (this.socket.id !== message.emitter) {
        callback(message);
      }
    };
    this.socket.on(target, listener);
    return () => this.socket.off(target, listener);
  }
  */