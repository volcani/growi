const { EventEmitter } = require('events');
// const { createServer } = require('http');

// const express = require('express');

/**
 * the service class of SlackNotificationService
 */
class BoltRecieverService extends EventEmitter {

  init(app) {
    this.bolt = app;
  }

  // This is a very simple implementation. Look at the ExpressReceiver source for more detail
  async requestHandler(req, res) {
    let ackCalled = false;
    // Assume parseBody function exists to parse incoming requests
    const parsedReq = parseBody(req);
    const event = {
      body: parsedReq.body,
      // Receivers are responsible for handling acknowledgements
      // `ack` should be prepared to be called multiple times and
      // possibly with `response` as an error
      ack: (response) => {
        if (ackCalled) {
          return;
        }

        if (response instanceof Error) {
          res.status(500).send();
        }
        else if (!response) {
          res.send('');
        }
        else {
          res.send(response);
        }

        ackCalled = true;
      },
    };
    await this.bolt.processEvent(event);
  }

}

module.exports = BoltRecieverService;
