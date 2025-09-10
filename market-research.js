// Market Research - Versão Corrigida e Funcional

// Configurações globais
const MARKET_RESEARCH_CONFIG = {
    maxSearchLength: 100,
    minSearchLength: 3,
    searchTimeout: 30000,
    cacheTimeout: 24 * 60 * 60 * 1000,
};

// Estado global da pesquisa
let currentSearchState = {
    isSearching: false,
    currentQuery: '',
    lastResults: null,
    searchHistory: []
};

// Função principal para inicializar a pesquisa de mercado
function initMarketResearch() {
    console.log('Inicializando sistema de pesquisa de mercado...');
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        setupMarketResearchEventListeners();
        loadSearchHistory();
        console.log('Sistema de pesquisa de mercado inicializado com sucesso');
    }, 100);
}

// Configurar event listeners
function setupMarketResearchEventListeners() {
    const searchButton = document.getElementById('marketSearchButton');
    const searchInput = document.getElementById('marketSearchInput');
    
    if (searchButton) {
        // Remover listeners existentes
        searchButton.replaceWith(searchButton.cloneNode(true));
        const newButton = document.getElementById('marketSearchButton');
        
        newButton.addEventListener('click', handleMarketSearch);
        console.log('Event listener adicionado ao botão de pesquisa');
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleMarketSearch();
            }
        });
    }
}

// Função para lidar com a pesquisa de mercado
function handleMarketSearch() {
    const searchInput = document.getElementById('marketSearchInput');
    if (!searchInput) {
        console.error('Campo de pesquisa não encontrado');
        return;
    }
    
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Por favor, digite um termo para pesquisar');
        return;
    }
    
    if (query.length < MARKET_RESEARCH_CONFIG.minSearchLength) {
        alert(`O termo deve ter pelo menos ${MARKET_RESEARCH_CONFIG.minSearchLength} caracteres`);
        return;
    }
    
    console.log('Iniciando pesquisa para:', query);
    
    // Simular dados de pesquisa
    const mockData = {
        success: true,
        data: {
            product_name: query,
            category: 'Moda e Beleza',
            demand_index: Math.floor(Math.random() * 100) + 1,
            price_analysis: {
                average_price: 147.35,
                min_price: 89.90,
                max_price: 299.99,
                suggested_price: 125.50
            },
            trend_data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                values: [45, 52, 48, 61, 55, 67]
            },
            region_data: {
                'São Paulo': 35,
                'Rio de Janeiro': 22,
                'Minas Gerais': 15,
                'Paraná': 12,
                'Outros': 16
            },
            demographics: {
                age_groups: ['18-25', '26-35', '36-45', '46+'],
                percentages: [25, 40, 25, 10]
            },
            competition: [
                { name: 'Produto A', price: 120.00, rating: 4.5 },
                { name: 'Produto B', price: 135.00, rating: 4.2 },
                { name: 'Produto C', price: 98.50, rating: 4.0 }
            ]
        }
    };
    
    // Exibir resultados
    showMarketResearchResults(mockData);
    
    // Adicionar ao histórico
    addToSearchHistory(query);
}

// Função para exibir os resultados da pesquisa
function showMarketResearchResults(response) {
    console.log('Exibindo resultados da pesquisa:', response);
    
    if (!response.success) {
        showSearchError('Erro ao realizar a pesquisa. Tente novamente.');
        return;
    }
    
    // Criar ou encontrar container de resultados
    let resultsContainer = document.getElementById('marketResearchResults');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'marketResearchResults';
        resultsContainer.className = 'market-research-results';
        
        // Inserir após o formulário de pesquisa
        const searchForm = document.querySelector('.market-research-form');
        if (searchForm) {
            searchForm.parentNode.insertBefore(resultsContainer, searchForm.nextSibling);
        } else {
            // Fallback: inserir no final do conteúdo
            const content = document.getElementById('content');
            if (content) {
                content.appendChild(resultsContainer);
            }
        }
    }
    
    // Gerar HTML dos resultados
    resultsContainer.innerHTML = generateResultsHTML(response.data);
    
    // Aplicar estilos
    resultsContainer.style.display = 'block';
    resultsContainer.style.visibility = 'visible';
    resultsContainer.style.opacity = '1';
    
    // Rolar para os resultados
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    console.log('Resultados exibidos com sucesso');
}

