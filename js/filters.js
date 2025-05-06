import { renderCombinedVendasComercialChart, renderCombinedVendasCancelamentoChart, renderCombinedADMChart, fetchCombinedTopClients, fetchCombinedTopProducts, fetchCombinedCommissions } from './charts.js';

const chartInstances = {};

export function applyVendedorFilter() {
    const vendedorSelect = document.getElementById('filterVendedor');
    const vendedores = Array.from(vendedorSelect.selectedOptions).map(option => option.value);

    // Destruir todas as instâncias de gráficos existentes
    Object.keys(chartInstances).forEach(chartId => {
        if (chartInstances[chartId]) {
            chartInstances[chartId].destroy();
            delete chartInstances[chartId];
        }
    });

    // Renderizar novos gráficos com os dados combinados dos vendedores selecionados
    renderCombinedVendasComercialChart(vendedores);
    renderCombinedVendasCancelamentoChart(vendedores);
    renderCombinedADMChart(vendedores);
    fetchCombinedTopClients(vendedores);
    fetchCombinedTopProducts(vendedores);
    fetchCombinedCommissions(vendedores);

    // Atualizar o valor das metas
    updateTotalSalesTarget(vendedores);
}

async function updateTotalSalesTarget(vendedores) {
    const totalSalesTargetElement = document.getElementById('totalSalesTarget');
    let totalSalesTarget = 0;

    for (const vendedor of vendedores) {
        const userDoc = await db.collection('users').doc(vendedor).get();
        if (userDoc.exists) {
            totalSalesTarget += userDoc.data().meta || 0;
        }
    }

    totalSalesTargetElement.textContent = `R$ ${totalSalesTarget.toFixed(2).replace('.', ',')}`;
}

export async function populateVendedores() {
    const vendedorSelect = document.getElementById('filterVendedor');
    const vendedorOptionsContainer = document.getElementById('vendedorOptions');
    if (!vendedorSelect || !vendedorOptionsContainer) {
        console.error("Elementos de filtro de vendedor não encontrados no DOM.");
        return;
    }
    vendedorSelect.innerHTML = ''; // Limpa a lista de vendedores antes de preenchê-la
    vendedorOptionsContainer.innerHTML = ''; // Limpa as opções de vendedores antes de preenchê-las

    const snapshot = await db.collection('relatoriocomissao').get();
    snapshot.forEach(doc => {
        const vendedor = doc.id;
        const option = document.createElement('option');
        option.value = vendedor;
        option.textContent = vendedor;
        vendedorSelect.appendChild(option);

        const optionDiv = document.createElement('div');
        optionDiv.textContent = vendedor;
        optionDiv.addEventListener('click', () => {
            option.selected = !option.selected;
            updateVendedorSelectDisplay();
        });
        vendedorOptionsContainer.appendChild(optionDiv);
    });
}

function updateVendedorSelectDisplay() {
    const vendedorSelect = document.getElementById('filterVendedor');
    const selectedOptions = Array.from(vendedorSelect.selectedOptions).map(option => option.textContent);
    const displayText = selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Selecione os vendedores';
    document.getElementById('vendedorSelectDisplay').textContent = displayText;
}