// ============================================================================
// Tests d'intégration pour l'API Dashboard
// TP2 - Dashboard Restaurants NYC
// ============================================================================
//
// Ces tests appellent directement les routes de votre API et vérifient
// que les réponses sont correctes.
//
// IMPORTANT : L'API doit être démarrée avant de lancer ces tests !
//             npm start (dans un autre terminal)
//             puis : npm run test:api
//
// ============================================================================

const { describe, it, before } = require('node:test');
const assert = require('node:assert');

// ============================================================================
// Configuration
// ============================================================================

const API_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Helper pour appeler l'API
 */
async function fetchAPI(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// ============================================================================
// Tests de connexion
// ============================================================================

describe('API - Connexion', () => {

    it('GET /api/health - doit répondre avec status ok', async () => {
        const data = await fetchAPI('/api/health');
        assert.strictEqual(data.status, 'ok', 'Le status doit être "ok"');
        console.log('   ✅ API opérationnelle');
    });
});

// ============================================================================
// Tests des routes (vérifient la structure, pas les valeurs exactes)
// ============================================================================

describe('API - Route /api/stats/overview', () => {

    it('doit retourner total_restaurants et total_cuisines', async () => {
        const data = await fetchAPI('/api/stats/overview');

        // Si c'est encore TODO
        if (data.total_restaurants === 'TODO') {
            console.log('   ⏭️  Route non implémentée (TODO)');
            return;
        }

        assert.ok('total_restaurants' in data, 'Doit contenir total_restaurants');
        assert.ok('total_cuisines' in data, 'Doit contenir total_cuisines');
        assert.strictEqual(typeof data.total_restaurants, 'number');
        assert.strictEqual(typeof data.total_cuisines, 'number');
        assert.ok(data.total_restaurants > 20000, 'Doit avoir > 20000 restaurants');
        assert.ok(data.total_cuisines > 50, 'Doit avoir > 50 cuisines');

        console.log(`   ✅ ${data.total_restaurants} restaurants, ${data.total_cuisines} cuisines`);
    });
});

describe('API - Route /api/stats/par-quartier', () => {

    it('doit retourner un tableau avec les 5 quartiers de NYC', async () => {
        const data = await fetchAPI('/api/stats/par-quartier');

        assert.ok(Array.isArray(data), 'Doit retourner un tableau');

        // Si c'est encore TODO
        if (data[0]?.count === 'TODO') {
            console.log('   ⏭️  Route non implémentée (TODO)');
            return;
        }

        assert.strictEqual(data.length, 5, 'Doit avoir 5 quartiers');

        const quartiers = data.map(d => d._id);
        ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].forEach(q => {
            assert.ok(quartiers.includes(q), `${q} doit être présent`);
        });

        // Vérifier le tri
        for (let i = 0; i < data.length - 1; i++) {
            assert.ok(data[i].count >= data[i + 1].count, 'Doit être trié décroissant');
        }

        console.log(`   ✅ Top: ${data[0]._id} (${data[0].count})`);
    });
});

describe('API - Route /api/stats/top-cuisines', () => {

    it('doit retourner le top 10 des cuisines', async () => {
        const data = await fetchAPI('/api/stats/top-cuisines');

        assert.ok(Array.isArray(data), 'Doit retourner un tableau');

        if (data[0]?.count === 'TODO') {
            console.log('   ⏭️  Route non implémentée (TODO)');
            return;
        }

        assert.strictEqual(data.length, 10, 'Doit avoir 10 cuisines');
        assert.strictEqual(data[0]._id, 'American', 'American doit être #1');

        // Vérifier le tri
        for (let i = 0; i < data.length - 1; i++) {
            assert.ok(data[i].count >= data[i + 1].count, 'Doit être trié décroissant');
        }

        console.log(`   ✅ Top 3: ${data.slice(0, 3).map(d => d._id).join(', ')}`);
    });
});

describe('API - Route /api/stats/distribution-grades', () => {

    it('doit retourner la distribution des grades', async () => {
        const data = await fetchAPI('/api/stats/distribution-grades');

        assert.ok(Array.isArray(data), 'Doit retourner un tableau');

        if (data[0]?.count === 'TODO') {
            console.log('   ⏭️  Route non implémentée (TODO)');
            return;
        }

        const grades = data.map(d => d._id);
        assert.ok(grades.includes('A'), 'Grade A doit être présent');
        assert.ok(grades.includes('B'), 'Grade B doit être présent');
        assert.ok(grades.includes('C'), 'Grade C doit être présent');

        const gradeA = data.find(d => d._id === 'A');
        assert.ok(gradeA.count > 50000, 'Grade A doit avoir > 50000 occurrences');

        console.log(`   ✅ Grades: ${data.map(d => `${d._id}:${d.count}`).join(', ')}`);
    });
});

describe('API - Route /api/stats/evolution-scores', () => {

    it('doit retourner l\'évolution des scores par année', async () => {
        const data = await fetchAPI('/api/stats/evolution-scores');

        assert.ok(Array.isArray(data), 'Doit retourner un tableau');

        if (data[0]?.avg_score === 'TODO') {
            console.log('   ⏭️  Route non implémentée (TODO)');
            return;
        }

        assert.ok(data.length >= 3, 'Doit avoir au moins 3 années');

        data.forEach(d => {
            assert.ok(d._id >= 2010 && d._id <= 2020, 'Année doit être entre 2010-2020');
            assert.ok(d.avg_score >= 0 && d.avg_score <= 30, 'Score moyen doit être raisonnable');
        });

        // Vérifier le tri
        for (let i = 0; i < data.length - 1; i++) {
            assert.ok(data[i]._id <= data[i + 1]._id, 'Doit être trié par année croissante');
        }

        console.log(`   ✅ ${data.length} années, scores de ${data[0].avg_score.toFixed(1)} à ${data[data.length - 1].avg_score.toFixed(1)}`);
    });
});

describe('API - Route BONUS /api/stats/dashboard', () => {

    it('doit retourner toutes les métriques avec $facet', async () => {
        const data = await fetchAPI('/api/stats/dashboard');

        if (data._info?.includes('non implémenté')) {
            console.log('   ⏭️  Route bonus non implémentée');
            return;
        }

        assert.ok(data.overview, 'Doit contenir overview');
        assert.ok(data.par_quartier, 'Doit contenir par_quartier');
        assert.ok(data.top_cuisines, 'Doit contenir top_cuisines');
        assert.ok(data.distribution_grades, 'Doit contenir distribution_grades');
        assert.ok(data.evolution_scores, 'Doit contenir evolution_scores');

        console.log('   ✅ Toutes les facettes présentes');
    });
});

// ============================================================================
// Résumé
// ============================================================================

describe('Résumé', () => {
    it('affiche le résumé des tests', async () => {
        console.log('\n📊 Pour voir vos résultats en action, ouvrez dashboard-front/index.html\n');
    });
});
