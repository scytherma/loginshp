// market-research.js - Sistema de Pesquisa de Mercado

// Configurações globais
const MARKET_RESEARCH_CONFIG = {
    maxSearchLength: 100,
    minSearchLength: 3,
    searchTimeout: 30000, // 30 segundos
    cacheTimeout: 24 * 60 * 60 * 1000, // 24 horas
};

// Estado global da pesquisa
let currentSearchState = {
    isSearching: false,
    currentQuery: '',
    lastResults: null,
    searchHistory: []
};

// Função para inicializar a pesquisa de mercado
function initMarketResearch() {
    console.log('Inicializando sistema de pesquisa de mercado...');
    
    // Verificar se os elementos existem
    const searchInput = document.getElementById('marketSearchInput');
    const searchButton = document.getElementById('marketSearchButton');
    
    if (!searchInput || !searchButton) {
        console.error('Elementos de pesquisa não encontrados');
        return;
    }

    // Event listeners
    setupMarketResearchEventListeners();
    
    // Carregar histórico de pesquisas
    loadSearchHistory();
    
    // Verificar controle de acesso
    checkMarketResearchAccess();
    
    console.log('Sistema de pesquisa de mercado inicializado com sucesso');
}

// Configurar event listeners
function setupMarketResearchEventListeners() {
    const searchInput = document.getElementById('marketSearchInput');
    const searchButton = document.getElementById('marketSearchButton');
    
    // Event listener para o botão de pesquisa
    searchButton.addEventListener('click', handleMarketSearch);
    
    // Event listener para Enter no campo de pesquisa
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleMarketSearch();
        }
    });
    
    // Event listener para validação em tempo real
    searchInput.addEventListener('input', validateSearchInput);
    
    // Event listener para limpar pesquisa
    const clearButton = document.getElementById('clearSearchButton');
    if (clearButton) {
        clearButton.addEventListener('click', clearSearch);
    }
}

// Validar entrada de pesquisa
function validateSearchInput() {
    const searchInput = document.getElementById('marketSearchInput');
    const searchButton = document.getElementById('marketSearchButton');
    const query = searchInput.value.trim();
    
    // Validar comprimento
    if (query.length < MARKET_RESEARCH_CONFIG.minSearchLength) {
        searchButton.disabled = true;
        searchInput.classList.add('invalid');
        showInputError('Digite pelo menos 3 caracteres');
        return false;
    }
    
    if (query.length > MARKET_RESEARCH_CONFIG.maxSearchLength) {
        searchButton.disabled = true;
        searchInput.classList.add('invalid');
        showInputError('Máximo de 100 caracteres');
        return false;
    }
    
    // Validar caracteres especiais
    const invalidChars = /[<>{}[\]\\]/;
    if (invalidChars.test(query)) {
        searchButton.disabled = true;
        searchInput.classList.add('invalid');
        showInputError('Caracteres especiais não permitidos');
        return false;
    }
    
    // Input válido
    searchButton.disabled = false;
    searchInput.classList.remove('invalid');
    hideInputError();
    return true;
}

