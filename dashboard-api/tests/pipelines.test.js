// ============================================================================
// Tests unitaires pour les pipelines MongoDB
// TP2 - Dashboard Restaurants NYC
// ============================================================================
//
// Ces tests vérifient que vos pipelines d'agrégation retournent les bonnes
// structures de données. Lancez-les avec : npm test
//
// Les tests passent = vos pipelines sont corrects !
//
// ============================================================================

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// ============================================================================
// Configuration
// ============================================================================

let client;
let db;

before(async () => {
    if (!process.env.MONGODB_URI) {
        console.error('\n❌ MONGODB_URI non défini dans .env');
        console.error('   Créez le fichier .env avec votre URI MongoDB Atlas\n');
        process.exit(1);
    }

    try {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db('sample_restaurants');
        console.log('\n✅ Connecté à MongoDB Atlas pour les tests\n');
    } catch (error) {
        console.error('\n❌ Erreur de connexion:', error.message);
        process.exit(1);
    }
});

after(async () => {
    if (client) {
        await client.close();
        console.log('\n✅ Connexion MongoDB fermée\n');
    }
});

// ============================================================================
// Helpers pour récupérer les pipelines depuis server.js
// ============================================================================

// On importe les pipelines depuis le fichier server.js
// Pour cela, on va extraire les pipelines en les exécutant directement

/**
 * Exécute un pipeline et retourne le résultat
 */
async function executePipeline(pipeline) {
    return await db.collection('restaurants').aggregate(pipeline).toArray();
}

// ============================================================================
// TEST 1 : Pipeline Overview
// Route : GET /api/stats/overview
// ============================================================================

describe('Pipeline Overview (/api/stats/overview)', () => {

    it('doit retourner un objet avec total_restaurants et total_cuisines', async () => {
        // TODO: Copiez votre pipeline ici pour le tester
        const pipeline = [
            // Votre pipeline overview...
        ];

        // Si le pipeline est vide, on skip le test
        if (pipeline.length === 0) {
            console.log('   ⏭️  Pipeline vide - complétez le TODO dans server.js');
            return;
        }

        const result = await executePipeline(pipeline);

        assert.strictEqual(result.length, 1, 'Le pipeline doit retourner exactement 1 document');
        assert.ok(result[0].total_restaurants, 'Le résultat doit contenir total_restaurants');
        assert.ok(result[0].total_cuisines, 'Le résultat doit contenir total_cuisines');
        assert.strictEqual(typeof result[0].total_restaurants, 'number', 'total_restaurants doit être un nombre');
        assert.strictEqual(typeof result[0].total_cuisines, 'number', 'total_cuisines doit être un nombre');

        // Vérifications de cohérence
        assert.ok(result[0].total_restaurants > 20000, 'Il devrait y avoir plus de 20000 restaurants');
        assert.ok(result[0].total_cuisines > 50, 'Il devrait y avoir plus de 50 types de cuisine');

        console.log(`   ✅ total_restaurants: ${result[0].total_restaurants}`);
        console.log(`   ✅ total_cuisines: ${result[0].total_cuisines}`);
    });
});

// ============================================================================
// TEST 2 : Pipeline Par Quartier
// Route : GET /api/stats/par-quartier
// ============================================================================

describe('Pipeline Par Quartier (/api/stats/par-quartier)', () => {

    it('doit retourner les 5 quartiers de NYC avec leur nombre de restaurants', async () => {
        const pipeline = [
            // Votre pipeline par-quartier...
        ];

        if (pipeline.length === 0) {
            console.log('   ⏭️  Pipeline vide - complétez le TODO dans server.js');
            return;
        }

        const result = await executePipeline(pipeline);

        assert.strictEqual(result.length, 5, 'Il doit y avoir exactement 5 quartiers');

        const quartiers = result.map(r => r._id);
        const expectedQuartiers = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

        expectedQuartiers.forEach(q => {
            assert.ok(quartiers.includes(q), `Le quartier ${q} doit être présent`);
        });

        result.forEach(r => {
            assert.ok(r._id, 'Chaque résultat doit avoir un _id (quartier)');
            assert.ok(r.count, 'Chaque résultat doit avoir un count');
            assert.strictEqual(typeof r.count, 'number', 'count doit être un nombre');
        });

        // Vérifier le tri décroissant
        for (let i = 0; i < result.length - 1; i++) {
            assert.ok(result[i].count >= result[i + 1].count,
                'Les résultats doivent être triés par count décroissant');
        }

        console.log('   ✅ Quartiers trouvés:', quartiers.join(', '));
    });
});

