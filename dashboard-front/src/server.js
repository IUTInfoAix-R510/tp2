// ============================================================================
// Dashboard Front - Serveur de fichiers statiques
// TP2 MongoDB - BUT3 Informatique
// ============================================================================

const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 5500;

// Servir les fichiers statiques depuis le dossier public
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/'
});

// Démarrage du serveur
const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`\n🌐 Dashboard accessible sur http://localhost:${PORT}\n`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
