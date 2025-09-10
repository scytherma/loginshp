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
    const invalidChars = /[<>{}\[\]\\]/;
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
        displayMarketResearchResults(cachedResult);
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
        displayMarketResearchResults(results);
        
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

// Função para exibir os resultados diretamente na página
function displayMarketResearchResults(results) {
    console.log('Exibindo resultados da pesquisa diretamente na página');
    const resultsContainer = document.getElementById('marketResearchResultsContainer');
    if (!resultsContainer) {
        console.error('Elemento marketResearchResultsContainer não encontrado.');
        return;
    }

    if (!results || !results.success) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro na Análise</h3>
                <p>${results?.error || 'Não foi possível realizar a análise'}</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        return;
    }

    const data = results.data;
    
    // Atualizar o conteúdo das seções existentes
    updateTrendSection(data.trends);
    updateRegionSection(data.regions);
    updateDemographySection(data.demographics);
    updateCompetitionSection(data.competition);
    updateSuggestedPriceSection(data.price_analysis);
    updateSalesInsightsSection(data.sales_insights);
    updateInsightsRecommendationsSection(data.insights_recommendations);

    // Mostrar o container de resultados
    resultsContainer.style.display = 'block';

    // Salvar resultados atuais
    currentSearchState.lastResults = results;
}

// Atualizar seção de tendência de busca
function updateTrendSection(trendsData) {
    const trendContainer = document.querySelector('.trend-chart-container');
    if (!trendContainer) return;

    trendContainer.innerHTML = `
        <h2><i class="fas fa-chart-line icon"></i> Tendência de Busca</h2>
        <div class="trend-content">
            <p>Interesse ao longo do tempo</p>
            <canvas id="trendChart" width="400" height="200"></canvas>
            <div class="trend-summary">
                <span>Últimos 7 dias: <strong id="trend7Days">+15%</strong></span>
                <span>Últimos 30 dias: <strong id="trend30Days">+8%</strong></span>
            </div>
        </div>
    `;

    // Renderizar gráfico de tendência
    renderTrendChart(trendsData);
}

// Atualizar seção de regiões
function updateRegionSection(regionsData) {
    const regionContainer = document.querySelector('.region-map-container');
    if (!regionContainer) return;

    regionContainer.innerHTML = `
        <h2><i class="fas fa-map-marked-alt icon"></i> Regiões</h2>
        <div class="region-content">
            <div id="brazilMapContainer">
                <svg id="brazilMap" width="300" height="250" viewBox="0 0 800 600">
                    <!-- Mapa do Brasil será renderizado aqui -->
                </svg>
            </div>
        </div>
    `;

    // Renderizar mapa do Brasil
    renderBrazilMap(regionsData);
}

// Atualizar seção de demografia e mercado
function updateDemographySection(demographicsData) {
    const demographyContainer = document.querySelector('.demography-chart-container');
    if (!demographyContainer) return;

    demographyContainer.innerHTML = `
        <h2><i class="fas fa-users icon"></i> Demografia & Mercado</h2>
        <div class="demography-content">
            <p>Renda Média</p>
            <canvas id="incomeChart" width="300" height="150"></canvas>
        </div>
    `;

    // Renderizar gráfico de renda
    renderIncomeChart(demographicsData?.income_distribution);
}

// Atualizar seção de concorrência
function updateCompetitionSection(competitionData) {
    const competitionContainer = document.querySelector('.competition-table-container');
    if (!competitionContainer) return;

    competitionContainer.innerHTML = `
        <h2><i class="fas fa-balance-scale icon"></i> Concorrência</h2>
        <div class="competition-content">
            <p>Preço e Avaliações</p>
            <table class="competition-table">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Avaliação</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateCompetitionTableRows(competitionData)}
                </tbody>
            </table>
        </div>
    `;
}

// Atualizar seção de preço sugerido
function updateSuggestedPriceSection(priceAnalysis) {
    const priceContainer = document.querySelector('.suggested-price-container');
    if (!priceContainer) return;

    priceContainer.innerHTML = `
        <h2><i class="fas fa-dollar-sign icon"></i> Preço Sugerido</h2>
        <div class="price-content">
            <div class="suggested-price-value">R$ ${priceAnalysis?.suggested_price || '105,00'}</div>
            <div class="profit-margin">Margem de Lucro<br><strong>${priceAnalysis?.profit_margin || '30'}%</strong></div>
        </div>
    `;
}

// Atualizar seção de insights de vendas
function updateSalesInsightsSection(salesInsights) {
    const salesContainer = document.querySelector('.sales-insights-chart-container');
    if (!salesContainer) return;

    salesContainer.innerHTML = `
        <h2><i class="fas fa-chart-bar icon"></i> Insights de Vendas</h2>
        <div class="sales-content">
            <canvas id="salesInsightsChart" width="300" height="150"></canvas>
        </div>
    `;

    // Renderizar gráfico de insights de vendas
    renderSalesInsightsChart(salesInsights);
}

// Atualizar seção de insights e recomendações
function updateInsightsRecommendationsSection(insightsData) {
    const insightsContainer = document.querySelector('.insights-recommendations-section');
    if (!insightsContainer) return;

    insightsContainer.innerHTML = `
        <h2><i class="fas fa-lightbulb icon"></i> Insights e Recomendações</h2>
        <div class="insights-content">
            <ul>
                ${generateInsightsRecommendationsList(insightsData)}
            </ul>
        </div>
    `;
}

// Gerar linhas da tabela de concorrência
function generateCompetitionTableRows(competitionData) {
    if (!competitionData || competitionData.length === 0) {
        return '<tr><td colspan="3">Nenhum dado de concorrência disponível.</td></tr>';
    }
    return competitionData.map(item => `
        <tr>
            <td>${item.product_name || 'N/A'}</td>
            <td>R$ ${item.price || 'N/A'}</td>
            <td>${generateStarRating(item.rating)}</td>
        </tr>
    `).join('');
}

// Gerar estrelas de avaliação
function generateStarRating(rating) {
    if (rating === undefined || rating === null) return 'N/A';
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star filled"></i>';
        } else {
            stars += '<i class="fas fa-star"></i>';
        }
    }
    return stars;
}

// Gerar lista de insights e recomendações
function generateInsightsRecommendationsList(insightsData) {
    if (!insightsData || insightsData.length === 0) {
        return '<li>Nenhum insight ou recomendação disponível.</li>';
    }
    return insightsData.map(insight => `
        <li>
            <strong>${insight.title}:</strong> ${insight.description}
        </li>
    `).join('');
}

// Renderizar Gráfico de Tendência de Busca
function renderTrendChart(trendsData) {
    const canvas = document.getElementById("trendChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Gerar dados de exemplo para os últimos 6 meses se não houver dados reais
    const today = new Date();
    const sampleData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
        const monthYear = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
        return { month: monthYear, value: Math.floor(Math.random() * 50) + 50 }; // Valores entre 50 e 100
    });

    const labels = trendsData?.labels || sampleData.map(d => d.month);
    const dataValues = trendsData?.values || sampleData.map(d => d.value);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Interesse de Busca',
                data: dataValues,
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.2)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#ff6b35',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#ff6b35',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Interesse'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Interesse: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });

    // Atualizar percentuais de aumento/queda (exemplo)
    const trend7Days = document.getElementById('trend7Days');
    const trend30Days = document.getElementById('trend30Days');
    if (trend7Days) trend7Days.textContent = '+15%'; // Dados reais viriam da API
    if (trend30Days) trend30Days.textContent = '+8%'; // Dados reais viriam da API
}

