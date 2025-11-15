export default function SocketClient(){

 const socket = io("https://akshatxtwri-collaborative-canvas-backend.onrender.com", {
    transports: ["websocket"]
});

  function on(e,f){
      sock.on(e,f)
  }

  function join(r,m){
      sock.emit("join",{roomId:r,meta:m})
  }

  function sendStroke(o){
      sock.emit("op",o)
  }

  function sendUndo(){
      sock.emit("undo")
  }

  function sendRedo(){
      sock.emit("redo")
  }

  function sendCursor(c){
      sock.emit("cursor",c)
  }


  return{
      on,
      join,
      sendStroke,
      sendUndo,
      sendRedo,
      sendCursor,
      raw:sock
  }

}
