const http = require('http');
const StringDecoder = require('string_decoder').StringDecoder;

class Subscriber {
  constructor(port) {
    this.port = port;
  }

  run() {
    const server = http.createServer((req, res) => {
      const method = req.method.toUpperCase();
      const decoder = new StringDecoder('utf-8');
      let buffer = '';

      req.on('data', data => (buffer += decoder.write(data)));
      req.on('end', () => {
        buffer += decoder.end();
        const payload = JSON.parse(buffer);

        switch (method) {
          case 'POST':
            console.log(`[${this.port}] Received message:`, payload);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(buffer);
          default:
            res.end('Send a POST request to this API');
        }
      });
    });

    server.listen(this.port, () => console.log(`Server started on port ${this.port}`));
  }
}

const ports = [3001, 3002, 3003, 3004];

ports.forEach(port => {
  const subscriber = new Subscriber(port);
  subscriber.run();
});