// Renderizar Mapa do Brasil
function renderBrazilMap(regionsData) {
    const mapContainer = document.getElementById("brazilMapContainer");
    if (!mapContainer) return;

    const svgElement = mapContainer.querySelector('#brazilMap');
    if (!svgElement) return;

    let svgPaths = '';
    const defaultColor = '#ff6b35'; // Laranja forte
    const hoverColor = '#e05a2e'; // Laranja mais escuro para hover

    // Dados de exemplo para porcentagens se não houver dados reais
    const samplePercentages = {
        'AC': 0.5,
        'AL': 1.2,
        'AM': 0.8,
        'AP': 0.3,
        'BA': 3.5,
        'CE': 2.1,
        'DF': 1.8,
        'ES': 0.9,
        'GO': 2.3,
        'MA': 1.0,
        'MG': 6.0,
        'MS': 0.7,
        'MT': 1.5,
        'PA': 1.1,
        'PB': 0.6,
        'PE': 2.8,
        'PI': 0.4,
        'PR': 4.0,
        'RJ': 7.0,
        'RN': 0.7,
        'RO': 0.2,
        'RR': 0.1,
        'RS': 5.5,
        'SC': 3.0,
        'SE': 0.5,
        'SP': 15.0,
        'TO': 0.3
    };

    // Use regionsData se disponível, caso contrário, use samplePercentages
    const percentages = regionsData || samplePercentages;

    for (const stateCode in brazilMapPaths) {
        const pathD = brazilMapPaths[stateCode];
        const percentage = (percentages[stateCode] !== undefined) ? (percentages[stateCode] * 100).toFixed(1) : 'N/A';
        const fillColor = defaultColor;
        svgPaths += `<path d="${pathD}" id="state-${stateCode}" data-state="${stateCode}" data-percentage="${percentage}%" fill="${fillColor}" class="state-path"></path>`;
    }

    svgElement.innerHTML = svgPaths;

    const tooltip = document.createElement('div');
    tooltip.id = 'mapTooltip';
    tooltip.className = 'map-tooltip';
    mapContainer.appendChild(tooltip);

    // Adicionar event listeners para hover
    mapContainer.querySelectorAll('.state-path').forEach(path => {
        path.addEventListener('mouseover', (e) => {
            const stateName = e.target.dataset.state;
            const percentage = e.target.dataset.percentage;
            tooltip.textContent = `${stateName}: ${percentage}`;
            tooltip.style.display = 'block';
            e.target.style.fill = hoverColor; // Mudar cor ao passar o mouse
        });

        path.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.clientX + 10}px`;
            tooltip.style.top = `${e.clientY + 10}px`;
        });

        path.addEventListener('mouseout', (e) => {
            tooltip.style.display = 'none';
            e.target.style.fill = defaultColor; // Voltar à cor original
        });
    });
}

// Renderizar Gráfico de Renda Média
function renderIncomeChart(incomeData) {
    const canvas = document.getElementById("incomeChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Dados de exemplo para renda média se não houver dados reais
    const sampleIncomeData = [
        { range: '< R$1.000', value: 15, percentage: 25 },
        { range: 'R$1.000 - R$3.000', value: 30, percentage: 50 },
        { range: '> R$3.000', value: 15, percentage: 25 }
    ];

    const dataToUse = incomeData || sampleIncomeData;

    const labels = dataToUse.map(d => d.range);
    const values = dataToUse.map(d => d.value);
    const percentages = dataToUse.map(d => d.percentage);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribuição de Renda',
                data: values,
                backgroundColor: '#ff6b35',
                borderColor: '#e05a2e',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Pessoas (Milhares)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `R$ ${value}k`;
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Faixa de Renda'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return `Pessoas: ${context.raw}k (${percentages[index]}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Renderizar Gráfico de Insights de Vendas
function renderSalesInsightsChart(salesInsightsData) {
    const canvas = document.getElementById("salesInsightsChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Dados de exemplo para insights de vendas se não houver dados reais
    const sampleSalesInsightsData = [
        { label: 'Estoque', value: 70, percentage: 70 },
        { label: 'Sazonalidade', value: 50, percentage: 50 },
        { label: 'Produtos Complementares', value: 90, percentage: 90 }
    ];

    const dataToUse = salesInsightsData || sampleSalesInsightsData;

    const labels = dataToUse.map(d => d.label);
    const values = dataToUse.map(d => d.value);
    const percentages = dataToUse.map(d => d.percentage);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Insights de Vendas',
                data: values,
                backgroundColor: [
                    '#ff6b35', // Estoque
                    '#ff9f40', // Sazonalidade
                    '#ffc107'  // Produtos Complementares
                ],
                borderColor: [
                    '#e05a2e',
                    '#e08a30',
                    '#e0a800'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Nível de Relevância (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return `${value}%`;
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Categoria'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return `${context.label}: ${percentages[index]}%`;
                        }
                    }
                }
            }
        }
    });
}

// Funções de cache e histórico (mantidas como estavam)
function getCachedResult(query) {
    const cached = localStorage.getItem(`marketResearchCache_${query}`);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < MARKET_RESEARCH_CONFIG.cacheTimeout) {
            return data;
        }
    }
    return null;
}

function setCachedResult(query, results) {
    localStorage.setItem(`marketResearchCache_${query}`, JSON.stringify({ timestamp: Date.now(), data: results }));
}

function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('marketResearchHistory') || '[]');
    currentSearchState.searchHistory = history;
    renderSearchHistory();
}

function addToSearchHistory(query) {
    let history = currentSearchState.searchHistory;
    // Remover duplicatas e limitar tamanho
    history = history.filter(item => item !== query);
    history.unshift(query);
    if (history.length > 5) {
        history.pop();
    }
    currentSearchState.searchHistory = history;
    localStorage.setItem('marketResearchHistory', JSON.stringify(history));
    renderSearchHistory();
}

function renderSearchHistory() {
    const historySection = document.querySelector('.history-section');
    const historyList = document.querySelector('.history-list');
    if (!historySection || !historyList) return;

    historyList.innerHTML = '';
    if (currentSearchState.searchHistory.length > 0) {
        historySection.style.display = 'block';
        currentSearchState.searchHistory.forEach(query => {
            const item = document.createElement('span');
            item.className = 'history-item';
            item.textContent = query;
            item.addEventListener('click', () => {
                document.getElementById('marketSearchInput').value = query;
                handleMarketSearch();
            });
            historyList.appendChild(item);
        });
    } else {
        historySection.style.display = 'none';
    }
}

function clearSearch() {
    document.getElementById('marketSearchInput').value = '';
    hideInputError();
    document.getElementById('marketSearchButton').disabled = true;
    document.getElementById('marketResearchResultsContainer').style.display = 'none';
    currentSearchState.lastResults = null;
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initMarketResearch);

