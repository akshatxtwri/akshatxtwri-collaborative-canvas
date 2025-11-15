# ARCHITECTURE

## Overview
Clients -> Socket.IO -> server (RoomManager + DrawingState) -> broadcast to clients

## Data flow
1. Client draws locally and on pointerup emits `op` with stroke payload.
2. Server appends op to room's opLog (active=true) and broadcasts `op`.
3. Clients render incoming `op` immediately (drawRemote).
4. `undo` (client -> server): server marks last active op inactive and pushes opId to undone stack, then server broadcasts `replay` with active ops.
5. `redo` (client -> server): server pops last undone opId, re-activates it, broadcasts `replay`.

## WebSocket messages
- client -> server:
  - `join` {roomId, meta}
  - `op` {opId, userId, type:'stroke', payload}
  - `undo` (no payload)
  - `redo` (no payload)
  - `cursor` {x, y, color}

- server -> clients:
  - `state` {activeOps, users, cursors}
  - `op` op
  - `replay` [activeOps]
  - `users` {socketId: {id,color,name}}
  - `cursor` {id, cursor}
  - `cursor-remove` socketId

## Undo/Redo strategy
- Simple LIFO global undo: the server keeps an ordered opLog.
- Undo: mark last active op inactive and push opId onto a redo stack.
- Redo: pop from redo stack and reactivate the op.
- This is deterministic and easy to reason about — tradeoff: undo can remove another user's op (assignment requirement).

## Conflict resolution
- Freehand strokes are additive; the server's total order determines final pixels.
- Eraser uses canvas composite 'destination-out'; replaying ops in the same order yields deterministic result.
- For heavy scale, server-side raster snapshots or CRDT/OT would be needed.

## Performance
- Bandwidth: strokes are batched on pointerup. Optionally stream mid-stroke in chunks for smoother remote drawing.
- Replay cost: for many ops, create snapshots every N ops and send snapshot + tail log to new clients.
