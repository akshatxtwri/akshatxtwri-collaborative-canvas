class DrawingState{

  constructor(){
      this.ops = []
      this.undone = []
  }

  pushOp(op){
      op._ts = Date.now()
      op.active = true
      this.ops.push(op)
      this.undone = []
  }

  getActiveOps(){
      return this.ops.filter(o=>o.active)
  }

  undo(){
      for(let i=this.ops.length-1;i>=0;i--){
          let o = this.ops[i]
          if(o.active){
              o.active = false
              this.undone.push(o.opId)
              break
          }
      }
      return this.getActiveOps()
  }

  redo(){
      let id = this.undone.pop()
      if(!id) return this.getActiveOps()

      for(let o of this.ops){
          if(o.opId===id){
              o.active = true
              break
          }
      }
      return this.getActiveOps()
  }

}


module.exports = {DrawingState}