const brazilMapPaths = {
  "AC": "M17272 35577l383 -174 104 -417 -104 -938 486 -383 1426 139 2537 -347 1252 69 556 -695 348 0 243 -278 209 69 104 -382 209 -139 764 660 383 105 1217 -313 417 -591 556 -244 243 -382 765 -35 869 -347 557 730 695 521 1078 313 903 0 209 -104 139 -730 452 -418 -70 -764 174 -105 4833 313 -70 -208 278 -487 765 -487 2016 313 765 -104 765 174 209 347 312 139 1078 105 939 347 1564 0 2225 835 1356 -1078 4693 1112 1113 244 2086 1460 3580 -1425 209 -626 313 139 139 869 -278 1495 869 904 -696 730 279 69 799 -104 348 209 -35 312 -487 -104 -1008 278 278 209 278 904 279 -487 382 348 -104 278 -765 35 -1078 764 -660 -243 -487 313 -313 730 -591 -243 -487 34 -34 418 -383 -139 -382 347 347 313 -660 313 0 452 -383 -104 244 -452 -383 -105 -486 487 -105 -139 -452 243 -104 348 -973 556 -244 -174 -1043 452 -417 105 -695 -105 -869 418 -1182 -557 0 -486 -383 -661 -591 -695 -347 -70 -869 -452 -487 244 -834 69 -139 -104 -174 139 -313 -382 -278 -140 -869 591 -696 140 -556 312 -487 -34 -834 521 -487 35 -278 278 -313 -35 -973 522 -1495 0 -174 -209 -660 383 -730 0 -139 278 -522 139 -695 591 -383 695 -312 -278 -557 765 -208 -70 -452 626 -313 69 -591 661 -1321 521 -243 -278 -174 105 -452 -279 -1843 383 -556 1495 -487 35 -625 -418 -661 0 -2920 2851 -626 35 -730 -591 -1043 -1426 -1182 -625 -695 452 -383 591 -1077 556 382 -800 -174 -799 -834 -835 -765 244 -626 -174 -486 -1460 -383 -522 -869 0 -521 417 -105 -69 -278 -452 -347 -139 -35 -869 -209 -522 -938 -973 104 -209 765 -243 -591 -939 208 -591 209 35 626 661 1286 104 417 -104 556 -730 348 -661 -174 -939 243 -1390 -243 -800z",
  "AL": "M167370 230170l783 -32 84 61 45 245 470 504 474 -240 583 189 168 274 591 61 331 -69 130 -118 196 258 855 177 199 -192 249 546 230 69 294 -92 136 93 169 -159 296 27 387 -317 219 139 243 -164 845 36 11 378 4059 3687 4110 -1712 147 1 429 217 1289 210 605 -135 309 47 416 343 267 388 138 1040 292 155 134 198 1225 171 3642 -463 2057 975 608 40 38 86 -95 147 -1125 989 114 386 -557 379 -122 276 -1299 1351 -143 308 -236 267 -137 -5 -289 177 -350 -89 -52 -84 -3208 57 -217 69 -203 -153 154 -298 -251 -73 -58 152 -171 -2 -60 -201 -250 -172 -74 -10 5 178 -325 -57 -79 -63 14 -193 -522 -116 -76 -150 -303 -29 -223 176 -124 1 -370 -176 -104 30 -451 -377 -308 -1 -59 -122 -217 46 -448 -150 -688 346 -358 -233 -310 8 -287 -306 -153 -2 -151 -168 -143 -3 -535 -189 -612 -422 -412 92 -535 -197 -199 -8 -460 337 -212 10 -244 173 -276 -24 -514 -601 -165 -430 -218 -148 19 -352 -251 -231 -31 -142 -220 -51 -449 -323 -637 -145 -184 41 -246 -126 -389 46 -205 -115 -381 7 -507 -761 -2230 278 -23 -354 -411 -456 -67 -167 -482 -406 -475 -219 -289 -293 -428 -116 -173 64 -456 -252 -97 -151 -450 -3401 0 0z",
  "AM": "M5416 148951l478 -1546 646 -619 -253 -309 -28 -169 85 -225 84 -56 281 0 422 -225 253 57 646 -141 506 169 310 -225 140 0 113 84 140 28 534 -84 141 253 112 112 141 0 253 -112 141 -28 253 28 281 84 759 -140 281 28 281 -113 309 -225 591 57 421 -85 225 169 478 169 84 84 282 478 253 56 365 225 506 169 225 168 365 141 535 -56 618 -197 422 -197 112 0 281 -84 338 197 309 -253 253 -141 562 -112 141 -169 197 -366 365 -253 197 -196 112 -57 366 -28 225 85 84 112 141 534 -225 141 -281 28 -57 112 28 619 225 140 253 478 338 366 197 365 168 169 85 28 253 -56 224 112 113 -56 112 28 225 169 338 112 674 -56 197 -169 647 -56 168 141 253 478 169 196 253 141 84 112 -253 310 0 168 141 28 169 -168 140 -28 394 56 253 -28 140 -85 253 -309 113 -28 225 141 421 56 366 -141 309 -534 169 -197 393 -56 450 28 591 -84 477 -253 113 -112 0 1714 84 310 -112 0 -169 56 -140 197 -113 225 -225 112 -506 0 -56 281 -253 56 -169 197 -56 141 0 140 169 563 84 506 -112 337 140 84 -28 647 84 253 -56 169 -84 84 -141 -28 -140 56 -85 141 57 618 -169 337 0 141 169 225 28 112 0 731 -28 1069 -253 -57 -7141 -1462 -3205 -1461 -13241 -5876z",
  "AP": "M82657 178215l1895 -790 473 119 237 -277 277 -158 513 158 316 -118 552 -40 1501 198 473 118 474 316 237 0 710 632 750 78 277 277 0 276 395 434 39 237 237 237 0 276 829 790 237 79 316 -79 315 79 514 -79 513 -158 237 237 237 -118 394 0 356 -277 434 -79 395 -355 236 118 553 -236 237 -119 0 -158 276 0 119 -158 -79 -79 434 -158 158 40 79 -79 632 237 157 -40 356 316 158 0 39 -276 158 0 40 276 157 79 79 -316 237 40 0 355 158 0 40 -158 118 237 237 118 118 -39 0 -237 79 -39 198 197 355 118 118 395 435 0 197 395 197 158 0 -395 356 79 276 -750 -276 -237 39 -631 434 355 119 0 -79 -277 276 -39 237 158 316 -355 118 236 277 198 671 -237 355 118 0 -276 474 0 -119 -434 -237 0 0 -119 79 -118 474 -158 -632 -197 356 -198 513 -592 947 -197 -118 829 -79 2289 -158 948 158 2487 158 513 -40 750 -592 1066 -2447 2290 0 118 -987 553 -2566 276 -355 -118 -948 -987 -237 158 -434 947 -158 119 -197 0 -119 -79 -158 -237 119 -829 -119 -316 -276 -158 -355 40 -277 236 198 908 0 356 -119 157 -671 -157 -947 79 -474 236 -237 237 -39 237 513 750 0 158 -237 513 -513 40 -987 -316 -316 -316 -39 -395 158 -710 -356 -1066 -118 -158 -869 118 -513 -513 -355 -118 -1619 158 -513 -277 -1145 79 -908 -434 -1066 0 -631 -1500 -198 -237 -829 -316 -552 -315 -671 276 -198 -40 -79 -276 395 -553 79 -552 -118 -316 -79 -1105 -514 -593 -118 -434 79 -197 355 -316 395 0 316 -197 118 -829 -79 -356 -513 -750 -434 -197 -395 -474 -355 -118z",
  "BA": "M167370 230170l783 -32 84 61 45 245 470 504 474 -240 583 189 168 274 591 61 331 -69 130 -118 196 258 855 177 199 -192 249 546 230 69 294 -92 136 93 169 -159 296 27 387 -317 219 139 243 -164 845 36 11 378 4059 3687 4110 -1712 147 1 429 217 1289 210 605 -135 309 47 416 343 267 388 138 1040 292 155 134 198 1225 171 3642 -463 2057 975 608 40 38 86 -95 147 -1125 989 114 386 -557 379 -122 276 -1299 1351 -143 308 -236 267 -137 -5 -289 177 -350 -89 -52 -84 -3208 57 -217 69 -203 -153 154 -298 -251 -73 -58 152 -171 -2 -60 -201 -250 -172 -74 -10 5 178 -325 -57 -79 -63 14 -193 -522 -116 -76 -150 -303 -29 -223 176 -124 1 -370 -176 -104 30 -451 -377 -308 -1 -59 -122 -217 46 -448 -150 -688 346 -358 -233 -310 8 -287 -306 -153 -2 -151 -168 -143 -3 -535 -189 -612 -422 -412 92 -535 -197 -199 -8 -460 337 -212 10 -244 173 -276 -24 -514 -601 -165 -430 -218 -148 19 -352 -251 -231 -31 -142 -220 -51 -449 -323 -637 -145 -184 41 -246 -126 -389 46 -205 -115 -381 7 -507 -761 -2230 278 -23 -354 -411 -456 -67 -167 -482 -406 -475 -219 -289 -293 -428 -116 -173 64 -456 -252 -97 -151 -450 -3401 0 0z",
  "CE": "M111225 250586l-49 -5695 5100 -3629 26 161 5817 -2505 -8 2691 419 371 -1458 5651 1 4612 -5774 -1411 11 1787 -1436 -978 -490 -36 -587 -414 -1574 -606 2 1z",
  "DF": "M-473100,-160363l-19,8l-24,-6l-26,-1l-35,51l-21,46l-11,2l-18,-8l-3,-25l-57,73l-18,2l-21,16l-21,31l-8,-13l-16,-9l-13,15l13,8l-13,11l1,10l23,2l3,16l-7,10l-26,-1l-14,7h-19l-13,9l-4,22l-12,13l-34,8l-27,-5l-17,-14l-14,4l-13,-5l-20,8l-49,34l4,15l-5,18l-15,-1l-18,-20l-15,20l-3,27l4,30l-5,10l-16,-4l-10,17l-24,61l-16,5l16,22l-9,23l28,11l-20,9l-7,17h-20l-6,10l11,13l-1,20l12,28l-20,13l3,18l16,-7l15,25l-12,10l-5,17l2,18l38,31l-17,10l-1,15l29,3l-4,25l18,23l-7,21l10,18l17,6l-12,12l-9,26l15,19l-34,8l6,15h11l9,23l-10,4l-17,-24l-9,13l16,18l31,2l5,17l34,3l-11,17l38,20l-4,12l0,24l7,40l-27,24l-15,-17l-28,21l12,43l14,16l-9,15l18,19l-17,16l-9,-3l-27,5l-14,14l-26,-2l24,64l-3,7l-22,3l-16,25l8,18l-8,10l-2,27l-5,16l2,16l-19,8l7,23l-5,8l17,10l-12,12l16,7l16,19l2,17l26,32l6,37l-12,3l-3,14l18,8l-4,29l-21,1l-6,11l23,18l20,7l-1,19l8,23l-2,20l10,16l6,20l-13,19l2,12h-20l27,57l-5,16l11,23l-2,37h8l12,-20l6,23l-7,32l0,19l-13,14l10,13l16,-5l20,3l6,9l-8,19l25,10l-4,15l10,7l27,-24l18,6l8,14l-15,31l9,17l18,-12l4,14l-14,4l2,25l14,11l9,16l17,9l0,27h18l1,16l-13,10l-1,12l15,1l27,12l-4,17l12,10l-13,14l16,15l10,2l16,19h14l11,18l4,18l-1,31l14,13l-1,19l17,9l-7,17l7,11h31l13,20l7,27l-4,22l19,4l10,19l-12,28l2,23l8,12l14,3l10,31l15,6l7,12l3,26l18,1l6,23l19,10l-5,17l18,27l-3,9l35,30l7,20l0,48l6,14l-20,19l-12,3l-7,17l-17,6l18,40l-13,34l6,13l-7,12l-19,8l-3,17l8,9l-5,18l21,14l24,8l10,12l2,34l11,7l3,31l-3,26l2,20l-7,10l19,52l-50,39l-10,31l-25,26l-6,-15l-38,6l-6,-5l-18,15l-6,21l5,9l-36,10l-5,25l11,13l20,-1l-2,26l19,19l-5,44l15,13l-4,14l-14,10l12,58l-17,1l7,23l-13,18l5,24l14,3l6,17l-26,21l20,32l-34,25l12,6l-1,46l-12,10l0,29l-25,30l-7,34l19,10l-2,17l21,37l-10,7l6,15l21,17l-6,23l11,22l-3,12l17,24l12,9l1,22l17,29l6,34l-3,11l10,21l19,3l17,8l26,3l-7,29l-3,35l-10,16l-37,26l-14,-3l-42,-29l-29,34l-22,-14l-24,1l-15,18l-16,4l-23,15l-17,5l-18,17l-39,24l-18,-5l-3,-9l-28,6l-9,7l-36,-3l-8,-8l-19,9l-11,-5l-10,21h-39l-19,-13l-48,19l-26,1l-29,13l-14,26l-4,32l3,9l-12,11l-1,13l-41,-6l-15,6l-26,-6l-9,3l-15,30l-1,15l-18,5l-7,38l-56,12l9,39l-8,27l-11,-10l-17,13l-2,25l-22,8l-17,1l-20,-13h-15l-11,8l-16,-1l-15,-10l-19,20h-16l-9,8l0,439l-776,-1l-365,-1l-466,-1h-378h-715h-821l-835,-1h-1222h-781l-873,-1h-584l0,-153l2,-872l1,-181l-13,1l-23,-15l-36,11h-26l-18,7l-29,-5l-22,2l-18,-5l-12,-16l-11,-24l-17,-12l-22,-7l-15,-12l-11,-28l-12,-4l-11,-18l-2,-21l-20,-16l-27,-28l-7,-22l-7,-49l-9,-16l5,-26l18,-46l-4,-12l-6,-27l8,-24l-2,-28l-8,-13l-14,-42l-5,-6l-16,-62l-7,-4l1,-25l-18,-46l0,-41l6,-15l-7,-18l17,-15l5,-13l-11,-61l-9,-8l0,-18l23,-22l25,-9l27,2l22,-12l29,4l11,6l29,-10l19,16l40,-9l8,-10l19,-3l49,-26l22,-25l9,-25l1,-49l-2,-64l2,-93l-3,-50l-6,-62l-9,-43l-18,-49l-35,-61l-23,-26l-78,-61l-68,-47l-11,-29l7,-27l-19,-8h-24l-13,-21l10,-25l-16,-32l-11,-12l-16,3l8,-48l-6,-10h-14l-6,20l-17,4l-6,-8l-37,-21l-14,-23h-40l-23,3l-9,-13l-49,-30l-16,-6l-4,-21l-16,13l-17,-9l-4,-15l5,-19l-35,-24l-5,-13l-33,-14l-14,-14l0,-10l-21,-30l-22,-16l0,-19l-8,-41l-12,-38l-11,-8l-13,-21l5,-14l-6,-21l18,-21l-20,-8l-3,-17l4,-16l9,-7l3,-29l9,-7l8,-24l-1,-18l7,-10l3,-41l20,-1l5,-19l-2,-27l-12,-14l1,-28l20,3l20,-10l4,-10l-21,-10l9,-44l21,-9l-8,-15l19,-10l6,-30l13,-5l3,-13l-16,-22l-8,-31l-23,-30l8,-13l21,-6l-1,-11l-18,-2l-6,-17l17,-3l6,-11l-12,-12h-17l8,-19l-5,-12l21,-5l-4,-18l-23,-15l17,-7l5,-18l25,-15l15,1l11,-8l1,-13l-13,-31l0,-28l8,-7l-17,-16l-3,-11h-34l1,-13l-16,-33l23,-11l-9,-26l9,-7l32,-9l16,3l13,-14l37,18l7,29l18,-1l16,-8h12l7,-21l11,-9l18,2l12,-46l22,9l12,-19l-13,-23l3,-15l-5,-30l20,5l6,-37l-22,-7l10,-73h-17l-15,-16l2,-16l-9,-7l1,-26l-9,-11l-14,-4l-2,-12l-26,-20l-3,-19l25,-38l-16,-18l6,-20l8,-6l-23,-22l18,-11l6,-27l-11,-15l-23,-7l-12,-36l12,-9l-13,-21l-10,-7l13,-24l-10,-12l-18,-5l-8,-22l0,-22l-16,-2l-22,-28l2,-10l-13,-30l-10,-30l-3,-25l8,-19l14,-11l2,-19l-7,-14l8,-24l-12,-14l-13,-3l9,-34l-6,-2l-9,-33l10,-7l-22,-32l6,-12l-18,-5l-18,-31l3,-15l-17,-10l11,-19l-11,-11l9,-21l-1,-25h848h459l68,-1h555h462h205l24,-3l176,1l5,1l123,-1l24,1l443,-1h506l566,-1l866,1l612,1h653l201,-1h423h449l587,-1l368,1l976,-1h94l-13,10l13,33l-13,4l-3,14l17,15l-16,4l-22,-8l-4,11l10,11l16,43Z",
  "ES": "M63383 53175l1148 -1785 965 -112 676 -558 197 -331 619 73 825 443 515 -34 368 -493 749 70 400 -948 636 -393 24 -749 656 -77 725 -651 25 -638 411 -277 458 64 -66 -374 357 -363 841 1345 620 314 -472 555 237 521 -330 260 475 378 544 -156 248 379 1063 -871 258 1161 557 -245 1005 1418 631 -993 -488 -425 1235 -71 497 -567 623 123 552 280 39 276 -542 166 49 455 571 312 682 -667 460 756 233 715 -777 261 -68 253 653 462 -220 255 368 491 388 1236 -447 827 174 1210 565 756 -120 2192 1031 113 139 485 -284 207 18 378 704 55 -337 958 -608 -339 -871 858 36 372 -799 1207 340 950 1012 480 546 908 -16 2315 -345 1652 74 353 396 125 -184 362 529 1063 -557 33 -674 -384 -690 540 -179 1915 -485 370 -507 1006 -241 -3613 -630 -505 -2692 -276 -65 -295 -1223 -444 -1123 -922 -899 -173 183 -488 -87 -51 -1009 214 213 -638 -698 -419 -166 -406 670 -184 355 -475 480 -127 -51 -808 -624 -151 1145 -5785 881 -4103 -675 -1206 -11347 -1001 -485 -353 7 -2z",
  "GO": "M17175 119302l0 -310 186 -62 404 -435 155 155 217 -186 187 31 -62 -497 217 -404 466 -31 -31 -652 186 -249 -341 0 -63 -93 435 -155 187 -217 155 62 -187 -497 32 -218 186 0 186 125 187 310 248 -186 -280 -683 -279 -31 -93 -94 0 -155 248 -155 -217 -218 217 -93 621 311 -31 -590 94 -125 372 342 373 31 124 -62 -93 -373 342 62 -249 -310 31 -217 155 0 311 279 0 -342 93 -62 280 156 31 -373 217 -124 -93 -404 311 -124 279 31 186 497 218 31 62 -31 -31 -249 652 -155 -155 311 -249 155 435 310 311 -93 93 218 807 -94 125 -217 62 31 372 590 311 -31 93 -186 186 93 373 -31 559 -559 124 62 -31 186 342 -93 124 280 155 31 808 -435 279 -62 404 248 218 0 155 218 -62 279 155 31 62 249 93 -187 124 0 187 125 62 186 435 155 155 -62 683 435 373 -528 217 -62 342 62 342 466 155 62 279 -93 528 652 249 124 124 -124 155 124 280 -62 -124 342 124 186 124 -155 62 31 31 248 -310 31 -62 93 186 280 -155 310 124 94 -62 155 186 124 31 342 155 217 -279 93 186 62 0 249 -372 155 248 218 -280 31 156 186 31 155 -404 125 124 248 -341 31 -62 124 -280 62 0 311 280 279 -31 156 -218 155 -901 0 -248 280 -186 -94 -218 218 -372 155 -249 466 124 186 -93 373 -372 279 -94 590 -279 218 -93 528 -156 93 -372 -31 -249 279 -372 63 -156 -94 -217 31 -249 187 -217 -93 -248 93 -94 -31 0 -218 -93 -31 -31 -186 -341 -155 -187 -435 -124 248 124 187 -186 93 279 93 -124 93 62 249 -186 -94 -124 125 186 279 31 249 -155 186 124 62 -93 31 31 155 -93 63 -31 -125 -156 62 -62 94 125 31 -187 403 31 280 280 -31 217 590 -279 311 248 93 -31 93 155 155 -31 249 125 93 -156 372 373 187 -124 93 93 62 -124 186 155 280 -124 62 186 155 93 342 124 -31 -496 435 62 93 -249 466 -186 0 279 341 -124 125 31 155 -186 31 62 155 -155 218 93 93 -62 403 155 218 -93 466 248 248 -186 466 -745 124 -63 -745 -341 -186 -124 0 -31 -156 -280 -31 -217 466 -156 -31 -124 -280 0 -465 -341 -715 248 -1118 -124 -124 -62 -590 -187 0 -62 -155 187 -125 -187 -186 -31 -248 -124 -93 93 -187 -279 -62 -31 -217 -125 62 -155 -218 -186 -31 155 -186 0 -280 -528 -186 -124 -217 -93 31 -63 -124 -186 31 -62 -187 -93 62 -155 -93 -94 187 -124 -31 -186 -435 -218 -93 156 -125 -125 -31 -93 62 -248 -372 -124 62 31 -124 -156 -63 125 -124 93 124 155 -93 0 -186 342 -62 93 -435 -186 -217 -311 124 0 -155 -311 62 -279 -31 31 -94 -155 94 -31 -94 -218 0 -31 187 -310 -31 -156 -93 -186 93 -342 -218 -124 62 -62 -62 -155 125 -187 -311 -124 186 -31 -93 -217 124 -93 -248 -156 0 156 -217 -404 -156 -93 -186 -280 -186 -248 -466 -125 31 -62 -93 -186 62 -186 -156 -187 32 62 -125 -279 -62 93 -186 -186 -218 124 -93 31 -279 155 31 0 -93 -124 -62 -217 -342 155 -93 0 -373 -93 -62 155 -155 -155 -31 -62 -249 -31 155 -156 -62 94 -155 -63 -124 187 -218 -124 -341 186 -187 -124 -124z",
  "MA": "M-468422,-43943l-8,-2l-18,18l-21,-19l-18,-3l-10,-14l1,-20l8,-12l-8,-24l-12,-18l-11,1l-33,-50l-10,-5l3,-41l-1,-11l-15,-22l-18,-1l-27,-23l-1,-16l-34,-33l-15,2l-30,-17l-2,-17l6,-11l-33,-3l-9,-33l-17,-9l-13,34l-18,11l-18,1l-11,8l-28,-10l-15,12l-19,-5l-17,3l-14,-11l-11,3l-14,-18l-32,-5l-5,11l-19,-5l-45,-20h-46l-4,-10l-32,-3l-23,-7l-9,-21l3,-11l-27,-19l-46,-2l-16,-10l-34,-13l-13,1l-10,-10l-20,3l-9,-11l-12,2l-18,16l-7,13l9,17l-16,27l2,24l-20,-2l-3,-8l-20,8l-24,-4l-18,-17h-11l-15,14l-9,-8l-13,12l-18,9l-26,-1l-17,6l-44,22l-44,44l-9,3l-20,-5l-30,3l-15,-4l-41,6l-18,-5l-39,13l-32,-1l-22,-17l-12,10l-15,21l-11,-16l-26,-15l-24,2l-8,11l-23,-21l-9,-3l-20,13l-19,6l-24,31h-14l-17,12l-26,-1l-10,10l-18,4l-22,-4l-6,14l14,7l1,36l-23,25l-23,5l-4,16l1,39l-18,21l-14,8l-31,29l-13,19l-15,61l-6,11l1,15l-10,14h-15l-43,17l-17,37l-34,19l1,35l5,11l-11,17h-23l-14,15l-19,-2l-2,12l-17,-2l-17,14l-19,35l-13,-10l-21,3l-10,14l-16,7l1,13l12,16l-1,15l-18,8l6,32l-12,1l4,21l-12,4l-8,19l7,8l0,49l-10,30l-31,8l-10,13l-39,-1l17,40l-7,17l1,34l-20,30l-9,26l3,17l-5,24l-11,18l-21,9l-20,-6l-17,29l3,18l-4,12l-24,31l-19,-4l-11,8l-6,17l-15,13l6,7l-4,28l-10,8l-1,14l12,19l21,10l-7,13l22,19l-5,10l18,12l5,17l-12,19l-13,37l10,35l27,42l27,12l14,19l37,31l10,24l0,38l25,43l6,36l-1,78l-12,66l-27,89h-54l-120,-50l-54,-57l-27,-109l-28,-69l-88,-75l-122,-69l-41,-45l-124,-346l-363,-535l-130,-166l-13,-12l-78,-38l-45,-38l-89,-92l-30,-56l-29,-75l-18,-24l-40,-31l-42,-15l-48,-7l-130,-45l23,-53l-1,-34l-9,-26l0,-29l-14,-52l-7,-41l-14,-25l-17,-62l-17,-27l-3,-9l16,-49l-5,-31l5,-22l-7,-49l3,-39l5,-44l-2,-23l-25,-20l-19,-50l-3,-21l-7,-17l2,-39l22,-65l22,-60l10,-40l7,-14l16,-46l-1,-21l6,-20l33,-28l17,-61l35,-112l33,-49l87,-410l-17,-88l-6,-47l-3,-50l-14,-64l-3,-41l-6,-32l-2,-36l-119,-111l-43,-57l-116,-164l-18,-19l-272,-252l-18,-20l-28,-40l-33,23l2,21l-8,4l-41,-5l-56,16l-31,-15l-42,9l-23,17l-10,-3l-28,15l-16,20l-39,2l-34,5l-17,-2l-15,-11l-26,1l-51,19l-9,10l36,108l-28,11l-141,61l-50,7l-81,15l-96,41l-67,60l-30,-6l-14,23l-18,-5l-13,13l-12,34l29,30l-66,6l-22,17l-34,-5l-23,6l-18,26l-22,5l-26,22l-17,-2l-34,14l-16,-2l-26,18l-28,14l-25,6l-10,7l-40,-12l-22,11l-1,17l-16,-3l-10,6l-25,-15l-15,2l-26,12l-54,8l-19,-2l-19,-11l-25,-22l-19,-13l-31,-37l-57,-18l-20,-20l-42,-18l-39,4l-16,5l-25,1l-41,11l-17,3l-45,-5l-39,-26l-47,-21l-3,-55l4,-33l13,-43l8,-183l0,-9l-22,-164l-55,-5l-71,-18l-39,-7l-46,-3l-56,3l-152,2l-19,-1l-156,2l-38,-1l-27,-5l-96,-24l-31,-6l-102,1l-35,5l-17,-2l-44,11l-5,-3l-69,12l-25,-10l-83,18l-34,20l-81,-68l-64,-51l-164,-137l-96,128l-9,-4l-27,3l-19,-5l-42,3l-38,15h-27l-26,17l-22,-5l-12,4l-39,-10l-18,-27l-27,-34l-1,-7l18,-24l-20,-14l-32,4l-26,-11l-19,-1l-45,38l2,19l-27,15l-4,12l23,21l-4,16l10,24l-12,27l21,35l-14,29l23,28l18,2l-3,20l15,10l19,4l10,14l43,16l7,27l-15,18l-25,40l6,37l-6,27l8,19l-2,16l-16,33l3,20l-9,13l1,33l-6,16l0,29l6,18l-14,37l-2,26l6,16l24,13l21,16l-1,24l9,24l24,19l23,-3l-6,26l-12,16l-1,27l-8,17l-1,34l8,20l29,20l-3,13l10,28l-3,22l7,33l-1,23l8,31l-21,22l-133,9l-30,-3l-32,10l-43,-1l-31,-12l-29,-2l1,30l-35,3l-28,-18h-38l-29,-16l-67,43l-30,-18l-31,13l-47,40l-31,-4l-26,-25l-28,10l-10,40l0,32l-22,25l-42,3l-29,-17l-38,13l-60,-24l-25,18l-93,27l-36,27l-36,6l-27,-9l-66,-85l-28,-20l-31,-5l-15,-36l-34,-60l-24,-25l-38,-52l-962,-749l-890,-693l-240,-194l12,-7l82,2l37,-20l12,-23l1,-16l29,-3l17,-7l21,3l13,9l6,12l14,10l43,15l88,-16l19,-14l17,1l22,-11h20l12,-6l13,-31l43,-8l54,-1
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)



