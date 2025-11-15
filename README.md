# Collaborative Canvas — Submission

## What this is
A vanilla JS collaborative drawing canvas using Socket.IO. Multiple users can draw in real-time, see other users, and use shared undo/redo.

## How to run
1. `npm install`
2. `npm start`
3. Open `http://localhost:3000` in two browser windows to test.

## Features implemented
- Brush + eraser + color + stroke width
- Real-time sync with Socket.IO
- Cursor indicators (see other users' pointers)
- Global undo/redo (undo removes last canvas operation globally)
- Room-aware server (default room used)
- Simple op-log on server with replay

## Notes / Known limitations
- Global undo is LIFO over ops — it removes the last active operation regardless of user.
- No authentication — users are anonymous socket IDs.
- Canvas replay can get slower with many ops; snapshotting or periodic image snapshots would help.
- Cursor positions are approximate (client-side), not interpolated.
- No persistent DB storage (ops are in-memory)

## Time spent
~X hours (replace with your actual estimate)

## How to test
- Open multiple windows, draw in one — see live strokes in others.
- Click Undo in any window: last stroke disappears for everyone.
- Click Redo to restore last undone stroke.
