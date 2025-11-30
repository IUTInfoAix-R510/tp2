// ============================================================================
// Configuration de la connexion MongoDB
// ============================================================================

const { MongoClient } = require('mongodb');

let db;

async function connectDB(logger) {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const dbName = process.env.MONGODB_DATABASE || 'sample_restaurants';
        db = client.db(dbName);
        if (logger) {
            logger.info('Connecté à MongoDB Atlas');
        }
        return db;
    } catch (error) {
        if (logger) {
            logger.error('Erreur de connexion MongoDB:', error.message);
        }
        process.exit(1);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