// ============================================================================
// TEST 3 : Pipeline Top Cuisines
// Route : GET /api/stats/top-cuisines
// ============================================================================

describe('Pipeline Top Cuisines (/api/stats/top-cuisines)', () => {

    it('doit retourner le top 10 des cuisines', async () => {
        const pipeline = [
            // Votre pipeline top-cuisines...
        ];

        if (pipeline.length === 0) {
            console.log('   ⏭️  Pipeline vide - complétez le TODO dans server.js');
            return;
        }

        const result = await executePipeline(pipeline);

        assert.strictEqual(result.length, 10, 'Il doit y avoir exactement 10 cuisines');

        result.forEach(r => {
            assert.ok(r._id, 'Chaque résultat doit avoir un _id (cuisine)');
            assert.ok(r.count, 'Chaque résultat doit avoir un count');
            assert.strictEqual(typeof r.count, 'number', 'count doit être un nombre');
        });

        // Vérifier le tri décroissant
        for (let i = 0; i < result.length - 1; i++) {
            assert.ok(result[i].count >= result[i + 1].count,
                'Les résultats doivent être triés par count décroissant');
        }

        // American devrait être en premier
        assert.strictEqual(result[0]._id, 'American',
            'American devrait être la cuisine la plus représentée');

        console.log('   ✅ Top 3:', result.slice(0, 3).map(r => `${r._id} (${r.count})`).join(', '));
    });
});

// ============================================================================
// TEST 4 : Pipeline Distribution Grades
// Route : GET /api/stats/distribution-grades
// ============================================================================

describe('Pipeline Distribution Grades (/api/stats/distribution-grades)', () => {

    it('doit retourner la distribution des grades A, B, C, etc.', async () => {
        const pipeline = [
            // Votre pipeline distribution-grades...
        ];

        if (pipeline.length === 0) {
            console.log('   ⏭️  Pipeline vide - complétez le TODO dans server.js');
            return;
        }

        const result = await executePipeline(pipeline);

        assert.ok(result.length >= 3, 'Il doit y avoir au moins 3 grades différents (A, B, C)');

        const grades = result.map(r => r._id);
        assert.ok(grades.includes('A'), 'Le grade A doit être présent');
        assert.ok(grades.includes('B'), 'Le grade B doit être présent');
        assert.ok(grades.includes('C'), 'Le grade C doit être présent');

        result.forEach(r => {
            assert.ok(r._id !== undefined, 'Chaque résultat doit avoir un _id (grade)');
            assert.ok(r.count, 'Chaque résultat doit avoir un count');
            assert.strictEqual(typeof r.count, 'number', 'count doit être un nombre');
        });

        // Le grade A devrait être le plus fréquent
        const gradeA = result.find(r => r._id === 'A');
        const gradeC = result.find(r => r._id === 'C');
        assert.ok(gradeA.count > gradeC.count, 'Il devrait y avoir plus de A que de C');

        console.log('   ✅ Grades:', result.map(r => `${r._id}: ${r.count}`).join(', '));
    });
});

// ============================================================================
// TEST 5 : Pipeline Evolution Scores
// Route : GET /api/stats/evolution-scores
// ============================================================================

