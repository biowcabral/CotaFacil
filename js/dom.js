import { db } from './firebaseConfig.js';

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
        optionDiv.classList.add('option-item'); // Adiciona uma classe CSS para estilização
        optionDiv.addEventListener('click', () => {
            option.selected = !option.selected;
            optionDiv.classList.toggle('selected');
            updateVendedorSelectDisplay();
        });
        vendedorOptionsContainer.appendChild(optionDiv);
    });
}

export function updateVendedorSelectDisplay() {
    const vendedorSelect = document.getElementById('filterVendedor');
    const selectedOptions = Array.from(vendedorSelect.selectedOptions).map(option => option.textContent);
    const displayText = selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Selecione os vendedores';
    document.getElementById('vendedorSelectDisplay').textContent = displayText;
}

// Adicionar evento para fechar as opções quando clicar fora
document.addEventListener('click', (event) => {
    const selectContainer = document.getElementById('vendedorFilterGroup');
    const optionsContainer = document.getElementById('vendedorOptions');
    if (selectContainer && optionsContainer && !selectContainer.contains(event.target)) {
        optionsContainer.style.display = 'none';
    }
});

// Outras funções de manipulação do DOM aqui...