const fastify = require('fastify')({ logger: true });
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const view = require('@fastify/view');
const handlebars = require('handlebars');
const fastifyStatic = require('@fastify/static');

// Register point-of-view plugin with Handlebars
fastify.register(view, {
  engine: {
    handlebars: handlebars
  },
  templates: 'views',
  includeViewExtension: true
});

// Register fastify-static plugin to serve static files
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'assets'),
  prefix: '/assets/', // optional: default '/'
});

// Route for the main page
fastify.get('/', async (request, reply) => {
  try {
    // Load and parse the YAML file
    const fileContents = fs.readFileSync('./assets/stories/Aaliyah-Rain.yml', 'utf8');
    const data = yaml.load(fileContents);

    // Render the Handlebars template with the YAML data
    return reply.viewAsync('index.hbs', data);
  } catch (e) {
    fastify.log.error(e);
    reply.status(500).send('Error loading content');
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3010 });
    fastify.log.info(`Server is running at http://localhost:3010`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
