// ============================================================================
// Dashboard API - TP2 MongoDB
// Point d'entrée de l'application
// ============================================================================

const Fastify = require('fastify');
const cors = require('@fastify/cors');
require('dotenv').config();

const { connectDB } = require('./config/database');
const healthRoutes = require('./routes/health');
const statsRoutes = require('./routes/stats');

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 3000;

// Plugins
fastify.register(cors, { origin: true });

// Routes
fastify.register(healthRoutes);
fastify.register(statsRoutes);

// Démarrage du serveur
const start = async () => {
    try {
        await connectDB(fastify.log);
        await fastify.listen({ port: PORT, host: '0.0.0.0' });

        console.log(`\n API démarrée sur http://localhost:${PORT}`);
        console.log(` Dashboard: http://localhost:${PORT}/api/stats/dashboard`);
        console.log('\nRoutes disponibles:');
        console.log('  GET /api/health');
        console.log('  GET /api/stats/overview');
        console.log('  GET /api/stats/par-quartier');
        console.log('  GET /api/stats/top-cuisines');
        console.log('  GET /api/stats/distribution-grades');
        console.log('  GET /api/stats/evolution-scores');
        console.log('  GET /api/stats/dashboard (bonus)\n');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
