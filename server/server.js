const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const {RoomManager} = require("./rooms")


const app = express()
const server = http.createServer(app)

const io = new Server(server,{cors:{origin:"*"}})

app.use(express.static("client"))

const rooms = new RoomManager()


io.on("connection",(sock)=>{
    console.log("socket connected", sock.id)

    let r = null


    sock.on("join",({roomId,meta})=>{
        r = roomId || "default"
        sock.join(r)

        rooms.ensureRoom(r)
        rooms.addUser(r, sock.id,{
            id:sock.id,
            color:randCol(),
            name:meta?.name || sock.id
        })

        sock.emit("state",{
            activeOps:rooms.getActiveOps(r),
            users:rooms.getUsers(r),
            cursors:rooms.getCursors(r)
        })

        io.to(r).emit("users",rooms.getUsers(r))
    })


    sock.on("op",(op)=>{
        rooms.pushOp(r,op)
        io.to(r).emit("op",op)
    })

    sock.on("undo",()=>{
        rooms.undo(r)
        io.to(r).emit("replay",rooms.getActiveOps(r))
    })

    sock.on("redo",()=>{
        rooms.redo(r)
        io.to(r).emit("replay",rooms.getActiveOps(r))
    })


    sock.on("cursor",(c)=>{
        rooms.setCursor(r,sock.id,c)
        sock.to(r).emit("cursor",{id:sock.id,cursor:c})
    })


    sock.on("disconnect",()=>{
        if(r){
            rooms.removeUser(r,sock.id)
            io.to(r).emit("users",rooms.getUsers(r))
            io.to(r).emit("cursor-remove",sock.id)
        }
    })

})



function randCol(){
    return "#"+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,"0")
}


const PORT = process.env.PORT || 3000

server.listen(PORT,()=>console.log("listening",PORT))
