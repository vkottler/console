#!/usr/bin/env python

"""
A sample WebSocket server script.
"""

# built-in
import asyncio
import logging
import sys
from typing import List

# third-party
from runtimepy.net.websocket.connection import WebsocketConnection
from vcorelib.asyncio import run_handle_stop


async def server_init(conn: WebsocketConnection) -> bool:
    """Initialize a new WebSocket server connection."""

    conn.send_text("Hello, world!")
    return True


async def _main(stop_sig: asyncio.Event, args: List[str]) -> int:
    """Event-loop application entry-point."""

    await WebsocketConnection.app(
        stop_sig, server_init, host=args[0], port=int(args[1])
    )
    return 0


def main(args: List[str]) -> int:
    """Application entry-point."""

    logging.basicConfig(
        level=logging.DEBUG,
        format="%(name)-36s - %(levelname)-6s - %(message)s",
    )

    stop_sig = asyncio.Event()
    return run_handle_stop(stop_sig, _main(stop_sig, args))


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
