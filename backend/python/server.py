#!/usr/bin/env python

import asyncio
import websockets
import pika
import threading

async def handler(websocket, path):
    # TODO: Subscribe to an exchange thing, and send new state in callback
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbit'))
    try:
        channel = connection.channel()

        print('Starting subscription')
        subscriptionThread = threading.Thread(None, None, None, subscribe, channel)
        subscriptionThread.start()
        print('Continuing from subscription')

        alive = True
        while alive:
            # TODO: receive a JSON - what did he do
            print('Waiting for info from socket')
            name = await websocket.recv()

            # TODO: process changes, get state

            # TODO: alive = state.alive

            # TODO: Publish new state
            print('Publishing a new state')
            channel.basic_publish(exchange='bomber', routing_key='', body="new state!")
    finally:
        connection.close()

# Subscribe to the exchange thingy (callback)
def subscribe(channel):
    print('Starting subscription')
    channel.exchange_declare(exchange='bomber', exchange_type='fanout')

    result = channel.queue_declare(exclusive=True)
    queue_name = result.method.queue

    channel.queue_bind(exchange='bomber', queue=queue_name)

    channel.basic_consume(publish, queue=queue_name, no_ack=True)

    channel.start_consuming()
    print('Ended subscription')
    

# Callback for publishing exchange thing, send to socket
def publish(ch, method, properties, body):
    websocket.send("we have another state")

# main application

print('start server')
start_server = websockets.serve(handler, '0.0.0.0', 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
