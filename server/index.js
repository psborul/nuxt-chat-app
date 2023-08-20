const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const { app, server } = require('./app');

const config = require('../nuxt.config.js');
const dev = process.env.NODE_ENV === 'development';
config.dev = dev;

async function start() {
  const nuxt = new Nuxt({ ...config, dev});

  const { host, port } = nuxt.options.server;

  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  app.use(nuxt.render);

  server.listen(port, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true,
    });
  });
}
start();
