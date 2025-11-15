

export default function CanvasController(canvas){

  let ctx = canvas.getContext("2d")
  let isDrawing = false
  let arr = []

  function resizeCanvas(){
      const ratio = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * ratio
      canvas.height = canvas.clientHeight * ratio
      ctx.setTransform(ratio,0,0,ratio,0,0)
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  
  function drawLine(data){

    if(!data.points || data.points.length < 2) return

    ctx.lineWidth = data.width
    ctx.lineCap = "round"

    if(data.mode === "eraser"){
      ctx.globalCompositeOperation = "destination-out"
    }else{
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = data.color
    }

    ctx.beginPath()
    ctx.moveTo(data.points[0].x, data.points[0].y)

    for(let i=1;i<data.points.length;i++){
      let p = data.points[i]
      ctx.lineTo(p.x, p.y)
    }

    ctx.stroke()
  }


  return {

    startPath(point){
      isDrawing = true
      arr = [point]
    },

    extendPath(point){
      if(!isDrawing) return
      arr.push(point)
    },

    endPath(){
      let temp = [...arr]
      isDrawing = false
      arr = []
      return temp
    },

    drawRemote(data){
      if(data.type === "stroke") drawLine(data.payload)
      if(data.type === "clear") ctx.clearRect(0,0,canvas.width,canvas.height)
    },

    replayAll(all){
      ctx.clearRect(0,0,canvas.width,canvas.height)
      for(let x of all){
        if(x.type === "stroke") drawLine(x.payload)
      }
    }

  }

}