// Gerar HTML dos resultados
function generateResultsHTML(data) {
    return `
        <div class="results-header">
            <h2>📊 Análise de Mercado - ${data.product_name}</h2>
            <div class="product-info">
                <span class="category">Categoria: ${data.category}</span>
                <span class="demand">Índice de Demanda: ${data.demand_index}</span>
            </div>
        </div>
        
        <div class="results-grid">
            <div class="result-card trend-card">
                <h3>📈 Tendência de Busca</h3>
                <div class="chart-container">
                    <canvas id="trendChart" width="300" height="200"></canvas>
                </div>
                <p class="chart-description">Interesse ao longo do tempo</p>
            </div>
            
            <div class="result-card region-card">
                <h3>🗺️ Regiões</h3>
                <div class="region-list">
                    ${Object.entries(data.region_data).map(([region, percentage]) => `
                        <div class="region-item">
                            <span class="region-name">${region}</span>
                            <div class="region-bar">
                                <div class="region-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span class="region-percentage">${percentage}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="result-card demographics-card">
                <h3>👥 Demografia & Mercado</h3>
                <div class="demographics-chart">
                    ${data.demographics.age_groups.map((group, index) => `
                        <div class="demo-item">
                            <span class="demo-label">${group}</span>
                            <div class="demo-bar">
                                <div class="demo-fill" style="width: ${data.demographics.percentages[index] * 2}%"></div>
                            </div>
                            <span class="demo-percentage">${data.demographics.percentages[index]}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="result-card competition-card">
                <h3>🏆 Concorrência</h3>
                <div class="competition-list">
                    ${data.competition.map(product => `
                        <div class="competition-item">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                            <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="result-card price-card">
                <h3>💰 Preço Sugerido</h3>
                <div class="price-display">
                    <div class="suggested-price">R$ ${data.price_analysis.suggested_price.toFixed(2)}</div>
                    <div class="price-range">
                        <span>Faixa: R$ ${data.price_analysis.min_price.toFixed(2)} - R$ ${data.price_analysis.max_price.toFixed(2)}</span>
                    </div>
                    <div class="margin-info">
                        <span>Margem sugerida: 30%</span>
                    </div>
                </div>
            </div>
            
            <div class="result-card insights-card">
                <h3>💡 Insights e Recomendações</h3>
                <div class="insights-list">
                    <div class="insight-item">
                        <span class="insight-icon">📊</span>
                        <span class="insight-text">Demanda crescente nos últimos 3 meses</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-icon">🎯</span>
                        <span class="insight-text">Público-alvo principal: 26-35 anos</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-icon">💡</span>
                        <span class="insight-text">Oportunidade de diferenciação no preço</span>
                    </div>
                    <div class="insight-item">
                        <span class="insight-icon">📈</span>
                        <span class="insight-text">Sazonalidade favorável detectada</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="results-actions">
            <button class="btn-export" onclick="exportResults()">
                <i class="fas fa-download"></i> Exportar Relatório
            </button>
            <button class="btn-new-search" onclick="clearResults()">
                <i class="fas fa-search"></i> Nova Pesquisa
            </button>
        </div>
    `;
}

// Função para mostrar erro de pesquisa
function showSearchError(message) {
    alert(`Erro: ${message}`);
}

// Funções de histórico
function loadSearchHistory() {
    try {
        const history = localStorage.getItem('market_research_history');
        if (history) {
            currentSearchState.searchHistory = JSON.parse(history);
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        currentSearchState.searchHistory = [];
    }
}

function addToSearchHistory(query) {
    try {
        currentSearchState.searchHistory = currentSearchState.searchHistory.filter(item => item.query !== query);
        currentSearchState.searchHistory.unshift({
            query: query,
            timestamp: Date.now()
        });
        currentSearchState.searchHistory = currentSearchState.searchHistory.slice(0, 10);
        localStorage.setItem('market_research_history', JSON.stringify(currentSearchState.searchHistory));
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}

// Função para exportar resultados
function exportResults() {
    alert('Funcionalidade de exportação em desenvolvimento');
}

// Função para limpar resultados
function clearResults() {
    const resultsContainer = document.getElementById('marketResearchResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    
    const searchInput = document.getElementById('marketSearchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
}

// Exportar funções globais
window.initMarketResearch = initMarketResearch;
window.handleMarketSearch = handleMarketSearch;
window.showMarketResearchResults = showMarketResearchResults;
window.exportResults = exportResults;
window.clearResults = clearResults;

console.log('Market Research module loaded successfully');


