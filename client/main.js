

import CanvasController from "./canvas.js"
import SocketClient from "./websocket.js"


// ok grabbing stuff from html
const canvasEl    = document.getElementById("draw")
const canvas = CanvasController(canvasEl)
const socket = SocketClient()

const colorInput = document.getElementById("color")
const widthInput = document.getElementById("width")
const toolSelect  = document.getElementById("tool")
const undoBtn = document.getElementById("undo")
const redoBtn = document.getElementById("redo")
const usersDiv  = document.getElementById("users")
const status = document.getElementById("status")


// random id cuz why not
let myId = "u" + Math.floor(Math.random()*90000 + 10000)
let roomId = "default"
const remoteCursors = {}



socket.on("connect", ()=>{
    console.log("i think i'm connected lol")
    status.textContent = "Connected !!"
    socket.join(roomId , {name:myId})
})


// getting full whiteboard state
socket.on("state" , (s)=>{
    canvas.replayAll(s.activeOps||[])
    usersDiv.innerHTML = Object.values(s.users||{}).map(u => 
        `<span class="user-bubble" style="background:${u.color}">${u.name||u.id}</span>`
    ).join("")

    const cursors = s.cursors||{}
    for (const id in cursors) makeOrMoveCursor(id , cursors[id])
})


// update users list
socket.on("users" , (users)=>{
    usersDiv.innerHTML = Object.values(users).map(u=> 
        `<span class="user-bubble" style="background:${u.color}">${u.name||u.id}</span>`
    ).join("")
})


// drawing events
socket.on("op" , (op)=> canvas.drawRemote(op) )
socket.on("replay" , (ops)=> canvas.replayAll(ops) )


// cursor stuff
socket.on("cursor" , ({id , cursor})=> makeOrMoveCursor(id , cursor))
socket.on("cursor-remove" , (id)=> removeCursor(id))



function makeOrMoveCursor(id , cursor){

  if(!cursor) return

  let el = remoteCursors[id]

  if(!el){
      el = document.createElement("div")
      el.className = "cursor"
      el.style.position = "absolute"
      el.style.pointerEvents = "none"
      el.style.transform = "translate(-50%,-50%)"
      el.textContent = id.slice(0,4) // lol tag system

      document.body.appendChild(el)

      remoteCursors[id] = el
  }

  const r = canvasEl.getBoundingClientRect()
  el.style.left = (cursor.x + r.left) + "px"
  el.style.top  = (cursor.y + r.top) + "px"
  el.style.background = cursor.color || "#000"
}


// deleting cursor
function removeCursor(id){
    const el = remoteCursors[id]
    if(el){
        el.remove()
        delete remoteCursors[id]
    }
}




let dragging = false   // more understandable name idk


function getPos(e){
    let r = canvasEl.getBoundingClientRect()
    let x = (e.clientX ?? e.touches?.[0]?.clientX) - r.left
    let y = (e.clientY ?? e.touches?.[0]?.clientY) - r.top
    return {x,y}
}



// mouse/touch drawing events
canvasEl.addEventListener("pointerdown" , (e)=>{
    dragging = true
    canvas.startPath(getPos(e))
})

canvasEl.addEventListener("pointermove" , (e)=>{
    const pos = getPos(e)
    if(dragging) canvas.extendPath(pos)
    socket.sendCursor({x:pos.x , y:pos.y , color:colorInput.value})
})

canvasEl.addEventListener("pointerup" , ()=>{

    if(!dragging) return
    dragging = false

    const pts = canvas.endPath()

    if(!pts || pts.length < 2) return 

    const op = {
        opId: "op-" + Date.now() + "-" + Math.random().toString(36).slice(2,6),
        userId: myId,
        type: "stroke",
        payload:{
            points: pts,
            color: colorInput.value,
            width: Number(widthInput.value),
            mode: toolSelect.value
        }
    }

    socket.sendStroke(op)
})




// undo / redo (life savers)
undoBtn.addEventListener("click", ()=> socket.sendUndo() )
redoBtn.addEventListener("click", ()=> socket.sendRedo() )



setInterval(()=>{
    const r = canvasEl.getBoundingClientRect()
    socket.sendCursor({x:r.width/2 , y:r.height/2 , color:colorInput.value })
},8000)
