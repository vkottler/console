#!/usr/bin/env python

"""
A sample WebSocket server script.
"""

# built-in
import asyncio
import sys
from typing import List, cast

# third-party
from runtimepy.net.websocket.connection import (
    WebsocketConnection,
    server_handler,
)
from vcorelib.asyncio import run_handle_interrupt
import websockets


async def server_init(conn: WebsocketConnection) -> bool:
    """Initialize a new WebSocket server connection."""

    conn.send_text("Hello, world!")
    return True


async def _main(args: List[str]) -> int:
    """Event-loop application entry-point."""

    async with websockets.server.serve(
        server_handler(server_init), host=args[0], port=int(args[1])
    ) as server:
        for sock in server.sockets:
            host = sock.getsockname()
            print(f"Serving on: '{host[0]}:{host[1]}'.")

        await asyncio.Future()

    return 0


def main(args: List[str]) -> int:
    """Application entry-point."""

    eloop = asyncio.new_event_loop()
    asyncio.set_event_loop(eloop)
    return cast(int, run_handle_interrupt(_main(args), eloop))


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
