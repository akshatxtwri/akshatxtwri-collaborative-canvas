export default function SocketClient(){

  const sock = io()

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