const brazilMapPaths = {
  "AC": "M17272 35577l383 -174 104 -417 -104 -938 486 -383 1426 139 2537 -347 1252 69 556 -695 348 0 243 -278 209 69 104 -382 209 -139 764 660 383 105 1217 -313 417 -591 556 -244 243 -382 765 -35 869 -347 557 730 695 521 1078 313 903 0 209 -104 139 -730 452 -418 -70 -764 174 -105 4833 313 -70 -208 278 -487 765 -487 2016 313 765 -104 765 174 209 347 312 139 1078 105 939 347 1564 0 2225 835 1356 -1078 4693 1112 1113 244 2086 1460 3580 -1425 209 -626 313 139 139 869 -278 1495 869 904 -696 730 279 69 799 -104 348 209 -35 312 -487 -104 -1008 278 278 209 278 904 279 -487 382 348 -104 278 -765 35 -1078 764 -660 -243 -487 313 -313 730 -591 -243 -487 34 -34 418 -383 -139 -382 347 347 313 -660 313 0 452 -383 -104 244 -452 -383 -105 -486 487 -105 -139 -452 243 -104 348 -973 556 -244 -174 -1043 452 -417 105 -695 -105 -869 418 -1182 -557 0 -486 -383 -661 -591 -695 -347 -70 -869 -452 -487 244 -834 69 -139 -104 -174 139 -313 -382 -278 -140 -869 591 -696 140 -556 312 -487 -34 -834 521 -487 35 -278 278 -313 -35 -973 522 -1495 0 -174 -209 -660 383 -730 0 -139 278 -522 139 -695 591 -383 695 -312 -278 -557 765 -208 -70 -452 626 -313 69 -591 661 -1321 521 -243 -278 -174 105 -452 -279 -1843 383 -556 1495 -487 35 -625 -418 -661 0 -2920 2851 -626 35 -730 -591 -1043 -1426 -1182 -625 -695 452 -383 591 -1077 556 382 -800 -174 -799 -834 -835 -765 244 -626 -174 -486 -1460 -383 -522 -869 0 -521 417 -105 -69 -278 -452 -347 -139 -35 -869 -209 -522 -938 -973 104 -209 765 -243 -591 -939 208 -591 209 35 626 661 1286 104 417 -104 556 -730 348 -661 -174 -939 243 -1390 -243 -800z",
  "AL": "M167370 230170l783 -32 84 61 45 245 470 504 474 -240 583 189 168 274 591 61 331 -69 130 -118 196 258 855 177 199 -192 249 546 230 69 294 -92 136 93 169 -159 296 27 387 -317 219 139 243 -164 845 36 11 378 4059 3687 4110 -1712 147 1 429 217 1289 210 605 -135 309 47 416 343 267 388 138 1040 292 155 134 198 1225 171 3642 -463 2057 975 608 40 38 86 -95 147 -1125 989 114 386 -557 379 -122 276 -1299 1351 -143 308 -236 267 -137 -5 -289 177 -350 -89 -52 -84 -3208 57 -217 69 -203 -153 154 -298 -251 -73 -58 152 -171 -2 -60 -201 -250 -172 -74 -10 5 178 -325 -57 -79 -63 14 -193 -522 -116 -76 -150 -303 -29 -223 176 -124 1 -370 -176 -104 30 -451 -377 -308 -1 -59 -122 -217 46 -448 -150 -688 346 -358 -233 -310 8 -287 -306 -153 -2 -151 -168 -143 -3 -535 -189 -612 -422 -412 92 -535 -197 -199 -8 -460 337 -212 10 -244 173 -276 -24 -514 -601 -165 -430 -218 -148 19 -352 -251 -231 -31 -142 -220 -51 -449 -323 -637 -145 -184 41 -246 -126 -389 46 -205 -115 -381 7 -507 -761 -2230 278 -23 -354 -411 -456 -67 -167 -482 -406 -475 -219 -289 -293 -428 -116 -173 64 -456 -252 -97 -151 -450 -3401 0 0z",
  "AM": "M5416 148951l478 -1546 646 -619 -253 -309 -28 -169 85 -225 84 -56 281 0 422 -225 253 57 646 -141 506 169 310 -225 140 0 113 84 140 28 534 -84 141 253 112 112 141 0 253 -112 141 -28 253 28 281 84 759 -140 281 28 281 -113 309 -225 591 57 421 -85 225 169 478 169 84 84 282 478 253 56 365 225 506 169 225 168 365 141 535 -56 618 -197 422 -197 112 0 281 -84 338 197 309 -253 253 -141 562 -112 141 -169 197 -366 365 -253 197 -196 112 -57 366 -28 225 85 84 112 141 534 -225 141 -281 28 -57 112 28 619 225 140 253 478 338 366 197 365 168 169 85 28 253 -56 224 112 113 -56 112 28 225 169 338 112 674 -56 197 -169 647 -56 168 141 253 478 169 196 253 141 84 112 -253 310 0 168 141 28 169 -168 140 -28 394 56 253 -28 140 -85 253 -309 113 -28 225 141 421 56 366 -141 309 -534 169 -197 393 -56 450 28 591 -84 477 -253 113 -112 0 1714 84 310 -112 0 -169 56 -140 197 -113 225 -225 112 -506 0 -56 281 -253 56 -169 197 -56 141 0 140 169 563 84 506 -112 337 140 84 -28 647 84 253 -56 169 -84 84 -141 -28 -140 56 -85 141 57 618 -169 337 0 141 169 225 28 112 0 731 -28 1069 -253 -57 -7141 -1462 -3205 -1461 -13241 -5876z",
  "AP": "M82657 178215l1895 -790 473 119 237 -277 277 -158 513 158 316 -118 552 -40 1501 198 473 118 474 316 237 0 710 632 750 78 277 277 0 276 395 434 39 237 237 237 0 276 829 790 237 79 316 -79 315 79 514 -79 513 -158 237 237 237 -118 394 0 356 -277 434 -79 395 -355 236 118 553 -236 237 -119 0 -158 276 0 119 -158 -79 -79 434 -158 158 40 79 -79 632 237 157 -40 356 316 158 0 39 -276 158 0 40 276 157 79 79 -316 237 40 0 355 158 0 40 -158 118 237 237 118 118 -39 0 -237 79 -39 198 197 355 118 118 395 435 0 197 395 197 158 0 -395 356 79 276 -750 -276 -237 39 -631 434 355 119 0 -79 -277 276 -39 237 158 316 -355 118 236 277 198 671 -237 355 118 0 -276 474 0 -119 -434 -237 0 0 -119 79 -118 474 -158 -632 -197 356 -198 513 -592 947 -197 -118 829 -79 2289 -158 948 158 2487 158 513 -40 750 -592 1066 -2447 2290 0 118 -987 553 -2566 276 -355 -118 -948 -987 -237 158 -434 947 -158 119 -197 0 -119 -79 -158 -237 119 -829 -119 -316 -276 -158 -355 40 -277 236 198 908 0 356 -119 157 -671 -157 -947 79 -474 236 -237 237 -39 237 513 750 0 158 -237 513 -513 40 -987 -316 -316 -316 -39 -395 158 -710 -356 -1066 -118 -158 -869 118 -513 -513 -355 -118 -1619 158 -513 -277 -1145 79 -908 -434 -1066 0 -631 -1500 -198 -237 -829 -316 -552 -315 -671 276 -198 -40 -79 -276 395 -553 79 -552 -118 -316 -79 -1105 -514 -593 -118 -434 79 -197 355 -316 395 0 316 -197 118 -829 -79 -356 -513 -750 -434 -197 -395 -474 -355 -118z",
  "BA": "M167370 230170l783 -32 84 61 45 245 470 504 474 -240 583 189 168 274 591 61 331 -69 130 -118 196 258 855 177 199 -192 249 546 230 69 294 -92 136 93 169 -159 296 27 387 -317 219 139 243 -164 845 36 11 378 4059 3687 4110 -1712 147 1 429 217 1289 210 605 -135 309 47 416 343 267 388 138 1040 292 155 134 198 1225 171 3642 -463 2057 975 608 40 38 86 -95 147 -1125 989 114 386 -557 379 -122 276 -1299 1351 -143 308 -236 267 -137 -5 -289 177 -350 -89 -52 -84 -3208 57 -217 69 -203 -153 154 -298 -251 -73 -58 152 -171 -2 -60 -201 -250 -172 -74 -10 5 178 -325 -57 -79 -63 14 -193 -522 -116 -76 -150 -303 -29 -223 176 -124 1 -370 -176 -104 30 -451 -377 -308 -1 -59 -122 -217 46 -448 -150 -688 346 -358 -233 -310 8 -287 -306 -153 -2 -151 -168 -143 -3 -535 -189 -612 -422 -412 92 -535 -197 -199 -8 -460 337 -212 10 -244 173 -276 -24 -514 -601 -165 -430 -218 -148 19 -352 -251 -231 -31 -142 -220 -51 -449 -323 -637 -145 -184 41 -246 -126 -389 46 -205 -115 -381 7 -507 -761 -2230 278 -23 -354 -411 -456 -67 -167 -482 -406 -475 -219 -289 -293 -428 -116 -173 64 -456 -252 -97 -151 -450 -3401 0 0z",
  "CE": "M111225 250586l-49 -5695 5100 -3629 26 161 5817 -2505 -8 2691 419 371 -1458 5651 1 4612 -5774 -1411 11 1787 -1436 -978 -490 -36 -587 -414 -1574 -606 2 1z",
  "DF": "M-473100,-160363l-19,8l-24,-6l-26,-1l-35,51l-21,46l-11,2l-18,-8l-3,-25l-57,73l-18,2l-21,16l-21,31l-8,-13l-16,-9l-13,15l13,8l-13,11l1,10l23,2l3,16l-7,10l-26,-1l-14,7h-19l-13,9l-4,22l-12,13l-34,8l-27,-5l-17,-14l-14,4l-13,-5l-20,8l-49,34l4,15l-5,18l-15,-1l-18,-20l-15,20l-3,27l4,30l-5,10l-16,-4l-10,17l-24,61l-16,5l16,22l-9,23l28,11l-20,9l-7,17h-20l-6,10l11,13l-1,20l12,28l-20,13l3,18l16,-7l15,25l-12,10l-5,17l2,18l38,31l-17,10l-1,15l29,3l-4,25l18,23l-7,21l10,18l17,6l-12,12l-9,26l15,19l-34,8l6,15h11l9,23l-10,4l-17,-24l-9,13l16,18l31,2l5,17l34,3l-11,17l38,20l-4,12l0,24l7,40l-27,24l-15,-17l-28,21l12,43l14,16l-9,15l18,19l-17,16l-9,-3l-27,5l-14,14l-26,-2l24,64l-3,7l-22,3l-16,25l8,18l-8,10l-2,27l-5,16l2,16l-19,8l7,23l-5,8l17,10l-12,12l16,7l16,19l2,17l26,32l6,37l-12,3l-3,14l18,8l-4,29l-21,1l-6,11l23,18l20,7l-1,19l8,23l-2,20l10,16l6,20l-13,19l2,12h-20l27,57l-5,16l11,23l-2,37h8l12,-20l6,23l-7,32l0,19l-13,14l10,13l16,-5l20,3l6,9l-8,19l25,10l-4,15l10,7l27,-24l18,6l8,14l-15,31l9,17l18,-12l4,14l-14,4l2,25l14,11l9,16l17,9l0,27h18l1,16l-13,10l-1,12l15,1l27,12l-4,17l12,10l-13,14l16,15l10,2l16,19h14l11,18l4,18l-1,31l14,13l-1,19l17,9l-7,17l7,11h31l13,20l7,27l-4,22l19,4l10,19l-12,28l2,23l8,12l14,3l10,31l15,6l7,12l3,26l18,1l6,23l19,10l-5,17l18,27l-3,9l35,30l7,20l0,48l6,14l-20,19l-12,3l-7,17l-17,6l18,40l-13,34l6,13l-7,12l-19,8l-3,17l8,9l-5,18l21,14l24,8l10,12l2,34l11,7l3,31l-3,26l2,20l-7,10l19,52l-50,39l-10,31l-25,26l-6,-15l-38,6l-6,-5l-18,15l-6,21l5,9l-36,10l-5,25l11,13l20,-1l-2,26l19,19l-5,44l15,13l-4,14l-14,10l12,58l-17,1l7,23l-13,18l5,24l14,3l6,17l-26,21l20,32l-34,25l12,6l-1,46l-12,10l0,29l-25,30l-7,34l19,10l-2,17l21,37l-10,7l6,15l21,17l-6,23l11,22l-3,12l17,24l12,9l1,22l17,29l6,34l-3,11l10,21l19,3l17,8l26,3l-7,29l-3,35l-10,16l-37,26l-14,-3l-42,-29l-29,34l-22,-14l-24,1l-15,18l-16,4l-23,15l-17,5l-18,17l-39,24l-18,-5l-3,-9l-28,6l-9,7l-36,-3l-8,-8l-19,9l-11,-5l-10,21h-39l-19,-13l-48,19l-26,1l-29,13l-14,26l-4,32l3,9l-12,11l-1,13l-41,-6l-15,6l-26,-6l-9,3l-15,30l-1,15l-18,5l-7,38l-56,12l9,39l-8,27l-11,-10l-17,13l-2,25l-22,8l-17,1l-20,-13h-15l-11,8l-16,-1l-15,-10l-19,20h-16l-9,8l0,439l-776,-1l-365,-1l-466,-1h-378h-715h-821l-835,-1h-1222h-781l-873,-1h-584l0,-153l2,-872l1,-181l-13,1l-23,-15l-36,11h-26l-18,7l-29,-5l-22,2l-18,-5l-12,-16l-11,-24l-17,-12l-22,-7l-15,-12l-11,-28l-12,-4l-11,-18l-2,-21l-20,-16l-27,-28l-7,-22l-7,-49l-9,-16l5,-26l18,-46l-4,-12l-6,-27l8,-24l-2,-28l-8,-13l-14,-42l-5,-6l-16,-62l-7,-4l1,-25l-18,-46l0,-41l6,-15l-7,-18l17,-15l5,-13l-11,-61l-9,-8l0,-18l23,-22l25,-9l27,2l22,-12l29,4l11,6l29,-10l19,16l40,-9l8,-10l19,-3l49,-26l22,-25l9,-25l1,-49l-2,-64l2,-93l-3,-50l-6,-62l-9,-43l-18,-49l-35,-61l-23,-26l-78,-61l-68,-47l-11,-29l7,-27l-19,-8h-24l-13,-21l10,-25l-16,-32l-11,-12l-16,3l8,-48l-6,-10h-14l-6,20l-17,4l-6,-8l-37,-21l-14,-23h-40l-23,3l-9,-13l-49,-30l-16,-6l-4,-21l-16,13l-17,-9l-4,-15l5,-19l-35,-24l-5,-13l-33,-14l-14,-14l0,-10l-21,-30l-22,-16l0,-19l-8,-41l-12,-38l-11,-8l-13,-21l5,-14l-6,-21l18,-21l-20,-8l-3,-17l4,-16l9,-7l3,-29l9,-7l8,-24l-1,-18l7,-10l3,-41l20,-1l5,-19l-2,-27l-12,-14l1,-28l20,3l20,-10l4,-10l-21,-10l9,-44l21,-9l-8,-15l19,-10l6,-30l13,-5l3,-13l-16,-22l-8,-31l-23,-30l8,-13l21,-6l-1,-11l-18,-2l-6,-17l17,-3l6,-11l-12,-12h-17l8,-19l-5,-12l21,-5l-4,-18l-23,-15l17,-7l5,-18l25,-15l15,1l11,-8l1,-13l-13,-31l0,-28l8,-7l-17,-16l-3,-11h-34l1,-13l-16,-33l23,-11l-9,-26l9,-7l32,-9l16,3l13,-14l37,18l7,29l18,-1l16,-8h12l7,-21l11,-9l18,2l12,-46l22,9l12,-19l-13,-23l3,-15l-5,-30l20,5l6,-37l-22,-7l10,-73h-17l-15,-16l2,-16l-9,-7l1,-26l-9,-11l-14,-4l-2,-12l-26,-20l-3,-19l25,-38l-16,-18l6,-20l8,-6l-23,-22l18,-11l6,-27l-11,-15l-23,-7l-12,-36l12,-9l-13,-21l-10,-7l13,-24l-10,-12l-18,-5l-8,-22l0,-22l-16,-2l-22,-28l2,-10l-13,-30l-10,-30l-3,-25l8,-19l14,-11l2,-19l-7,-14l8,-24l-12,-14l-13,-3l9,-34l-6,-2l-9,-33l10,-7l-22,-32l6,-12l-18,-5l-18,-31l3,-15l-17,-10l11,-19l-11,-11l9,-21l-1,-25h848h459l68,-1h555h462h205l24,-3l176,1l5,1l123,-1l24,1l443,-1h506l566,-1l866,1l612,1h653l201,-1h423h449l587,-1l368,1l976,-1h94l-13,10l13,33l-13,4l-3,14l17,15l-16,4l-22,-8l-4,11l10,11l16,43Z",
  "ES": "M63383 53175l1148 -1785 965 -112 676 -558 197 -331 619 73 825 443 515 -34 368 -493 749 70 400 -948 636 -393 24 -749 656 -77 725 -651 25 -638 411 -277 458 64 -66 -374 357 -363 841 1345 620 314 -472 555 237 521 -330 260 475 378 544 -156 248 379 1063 -871 258 1161 557 -245 1005 1418 631 -993 -488 -425 1235 -71 497 -567 623 123 552 280 39 276 -542 166 49 455 571 312 682 -667 460 756 233 715 -777 261 -68 253 653 462 -220 255 368 491 388 1236 -447 827 174 1210 565 756 -120 2192 1031 113 139 485 -284 207 18 378 704 55 -337 958 -608 -339 -871 858 36 372 -799 1207 340 950 1012 480 546 908 -16 2315 -345 1652 74 353 396 125 -184 362 529 1063 -557 33 -674 -384 -690 540 -179 1915 -485 370 -507 1006 -241 -3613 -630 -505 -2692 -276 -65 -295 -1223 -444 -1123 -922 -899 -173 183 -488 -87 -51 -1009 214 213 -638 -698 -419 -166 -406 670 -184 355 -475 480 -127 -51 -808 -624 -151 1145 -5785 881 -4103 -675 -1206 -11347 -1001 -485 -353 7 -2z",
  "GO": "M17175 119302l0 -310 186 -62 404 -435 155 155 217 -186 187 31 -62 -497 217 -404 466 -31 -31 -652 186 -249 -341 0 -63 -93 435 -155 187 -217 155 62 -187 -497 32 -218 186 0 186 125 187 310 248 -186 -280 -683 -279 -31 -93 -94 0 -155 248 -155 -217 -218 217 -93 621 311 -31 -590 94 -125 372 342 373 31 124 -62 -93 -373 342 62 -249 -310 31 -217 155 0 311 279 0 -342 93 -62 280 156 31 -373 217 -124 -93 -404 311 -124 279 31 186 497 218 31 62 -31 -31 -249 652 -155 -155 311 -249 155 435 310 311 -93 93 218 807 -94 125 -217 62 31 372 590 311 -31 93 -186 186 93 373 -31 559 -559 124 62 -31 186 342 -93 124 280 155 31 808 -435 279 -62 404 248 218 0 155 218 -62 279 155 31 62 249 93 -187 124 0 187 125 62 186 435 155 155 -62 683 435 373 -528 217 -62 342 62 342 466 155 62 279 -93 528 652 249 124 124 -124 155 124 280 -62 -124 342 124 186 124 -155 62 31 31 248 -310 31 -62 93 186 280 -155 310 124 94 -62 155 186 124 31 342 155 217 -279 93 186 62 0 249 -372 155 248 218 -280 31 156 186 31 155 -404 125 124 248 -341 31 -62 124 -280 62 0 311 280 279 -31 156 -218 155 -901 0 -248 280 -186 -94 -218 218 -372 155 -249 466 124 186 -93 373 -372 279 -94 590 -279 218 -93 528 -156 93 -372 -31 -249 279 -372 63 -156 -94 -217 31 -249 187 -217 -93 -248 93 -94 -31 0 -218 -93 -31 -31 -186 -341 -155 -187 -435 -124 248 124 187 -186 93 279 93 -124 93 62 249 -186 -94 -124 125 186 279 31 249 -155 186 124 62 -93 31 31 155 -93 63 -31 -125 -156 62 -62 94 125 31 -187 403 31 280 280 -31 217 590 -279 311 248 93 -31 93 155 155 -31 249 125 93 -156 372 373 187 -124 93 93 62 -124 186 155 280 -124 62 186 155 93 342 124 -31 -496 435 62 93 -249 466 -186 0 279 341 -124 125 31 155 -186 31 62 155 -155 218 93 93 -62 403 155 218 -93 466 248 248 -186 466 -745 124 -63 -745 -341 -186 -124 0 -31 -156 -280 -31 -217 466 -156 -31 -124 -280 0 -465 -341 -715 248 -1118 -124 -124 -62 -590 -187 0 -62 -155 187 -125 -187 -186 -31 -248 -124 -93 93 -187 -279 -62 -31 -217 -125 62 -155 -218 -186 -31 155 -186 0 -280 -528 -186 -124 -217 -93 31 -63 -124 -186 31 -62 -187 -93 62 -155 -93 -94 187 -124 -31 -186 -435 -218 -93 156 -125 -125 -31 -93 62 -248 -372 -124 62 31 -124 -156 -63 125 -124 93 124 155 -93 0 -186 342 -62 93 -435 -186 -217 -311 124 0 -155 -311 62 -279 -31 31 -94 -155 94 -31 -94 -218 0 -31 187 -310 -31 -156 -93 -186 93 -342 -218 -124 62 -62 -62 -155 125 -187 -311 -124 186 -31 -93 -217 124 -93 -248 -156 0 156 -217 -404 -156 -93 -186 -280 -186 -248 -466 -125 31 -62 -93 -186 62 -186 -156 -187 32 62 -125 -279 -62 93 -186 -186 -218 124 -93 31 -279 155 31 0 -93 -124 -62 -217 -342 155 -93 0 -373 -93 -62 155 -155 -155 -31 -62 -249 -31 155 -156 -62 94 -155 -63 -124 187 -218 -124 -341 186 -187 -124 -124z",
  "MA": "M-468422,-43943l-8,-2l-18,18l-21,-19l-18,-3l-10,-14l1,-20l8,-12l-8,-24l-12,-18l-11,1l-33,-50l-10,-5l3,-41l-1,-11l-15,-22l-18,-1l-27,-23l-1,-16l-34,-33l-15,2l-30,-17l-2,-17l6,-11l-33,-3l-9,-33l-17,-9l-13,34l-18,11l-18,1l-11,8l-28,-10l-15,12l-19,-5l-17,3l-14,-11l-11,3l-14,-18l-32,-5l-5,11l-19,-5l-45,-20h-46l-4,-10l-32,-3l-23,-7l-9,-21l3,-11l-27,-19l-46,-2l-16,-10l-34,-13l-13,1l-10,-10l-20,3l-9,-11l-12,2l-18,16l-7,13l9,17l-16,27l2,24l-20,-2l-3,-8l-20,8l-24,-4l-18,-17h-11l-15,14l-9,-8l-13,12l-18,9l-26,-1l-17,6l-44,22l-44,44l-9,3l-20,-5l-30,3l-15,-4l-41,6l-18,-5l-39,13l-32,-1l-22,-17l-12,10l-15,21l-11,-16l-26,-15l-24,2l-8,11l-23,-21l-9,-3l-20,13l-19,6l-24,31h-14l-17,12l-26,-1l-10,10l-18,4l-22,-4l-6,14l14,7l1,36l-23,25l-23,5l-4,16l1,39l-18,21l-14,8l-31,29l-13,19l-15,61l-6,11l1,15l-10,14h-15l-43,17l-17,37l-34,19l1,35l5,11l-11,17h-23l-14,15l-19,-2l-2,12l-17,-2l-17,14l-19,35l-13,-10l-21,3l-10,14l-16,7l1,13l12,16l-1,15l-18,8l6,32l-12,1l4,21l-12,4l-8,19l7,8l0,49l-10,30l-31,8l-10,13l-39,-1l17,40l-7,17l1,34l-20,30l-9,26l3,17l-5,24l-11,18l-21,9l-20,-6l-17,29l3,18l-4,12l-24,31l-19,-4l-11,8l-6,17l-15,13l6,7l-4,28l-10,8l-1,14l12,19l21,10l-7,13l22,19l-5,10l18,12l5,17l-12,19l-13,37l10,35l27,42l27,12l14,19l37,31l10,24l0,38l25,43l6,36l-1,78l-12,66l-27,89h-54l-120,-50l-54,-57l-27,-109l-28,-69l-88,-75l-122,-69l-41,-45l-124,-346l-363,-535l-130,-166l-13,-12l-78,-38l-45,-38l-89,-92l-30,-56l-29,-75l-18,-24l-40,-31l-42,-15l-48,-7l-130,-45l23,-53l-1,-34l-9,-26l0,-29l-14,-52l-7,-41l-14,-25l-17,-62l-17,-27l-3,-9l16,-49l-5,-31l5,-22l-7,-49l3,-39l5,-44l-2,-23l-25,-20l-19,-50l-3,-21l-7,-17l2,-39l22,-65l22,-60l10,-40l7,-14l16,-46l-1,-21l6,-20l33,-28l17,-61l35,-112l33,-49l87,-410l-17,-88l-6,-47l-3,-50l-14,-64l-3,-41l-6,-32l-2,-36l-119,-111l-43,-57l-116,-164l-18,-19l-272,-252l-18,-20l-28,-40l-33,23l2,21l-8,4l-41,-5l-56,16l-31,-15l-42,9l-23,17l-10,-3l-28,15l-16,20l-39,2l-34,5l-17,-2l-15,-11l-26,1l-51,19l-9,10l36,108l-28,11l-141,61l-50,7l-81,15l-96,41l-67,60l-30,-6l-14,23l-18,-5l-13,13l-12,34l29,30l-66,6l-22,17l-34,-5l-23,6l-18,26l-22,5l-26,22l-17,-2l-34,14l-16,-2l-26,18l-28,14l-25,6l-10,7l-40,-12l-22,11l-1,17l-16,-3l-10,6l-25,-15l-15,2l-26,12l-54,8l-19,-2l-19,-11l-25,-22l-19,-13l-31,-37l-57,-18l-20,-20l-42,-18l-39,4l-16,5l-25,1l-41,11l-17,3l-45,-5l-39,-26l-47,-21l-3,-55l4,-33l13,-43l8,-183l0,-9l-22,-164l-55,-5l-71,-18l-39,-7l-46,-3l-56,3l-152,2l-19,-1l-156,2l-38,-1l-27,-5l-96,-24l-31,-6l-102,1l-35,5l-17,-2l-44,11l-5,-3l-69,12l-25,-10l-83,18l-34,20l-81,-68l-64,-51l-164,-137l-96,128l-9,-4l-27,3l-19,-5l-42,3l-38,15h-27l-26,17l-22,-5l-12,4l-39,-10l-18,-27l-27,-34l-1,-7l18,-24l-20,-14l-32,4l-26,-11l-19,-1l-45,38l2,19l-27,15l-4,12l23,21l-4,16l10,24l-12,27l21,35l-14,29l23,28l18,2l-3,20l15,10l19,4l10,14l43,16l7,27l-15,18l-25,40l6,37l-6,27l8,19l-2,16l-16,33l3,20l-9,13l1,33l-6,16l0,29l6,18l-14,37l-2,26l6,16l24,13l21,16l-1,24l9,24l24,19l23,-3l-6,26l-12,16l-1,27l-8,17l-1,34l8,20l29,20l-3,13l10,28l-3,22l7,33l-1,23l8,31l-21,22l-133,9l-30,-3l-32,10l-43,-1l-31,-12l-29,-2l1,30l-35,3l-28,-18h-38l-29,-16l-67,43l-30,-18l-31,13l-47,40l-31,-4l-26,-25l-28,10l-10,40l0,32l-22,25l-42,3l-29,-17l-38,13l-60,-24l-25,18l-93,27l-36,27l-36,6l-27,-9l-66,-85l-28,-20l-31,-5l-15,-36l-34,-60l-24,-25l-38,-52l-962,-749l-890,-693l-240,-194l12,-7l82,2l37,-20l12,-23l1,-16l29,-3l17,-7l21,3l13,9l6,12l14,10l43,15l88,-16l19,-14l17,1l22,-11h20l12,-6l13,-31l43,-8l54,-1
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)"
};

