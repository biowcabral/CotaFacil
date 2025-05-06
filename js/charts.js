import { db } from './firebaseConfig.js';

// Função para buscar comissões combinadas
export async function fetchCombinedCommissions(vendedores) {
    const commissions = {};
    for (const vendedor of vendedores) {
        const commissionData = await fetchData('relatoriocomissao', vendedor);
        if (commissionData) {
            for (const [key, value] of Object.entries(commissionData)) {
                if (!commissions[key]) {
                    commissions[key] = 0;
                }
                commissions[key] += value;
            }
        }
    }
    return commissions;
}

// Função para renderizar o gráfico de vendas comerciais combinadas
export async function renderCombinedVendasComercialChart(vendedores) {
    const data = {};
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    data[currentYear] = Array(12).fill(0);
    data[lastYear] = Array(12).fill(0);

    for (const vendedor of vendedores) {
        const vendasData = await fetchData('relatorios', vendedor);
        if (vendasData) {
            for (const [key, value] of Object.entries(vendasData)) {
                const [year, month] = key.split('-').map(Number);
                if (year === currentYear || year === lastYear) {
                    data[year][month - 1] += value;
                }
            }
        }
    }

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datasets = [
        {
            label: `${lastYear}`,
            data: data[lastYear],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        },
        {
            label: `${currentYear}`,
            data: data[currentYear],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        }
    ];

    renderChart(document.getElementById('relatorioComercialChart').getContext('2d'), 'bar', labels, datasets, {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    });
}

// Função para renderizar o gráfico de cancelamento de vendas combinadas
export async function renderCombinedVendasCancelamentoChart(vendedores) {
    const data = {};
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    data[currentYear] = Array(12).fill(0);
    data[lastYear] = Array(12).fill(0);

    for (const vendedor of vendedores) {
        const vendasData = await fetchData('relatoriocancelados', vendedor);
        if (vendasData) {
            for (const [key, value] of Object.entries(vendasData)) {
                const [year, month] = key.split('-').map(Number);
                if (year === currentYear || year === lastYear) {
                    data[year][month - 1] += value;
                }
            }
        }
    }

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datasets = [
        {
            label: `${lastYear}`,
            data: data[lastYear],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        },
        {
            label: `${currentYear}`,
            data: data[currentYear],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }
    ];

    renderChart(document.getElementById('relatorioCancelamentoChart').getContext('2d'), 'bar', labels, datasets, {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    });
}

// Função para renderizar o gráfico de ADM combinadas
export async function renderCombinedADMChart(vendedores) {
    const admData = {};

    for (const vendedor of vendedores) {
        const vendedorAdmData = await fetchADMData(vendedor);
        if (vendedorAdmData) {
            for (const [administradora, value] of Object.entries(vendedorAdmData)) {
                if (!admData[administradora]) {
                    admData[administradora] = 0;
                }
                admData[administradora] += value;
            }
        }
    }

    const labels = Object.keys(admData);
    const data = Object.values(admData);

    renderChart(document.getElementById('relatorioADMChart').getContext('2d'), 'pie', labels, [{
        data: data,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }], {
        responsive: true
    });
}

// Função para buscar dados do Firestore
async function fetchData(collection, vendedor) {
    const snapshot = await db.collection(collection).where('vendedor', '==', vendedor).get();
    const data = {};
    snapshot.forEach(doc => {
        data[doc.id] = doc.data().valor;
    });
    return data;
}

// Função para renderizar o gráfico
function renderChart(ctx, type, labels, datasets, options) {
    new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: options
    });
}

// Função para buscar dados de ADM
async function fetchADMData(vendedor) {
    const relatorioAdmRef = db.collection('relatorioadm').doc(vendedor).collection('administradoras');
    const snapshot = await relatorioAdmRef.get();

    if (snapshot.empty) {
        console.log(`Nenhum relatório encontrado para o vendedor: ${vendedor} na coleção relatorioadm`);
        return null;
    }

    const admData = {};
    snapshot.forEach(doc => {
        const data = doc.data();
        const administradora = doc.id;

        admData[administradora] = Object.values(data).reduce((acc, value) => acc + value, 0);
    });

    return admData;
}

// Função para buscar os principais clientes combinados
export async function fetchCombinedTopClients(vendedores) {
    const clientSales = {};

    for (const vendedor of vendedores) {
        const snapshot = await db.collection('relatorioclientes').doc(vendedor).collection('clientes').get();
        snapshot.forEach(doc => {
            const data = doc.data();
            const totalSales = Object.values(data).reduce((sum, value) => sum + value, 0);
            if (!clientSales[doc.id]) {
                clientSales[doc.id] = 0;
            }
            clientSales[doc.id] += totalSales;
        });
    }

    const sortedClients = Object.entries(clientSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = sortedClients.map(client => client[0]);
    const data = sortedClients.map(client => client[1]);

    renderChart(document.getElementById('relatorioClientesChart').getContext('2d'), 'pie', labels, [{
        label: '',
        data: data,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
    }], {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Top 5 Clientes por Volume de Vendas' }
        }
    });
}

// Função para buscar os principais produtos combinados
export async function fetchCombinedTopProducts(vendedores) {
    const productSales = {};

    for (const vendedor of vendedores) {
        const snapshot = await db.collection('relatorioprodutos').doc(vendedor).collection('produtos').get();
        snapshot.forEach(doc => {
            const data = doc.data();
            const totalSales = Object.values(data).reduce((sum, value) => sum + value, 0);
            if (!productSales[doc.id]) {
                productSales[doc.id] = 0;
            }
            productSales[doc.id] += totalSales;
        });
    }

    const sortedProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const labels = sortedProducts.map(product => product[0]);
    const data = sortedProducts.map(product => product[1]);

    renderChart(document.getElementById('relatorioProdutosChart').getContext('2d'), 'pie', labels, [{
        label: '',
        data: data,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
    }], {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Top 5 Produtos por Volume de Vendas' }
        }
    });
}

// Função para buscar comissões combinadas
export async function fetchCombinedCommissions(vendedores) {
    const commissionsData = {};
    const labels = new Set();

    for (const vendedor of vendedores) {
        const snapshot = await db.collection('relatoriocomissao').doc(vendedor).collection('meses').get();
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!commissionsData[doc.id]) {
                commissionsData[doc.id] = 0;
            }
            commissionsData[doc.id] += data.valorComissaoTotal;
            labels.add(doc.id);
        });
    }

    const sortedLabels = Array.from(labels).sort();
    const data = sortedLabels.map(label => commissionsData[label] || 0);

    renderComissaoChart(sortedLabels, data);
}

// Função para renderizar o gráfico de comissões
function renderComissaoChart(labels, data) {
    const ctx = document.getElementById('relatorioComissaoChart').getContext('2d');

    // Destroy the existing chart instance if it exists
    if (chartInstances['relatorioComissaoChart']) {
        chartInstances['relatorioComissaoChart'].destroy();
    }

    chartInstances['relatorioComissaoChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Comissões',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}