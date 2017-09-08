#!/usr/bin/env python

import asyncio
import websockets
import pika

async def hello(websocket, path):
    # TODO: Subscribe to an exchange thing

    # TODO: while alive?
        # TODO: receive a JSON - what did he do
        name = await websocket.recv()

        # TODO: send message to a queue with "what did he do"
        print("< {}".format(name))

        greeting = "Hello {}!".format(name)
        await websocket.send(greeting)
        print("> {}".format(greeting))

    # TODO: Unsubscribe?


print('start server')
start_server = websockets.serve(hello, '0.0.0.0', 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