describe('Pipeline Evolution Scores (/api/stats/evolution-scores)', () => {

    it('doit retourner le score moyen par année', async () => {
        const pipeline = [
            // Votre pipeline evolution-scores...
        ];

        if (pipeline.length === 0) {
            console.log('   ⏭️  Pipeline vide - complétez le TODO dans server.js');
            return;
        }

        const result = await executePipeline(pipeline);

        assert.ok(result.length >= 3, 'Il doit y avoir au moins 3 années');

        result.forEach(r => {
            assert.ok(r._id, 'Chaque résultat doit avoir un _id (année)');
            assert.ok(r.avg_score !== undefined, 'Chaque résultat doit avoir un avg_score');
            assert.strictEqual(typeof r._id, 'number', '_id (année) doit être un nombre');
            assert.strictEqual(typeof r.avg_score, 'number', 'avg_score doit être un nombre');
            assert.ok(r._id >= 2010 && r._id <= 2020, 'Les années doivent être entre 2010 et 2020');
            assert.ok(r.avg_score >= 0 && r.avg_score <= 50, 'Le score moyen doit être entre 0 et 50');
        });

        // Vérifier le tri par année
        for (let i = 0; i < result.length - 1; i++) {
            assert.ok(result[i]._id <= result[i + 1]._id,
                'Les résultats doivent être triés par année croissante');
        }

        console.log('   ✅ Evolution:', result.map(r => `${r._id}: ${r.avg_score.toFixed(1)}`).join(', '));
    });
});

// ============================================================================
// TEST BONUS : Pipeline Dashboard ($facet)
// Route : GET /api/stats/dashboard
// ============================================================================

describe('Pipeline Dashboard - BONUS (/api/stats/dashboard)', () => {

    it('doit retourner toutes les métriques en un seul appel avec $facet', async () => {
        const pipeline = [
            // Votre pipeline $facet...
        ];

        if (pipeline.length === 0) {
            console.log('   ⏭️  Pipeline vide - complétez le TODO bonus dans server.js');
            return;
        }

        const result = await executePipeline(pipeline);

        assert.strictEqual(result.length, 1, '$facet doit retourner exactement 1 document');

        const data = result[0];

        // Vérifier la présence de toutes les facettes
        assert.ok(data.overview, 'Le résultat doit contenir overview');
        assert.ok(data.par_quartier, 'Le résultat doit contenir par_quartier');
        assert.ok(data.top_cuisines, 'Le résultat doit contenir top_cuisines');
        assert.ok(data.distribution_grades, 'Le résultat doit contenir distribution_grades');
        assert.ok(data.evolution_scores, 'Le résultat doit contenir evolution_scores');

        // Vérifier que chaque facette contient des données
        assert.ok(Array.isArray(data.overview), 'overview doit être un tableau');
        assert.ok(Array.isArray(data.par_quartier), 'par_quartier doit être un tableau');
        assert.ok(data.par_quartier.length === 5, 'par_quartier doit contenir 5 quartiers');

        console.log('   ✅ Toutes les facettes sont présentes et correctes');
    });
});

// ============================================================================
// TESTS DE VALIDATION RAPIDE (exécutés sur la vraie base)
// Ces tests vérifient directement les routes de l'API
// ============================================================================

describe('Validation des données MongoDB', () => {

    it('la collection restaurants existe et contient des données', async () => {
        const count = await db.collection('restaurants').countDocuments();
        assert.ok(count > 20000, `La collection devrait contenir plus de 20000 documents (trouvé: ${count})`);
        console.log(`   ✅ Collection restaurants: ${count} documents`);
    });

    it('les documents ont la structure attendue', async () => {
        const doc = await db.collection('restaurants').findOne();

        assert.ok(doc.name, 'Le document doit avoir un champ name');
        assert.ok(doc.borough, 'Le document doit avoir un champ borough');
        assert.ok(doc.cuisine, 'Le document doit avoir un champ cuisine');
        assert.ok(doc.grades, 'Le document doit avoir un champ grades');
        assert.ok(Array.isArray(doc.grades), 'grades doit être un tableau');

        if (doc.grades.length > 0) {
            assert.ok(doc.grades[0].grade, 'Chaque grade doit avoir un champ grade');
            assert.ok(doc.grades[0].score !== undefined, 'Chaque grade doit avoir un champ score');
            assert.ok(doc.grades[0].date, 'Chaque grade doit avoir un champ date');
        }

        console.log(`   ✅ Structure validée pour: ${doc.name}`);
    });
});