// Mostrar erro de input
function showInputError(message) {
    let errorElement = document.getElementById('searchInputError');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'searchInputError';
        errorElement.className = 'search-input-error';
        const searchContainer = document.querySelector('.market-search-container');
        searchContainer.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Esconder erro de input
function hideInputError() {
    const errorElement = document.getElementById('searchInputError');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Verificar acesso à pesquisa de mercado
function checkMarketResearchAccess() {
    // Verificar se usuário tem assinatura ativa
    if (typeof userSubscriptionStatus !== 'undefined' && 
        userSubscriptionStatus.status !== 'active') {
        
        // Usuário sem assinatura - mostrar preview limitado
        showAccessLimitedMessage();
        return false;
    }
    
    return true;
}

// Mostrar mensagem de acesso limitado
function showAccessLimitedMessage() {
    const searchButton = document.getElementById('marketSearchButton');
    const searchInput = document.getElementById('marketSearchInput');
    
    if (searchButton) {
        searchButton.textContent = 'Upgrade para Pesquisar';
        searchButton.onclick = () => showUpgradeModal('Pesquisa de Mercado');
    }
    
    if (searchInput) {
        searchInput.placeholder = 'Upgrade para usar a pesquisa de mercado...';
        searchInput.disabled = true;
    }
}

// Manipular pesquisa de mercado
async function handleMarketSearch() {
    console.log('Iniciando pesquisa de mercado...');
    
    // Verificar se já está pesquisando
    if (currentSearchState.isSearching) {
        console.log('Pesquisa já em andamento');
        return;
    }
    
    // Verificar acesso
    if (!checkMarketResearchAccess()) {
        console.log('Acesso negado à pesquisa de mercado');
        return;
    }
    
    // Validar input
    if (!validateSearchInput()) {
        console.log('Input inválido');
        return;
    }
    
    const searchInput = document.getElementById('marketSearchInput');
    const query = searchInput.value.trim();
    
    // Verificar cache
    const cachedResult = getCachedResult(query);
    if (cachedResult) {
        console.log('Resultado encontrado no cache');
        showMarketResearchResults(cachedResult);
        return;
    }
    
    try {
        // Iniciar estado de loading
        setSearchLoadingState(true);
        currentSearchState.isSearching = true;
        currentSearchState.currentQuery = query;
        
        // Fazer a pesquisa
        const results = await performMarketResearch(query);
        
        // Salvar no cache
        setCachedResult(query, results);
        
        // Salvar no histórico
        addToSearchHistory(query);
        
        // Mostrar resultados
        showMarketResearchResults(results);
        
    } catch (error) {
        console.error('Erro na pesquisa de mercado:', error);
        showSearchError(error.message);
    } finally {
        // Finalizar estado de loading
        setSearchLoadingState(false);
        currentSearchState.isSearching = false;
    }
}

// Definir estado de loading
function setSearchLoadingState(isLoading) {
    const searchButton = document.getElementById('marketSearchButton');
    const searchInput = document.getElementById('marketSearchInput');
    const loadingIndicator = document.getElementById('searchLoadingIndicator');
    
    if (isLoading) {
        searchButton.disabled = true;
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisando...';
        searchInput.disabled = true;
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
    } else {
        searchButton.disabled = false;
        searchButton.innerHTML = '<i class="fas fa-search"></i> Analisar';
        searchInput.disabled = false;
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

// Realizar pesquisa de mercado
async function performMarketResearch(query) {
    console.log(`Realizando pesquisa para: "${query}"`);
    
    // Obter token de autenticação
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session || !session.access_token) {
        throw new Error('Usuário não autenticado');
    }
    
    const accessToken = session.access_token;
    
    // Fazer requisição para Edge Function
    const response = await fetch(`${SUPABASE_FUNCTIONS_BASE_URL}/market-research`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            timestamp: new Date().toISOString()
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro na pesquisa: ${response.status}`);
    }
    
    const results = await response.json();
    console.log('Resultados da pesquisa:', results);
    
    return results;
}

// Mostrar resultados da pesquisa
function showMarketResearchResults(results) {
    console.log('Exibindo resultados da pesquisa');
    
    // Renderizar os resultados diretamente na página
    const resultsContainer = document.getElementById('marketResultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = generateResultsHTML(results);
        resultsContainer.style.display = 'block';
        
        // Rolar para os resultados
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('Container de resultados não encontrado');
    }
    
    // Salvar resultados atuais
    currentSearchState.lastResults = results;

    // Renderizar gráficos após o HTML ser inserido no DOM
    setTimeout(() => {
        renderCharts(results.data);
    }, 100);
}

// Criar modal de resultados


// Gerar HTML dos resultados
function generateResultsHTML(results) {
    if (!results || !results.success) {
        return `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro na Análise</h3>
                <p>${results?.error || 'Não foi possível realizar a análise'}</p>
            </div>
        `;
    }
    
    const data = results.data;
    
    return `
        <div class="results-container">
            <!-- Resumo Executivo -->
            <div class="result-section">
                <h3><i class="fas fa-clipboard-list"></i> Resumo Executivo</h3>
                <div class="summary-card">
                    <div class="summary-item">
                        <span class="label">Produto Analisado:</span>
                        <span class="value">${data.product_name || 'N/A'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Categoria:</span>
                        <span class="value">${data.category || 'N/A'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Índice de Demanda:</span>
                        <span class="value demand-${getDemandLevel(data.demand_index)}>${data.demand_index || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <!-- Análise de Preços -->
            <div class="result-section">
                <h3><i class="fas fa-dollar-sign"></i> Análise de Preços</h3>
                <div class="price-analysis">
                    ${generatePriceAnalysisHTML(data.price_analysis)}
                </div>
            </div>
            
            <!-- Tendências -->
            <div class="result-section">
                <h3><i class="fas fa-trending-up"></i> Tendências de Mercado</h3>
                <div class="trends-container">
                    ${generateTrendsHTML(data.trends)}
                </div>
                <div class="chart-grid">
                    <div class="chart-card">
                        <h4>Tendência de Busca</h4>
                        <div class="chart-container">
                            <canvas id="trendsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Demografia & Mercado -->
            <div class="result-section">
                <h3><i class="fas fa-users"></i> Demografia & Mercado</h3>
                <div class="chart-grid">
                    <div class="chart-card">
                        <h4>Renda Média por Região</h4>
                        <div class="chart-container">
                            <canvas id="demographicsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Insights de Vendas -->
            <div class="result-section">
                <h3><i class="fas fa-chart-bar"></i> Insights de Vendas</h3>
                <div class="chart-grid">
                    <div class="chart-card">
                        <h4>Insights de Vendas</h4>
                        <div class="chart-container">
                            <canvas id="salesInsightsChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Insights e Recomendações -->
            <div class="result-section">
                <h3><i class="fas fa-lightbulb"></i> Insights e Recomendações</h3>
                <div class="insights-container">
                    ${generateInsightsHTML(data.insights)}
                </div>
            </div>
        </div>
    `;
}

// Gerar HTML da análise de preços
function generatePriceAnalysisHTML(priceAnalysis) {
    if (!priceAnalysis) {
        return '<p class="no-data">Dados de preços não disponíveis</p>';
    }
    
    return `
        <div class="price-grid">
            <div class="price-card">
                <div class="price-label">Preço Médio</div>
                <div class="price-value">R$ ${priceAnalysis.average_price || 'N/A'}</div>
            </div>
            <div class="price-card">
                <div class="price-label">Preço Mínimo</div>
                <div class="price-value">R$ ${priceAnalysis.min_price || 'N/A'}</div>
            </div>
            <div class="price-card">
                <div class="price-label">Preço Máximo</div>
                <div class="price-value">R$ ${priceAnalysis.max_price || 'N/A'}</div>
            </div>
            <div class="price-card">
                <div class="price-label">Preço Sugerido</div>
                <div class="price-value suggested">R$ ${priceAnalysis.suggested_price || 'N/A'}</div>
            </div>
        </div>
    `;
}

// Gerar HTML das tendências
function generateTrendsHTML(trends) {
    if (!trends || !trends.length) {
        return '<p class="no-data">Dados de tendências não disponíveis</p>';
    }
    
    return trends.map(trend => `
        <div class="trend-item">
            <div class="trend-period">${trend.period}</div>
            <div class="trend-value ${trend.direction}">${trend.value}%</div>
            <div class="trend-description">${trend.description}</div>
        </div>
    `).join('');
}

// Gerar HTML dos insights
function generateInsightsHTML(insights) {
    if (!insights || !insights.length) {
        return '<p class="no-data">Insights não disponíveis</p>';
    }
    
    return insights.map(insight => `
        <div class="insight-item">
            <div class="insight-icon">
                <i class="fas fa-${insight.icon || 'info-circle'}"></i>
            </div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.description}</p>
            </div>
        </div>
    `).join('');
}

// Obter nível de demanda
function getDemandLevel(demandIndex) {
    if (!demandIndex) return 'unknown';
    
    const index = parseFloat(demandIndex);
    if (index >= 80) return 'high';
    if (index >= 50) return 'medium';
    if (index >= 20) return 'low';
    return 'very-low';
}



// Exportar resultados
function exportResults() {
    if (!currentSearchState.lastResults) {
        alert('Nenhum resultado para exportar');
        return;
    }
    
    const data = currentSearchState.lastResults;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `pesquisa-mercado-${currentSearchState.currentQuery}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

// Limpar pesquisa
function clearSearch() {
    const searchInput = document.getElementById('marketSearchInput');
    if (searchInput) {
        searchInput.value = '';
        validateSearchInput();
    }
    
    hideInputError();
}

// Mostrar erro de pesquisa
function showSearchError(message) {
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content error">
            <div class="modal-header">
                <h2><i class="fas fa-exclamation-triangle"></i> Erro na Pesquisa</h2>
                <button class="modal-close" onclick="this.closest('.error-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>${message}</p>
                <p>Tente novamente em alguns instantes ou entre em contato com o suporte se o problema persistir.</p>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="this.closest('.error-modal').remove()">
                    Entendi
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorModal);
}

// Funções de cache
function getCachedResult(query) {
    try {
        const cacheKey = `market_research_${btoa(query)}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const data = JSON.parse(cached);
            const now = Date.now();
            
            if (now - data.timestamp < MARKET_RESEARCH_CONFIG.cacheTimeout) {
                return data.results;
            } else {
                localStorage.removeItem(cacheKey);
            }
        }
    } catch (error) {
        console.error('Erro ao acessar cache:', error);
    }
    
    return null;
}

function setCachedResult(query, results) {
    try {
        const cacheKey = `market_research_${btoa(query)}`;
        const data = {
            timestamp: Date.now(),
            results: results
        };
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar no cache:', error);
    }
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
        // Remover duplicatas
        currentSearchState.searchHistory = currentSearchState.searchHistory.filter(item => item.query !== query);
        
        // Adicionar no início
        currentSearchState.searchHistory.unshift({
            query: query,
            timestamp: Date.now()
        });
        
        // Manter apenas os últimos 10
        currentSearchState.searchHistory = currentSearchState.searchHistory.slice(0, 10);
        
        // Salvar no localStorage
        localStorage.setItem('market_research_history', JSON.stringify(currentSearchState.searchHistory));
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}



// Exportar funções globais
window.initMarketResearch = initMarketResearch;

window.exportResults = exportResults;



// Renderizar gráficos
function renderCharts(data) {
    // Tendência de Busca
    if (data.trends_chart && data.trends_chart.labels && data.trends_chart.data) {
        const ctxTrends = document.getElementById("trendsChart");
        if (ctxTrends) {
            new Chart(ctxTrends, {
                type: "line",
                data: {
                    labels: data.trends_chart.labels,
                    datasets: [{
                        label: "Interesse ao longo do tempo",
                        data: data.trends_chart.data,
                        borderColor: "#ff6b35",
                        backgroundColor: "rgba(255, 107, 53, 0.2)",
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Demografia & Mercado (exemplo de gráfico de barras para renda média)
    if (data.demographics_chart && data.demographics_chart.labels && data.demographics_chart.data) {
        const ctxDemographics = document.getElementById("demographicsChart");
        if (ctxDemographics) {
            new Chart(ctxDemographics, {
                type: "bar",
                data: {
                    labels: data.demographics_chart.labels,
                    datasets: [{
                        label: "Renda Média",
                        data: data.demographics_chart.data,
                        backgroundColor: "#4CAF50",
                        borderColor: "#4CAF50",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Insights de Vendas (exemplo de gráfico de barras)
    if (data.sales_insights_chart && data.sales_insights_chart.labels && data.sales_insights_chart.data) {
        const ctxSales = document.getElementById("salesInsightsChart");
        if (ctxSales) {
            new Chart(ctxSales, {
                type: "bar",
                data: {
                    labels: data.sales_insights_chart.labels,
                    datasets: [{
                        label: "Insights de Vendas",
                        data: data.sales_insights_chart.data,
                        backgroundColor: "#007bff",
                        borderColor: "#007bff",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
}

// Atualizar showMarketResearchResults para chamar renderCharts
// (Esta parte será feita com file_replace_text no próximo passo)


