#!/usr/bin/env python

import asyncio
import websockets
import pika

async def handler(websocket, path):
    # TODO: Subscribe to an exchange thing, and send new state in callback
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit'))
    try:
        channel = connection.channel()

        asyncio.get_event_loop().run_until_complete(subscribe(channel))

        alive = True
        while alive:
            # TODO: receive a JSON - what did he do
            name = await websocket.recv()

            # TODO: process changes
            state = {alive: True}

            alive = state.alive

            # TODO: Publish new state
            channel.basic_publish(exchange='bomber', routing_key='', body=state)
    finally:
        connection.close()

# Subscribe to the exchange thingy asynchonously
async def subscribe(channel):
    channel.exchange_declare(exchange='bomber', exchange_type='fanout')

    result = channel.queue_declare(exclusive=True)
    queue_name = result.method.queue

    channel.queue_bind(exchange='bomber', queue=queue_name)

    channel.basic_consume(publish, queue=queue_name, no_ack=True)

    channel.start_consuming()
    

# Callback for publishing exchange thing, send to socket
def publish(ch, method, properties, body):
    websocket.send("blabla")

# main application

print('start server')
start_server = websockets.serve(handler, '0.0.0.0', 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
