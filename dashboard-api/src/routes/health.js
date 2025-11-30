// ============================================================================
// Route de santé de l'API
// ============================================================================

async function healthRoutes(fastify) {
    fastify.get('/api/health', async () => {
        return { status: 'ok', message: 'API Dashboard opérationnelle' };
    });
}

module.exports = healthRoutes;
