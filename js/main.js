import { initializeAuth } from './auth.js';
import { renderCombinedVendasComercialChart } from './charts.js';
import { populateVendedores, updateVendedorSelectDisplay } from './dom.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
});