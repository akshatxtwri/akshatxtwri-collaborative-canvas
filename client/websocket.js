export default function SocketClient() {

    const socket = io("https://akshatxtwri-collaborative-canvas-backend.onrender.com", {
        transports: ["websocket"]
    });

    function on(event, fn) {
        socket.on(event, fn);
    }

    function join(room, meta) {
        socket.emit("join", { roomId: room, meta });
    }

    function sendStroke(op) {
        socket.emit("op", op);
    }

    function sendUndo(data) {
        socket.emit("undo", data);
    }

    function sendRedo(data) {
        socket.emit("redo", data);
    }

    function sendCursor(data) {
        socket.emit("cursor", data);
    }

    return {
        on,
        join,
        sendStroke,
        sendUndo,
        sendRedo,
        sendCursor,
        raw: socket
    };
}
