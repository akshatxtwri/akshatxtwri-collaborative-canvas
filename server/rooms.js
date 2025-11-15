const {DrawingState} = require("./drawing-state")


class RoomManager{

    constructor(){
        this.rm = new Map()
    }

    ensureRoom(id){
        if(!this.rm.has(id)){
            this.rm.set(id,{
                state:new DrawingState(),
                users:{},
                cursors:{}
            })
        }
    }

    addUser(r, sid, info){
        this.ensureRoom(r)
        this.rm.get(r).users[sid] = info
    }

    removeUser(r, sid){
        this.ensureRoom(r)
        delete this.rm.get(r).users[sid]
        delete this.rm.get(r).cursors[sid]
    }

    getUsers(r){
        this.ensureRoom(r)
        return this.rm.get(r).users
    }

    pushOp(r, op){
        this.ensureRoom(r)
        this.rm.get(r).state.pushOp(op)
    }

    getActiveOps(r){
        this.ensureRoom(r)
        return this.rm.get(r).state.getActiveOps()
    }

    undo(r){
        this.ensureRoom(r)
        return this.rm.get(r).state.undo()
    }

    redo(r){
        this.ensureRoom(r)
        return this.rm.get(r).state.redo()
    }

    setCursor(r, sid, cur){
        this.ensureRoom(r)
        this.rm.get(r).cursors[sid] = cur
    }

    getCursors(r){
        this.ensureRoom(r)
        return this.rm.get(r).cursors
    }
}


module.exports = {RoomManager}
