import { auth, db } from './firebaseConfig.js';
import { populateVendedores } from './dom.js';
import { renderCombinedVendasComercialChart, renderCombinedVendasCancelamentoChart, renderCombinedADMChart, fetchCombinedTopClients, fetchCombinedTopProducts, fetchCombinedCommissions } from './charts.js';

export function initializeAuth() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            db.collection('users').doc(user.email).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('userName').textContent = userData.name;
                    document.getElementById('salesTarget').textContent = `R$ ${userData.meta}`;

                    const currentTheme = userData.theme || 'clean';
                    document.body.classList.toggle('dark-mode', currentTheme === 'dark');

                    if (userData.role === 'admin') {
                        const vendedorFilterGroup = document.getElementById('vendedorFilterGroup');
                        if (vendedorFilterGroup) {
                            vendedorFilterGroup.style.display = 'block';
                            populateVendedores();
                        } else {
                            console.error("Elemento 'vendedorFilterGroup' não encontrado no DOM.");
                        }
                    }

                    renderCombinedVendasComercialChart([userData.name]);
                    renderCombinedVendasCancelamentoChart([userData.name]);
                    renderCombinedADMChart([userData.name]);
                    fetchCombinedTopClients([userData.name]);
                    fetchCombinedTopProducts([userData.name]);
                    fetchCombinedCommissions([userData.name]);

                    const currentWeek = new Date().toISOString().slice(0, 10);
                    const currentWeekFormatted = `${currentWeek.substring(0, 4)}-W${String(Math.ceil((new Date(currentWeek).getDate() + 6) / 7)).padStart(2, '0')}`;
                    document.getElementById('semana').value = currentWeekFormatted;
                    carregarTarefasSemana(currentWeekFormatted);
                } else {
                    console.log("Nenhum dado encontrado!");
                }
            }).catch((error) => console.log("Erro ao obter documento:", error));
        } else {
            console.log("Usuário não autenticado!");
        }
    });
}