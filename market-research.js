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
        if (searchContainer) {
            searchContainer.appendChild(errorElement);
        }
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

// Verificar controle de acesso
function checkMarketResearchAccess() {
    // Implementar verificação de acesso se necessário
    return true;
}

// Carregar histórico de pesquisas
function loadSearchHistory() {
    try {
        const history = localStorage.getItem('marketResearchHistory');
        if (history) {
            currentSearchState.searchHistory = JSON.parse(history);
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

// Adicionar ao histórico
function addToSearchHistory(query) {
    try {
        if (!currentSearchState.searchHistory.includes(query)) {
            currentSearchState.searchHistory.unshift(query);
            if (currentSearchState.searchHistory.length > 10) {
                currentSearchState.searchHistory = currentSearchState.searchHistory.slice(0, 10);
            }
            localStorage.setItem('marketResearchHistory', JSON.stringify(currentSearchState.searchHistory));
        }
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}

// Função principal de pesquisa
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
        searchButton.innerHTML = 'Pesquisar';
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

// Exibir resultados da pesquisa
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

// Atualizar seção de regiões - VERSÃO SIMPLIFICADA
function updateRegionSection(regionsData) {
    const regionContainer = document.querySelector('.region-map-container');
    if (!regionContainer) return;

    regionContainer.innerHTML = `
        <h2><i class="fas fa-map-marked-alt icon"></i> Regiões</h2>
        <div class="region-content">
            <div id="brasil-map-container" class="map-svg-container">
                <!-- O SVG do mapa será carregado aqui -->
            </div>
            <div id="tooltip" class="tooltip"></div>
            <div id="details-panel" class="details-panel"></div>
        </div>
    `;

    // Renderizar mapa do Brasil usando a versão original
    renderBrazilMapOriginal(regionsData);
}

// Renderizar Mapa do Brasil - Versão Original Simplificada
function renderBrazilMapOriginal(regionsData) {
    const mapContainer = document.getElementById("brasil-map-container");
    if (!mapContainer) return;

    // Dados de exemplo se não houver dados reais
    const sampleRegions = [
        { state: "SP", percentage: 82, searches: 25600, trend: 35 },
        { state: "RJ", percentage: 78, searches: 11800, trend: 28 },
        { state: "MG", percentage: 65, searches: 12500, trend: 22 },
        { state: "PR", percentage: 72, searches: 9200, trend: 25 },
        { state: "SC", percentage: 74, searches: 5900, trend: 24 },
        { state: "RS", percentage: 69, searches: 8700, trend: 19 },
        { state: "BA", percentage: 52, searches: 8900, trend: 15 },
        { state: "PE", percentage: 46, searches: 7100, trend: 13 },
        { state: "CE", percentage: 38, searches: 5600, trend: 7 },
        { state: "GO", percentage: 48, searches: 6700, trend: 10 },
        { state: "DF", percentage: 75, searches: 2100, trend: 20 },
        { state: "ES", percentage: 68, searches: 3400, trend: 18 },
        { state: "MT", percentage: 35, searches: 5100, trend: 6 },
        { state: "MS", percentage: 42, searches: 3800, trend: 9 },
        { state: "TO", percentage: 33, searches: 2100, trend: 5 },
        { state: "MA", percentage: 28, searches: 4200, trend: 4 },
        { state: "PI", percentage: 31, searches: 2600, trend: 1 },
        { state: "RN", percentage: 39, searches: 2400, trend: 8 },
        { state: "PB", percentage: 41, searches: 2900, trend: 11 },
        { state: "AL", percentage: 45, searches: 3200, trend: 12 },
        { state: "SE", percentage: 44, searches: 1900, trend: 14 },
        { state: "PA", percentage: 25, searches: 6800, trend: 2 },
        { state: "AM", percentage: 18, searches: 4500, trend: 8 },
        { state: "AC", percentage: 15, searches: 1250, trend: 5 },
        { state: "RO", percentage: 19, searches: 1800, trend: 3 },
        { state: "RR", percentage: 16, searches: 650, trend: -1 },
        { state: "AP", percentage: 22, searches: 890, trend: -3 }
    ];

    const dataToRender = regionsData && regionsData.length > 0 ? regionsData : sampleRegions;
    
    // Carregar o SVG do mapa do Brasil
    fetch('./brasil-map.svg')
        .then(response => response.text())
        .then(svgData => {
            mapContainer.innerHTML = svgData;
            
            // Aplicar cores aos estados baseado nos dados
            dataToRender.forEach(region => {
                const stateElement = mapContainer.querySelector(`#${region.state}`);
                if (stateElement) {
                    // Adicionar classe baseada na porcentagem
                    const colorClass = getColorClass(region.percentage);
                    stateElement.classList.add('state', colorClass);
                    
                    // Adicionar dados para tooltip
                    stateElement.setAttribute('data-name', region.state);
                    stateElement.setAttribute('data-percentage', region.percentage);
                    stateElement.setAttribute('data-searches', region.searches || 0);
                    stateElement.setAttribute('data-trend', region.trend || 0);
                }
            });
            
            setupMapTooltips(mapContainer);
        })
        .catch(error => {
            console.error('Erro ao carregar o mapa SVG:', error);
            mapContainer.innerHTML = '<div class="loading">Erro ao carregar o mapa</div>';
        });
}

// Função para obter classe de cor baseada na porcentagem
function getColorClass(percentage) {
    if (percentage < 10) return 'pessimo';
    if (percentage < 25) return 'ruim';
    if (percentage < 45) return 'fraco';
    if (percentage < 60) return 'mediano';
    if (percentage < 80) return 'bom';
    return 'excelente';
}

// Configurar tooltips do mapa
function setupMapTooltips(mapContainer) {
    const states = mapContainer.querySelectorAll('.state');
    let tooltip = null;
    
    states.forEach(state => {
        state.addEventListener('mouseenter', function(e) {
            // Criar tooltip se não existir
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'map-tooltip';
                document.body.appendChild(tooltip);
            }
            
            // Obter dados do estado
            const stateName = this.getAttribute('data-name') || this.id;
            const percentage = this.getAttribute('data-percentage') || 0;
            const searches = this.getAttribute('data-searches') || 0;
            const trend = this.getAttribute('data-trend') || 0;
            
            // Atualizar conteúdo do tooltip
            tooltip.innerHTML = `
                <strong>${stateName}</strong><br>
                Interesse: ${percentage}%<br>
                Buscas: ${searches}<br>
                Tendência: ${trend > 0 ? '+' : ''}${trend}%
            `;
            
            // Posicionar tooltip
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 10 + 'px';
            tooltip.style.display = 'block';
        });
        
        state.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.style.display = 'none';
            }
        });
        
        state.addEventListener('mousemove', function(e) {
            if (tooltip) {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 10 + 'px';
            }
        });
    });
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
        return { period: monthYear, value: Math.floor(Math.random() * 60) + 40 }; // Valores aleatórios entre 40 e 100
    });

    const dataToRender = trendsData && trendsData.length > 0 ? trendsData : sampleData;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const labels = dataToRender.map(t => t.period);
    const values = dataToRender.map(t => t.value);

    // Configurações do gráfico
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue || 1;

    // Desenhar eixos
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Desenhar linha do gráfico
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.beginPath();

    values.forEach((value, index) => {
        const x = padding + (index / (values.length - 1)) * chartWidth;
        const y = canvas.height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    // Desenhar pontos
    ctx.fillStyle = '#ff6b35';
    values.forEach((value, index) => {
        const x = padding + (index / (values.length - 1)) * chartWidth;
        const y = canvas.height - padding - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Desenhar labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
        const x = padding + (index / (labels.length - 1)) * chartWidth;
        ctx.fillText(label, x, canvas.height - 10);
    });
}

// Renderizar gráfico de renda
function renderIncomeChart(incomeData) {
    const canvas = document.getElementById("incomeChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Dados de exemplo se não houver dados reais
    const sampleIncomeData = [
        { range: "Até R$ 2k", percentage: 25 },
        { range: "R$ 2k-5k", percentage: 35 },
        { range: "R$ 5k-10k", percentage: 25 },
        { range: "Acima R$ 10k", percentage: 15 }
    ];

    const dataToRender = incomeData && incomeData.length > 0 ? incomeData : sampleIncomeData;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 30;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const maxValue = Math.max(...dataToRender.map(d => d.percentage));

    // Desenhar barras
    const barWidth = chartWidth / dataToRender.length - 10;
    dataToRender.forEach((item, index) => {
        const x = padding + index * (chartWidth / dataToRender.length) + 5;
        const barHeight = (item.percentage / maxValue) * chartHeight;
        const y = canvas.height - padding - barHeight;

        // Desenhar barra
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(x, y, barWidth, barHeight);

        // Desenhar valor
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.percentage}%`, x + barWidth / 2, y - 5);
    });
}

// Renderizar gráfico de insights de vendas
function renderSalesInsightsChart(salesData) {
    const canvas = document.getElementById("salesInsightsChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Dados de exemplo se não houver dados reais
    const sampleSalesData = [
        { category: "Vendas Online", value: 65 },
        { category: "Vendas Físicas", value: 35 }
    ];

    const dataToRender = salesData && salesData.length > 0 ? salesData : sampleSalesData;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    let currentAngle = 0;
    const colors = ['#ff6b35', '#36a2eb', '#ffcd56', '#4bc0c0'];

    dataToRender.forEach((item, index) => {
        const sliceAngle = (item.value / 100) * 2 * Math.PI;

        // Desenhar fatia
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        // Desenhar label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${item.value}%`, labelX, labelY);

        currentAngle += sliceAngle;
    });
}

// Funções de cache
function getCachedResult(query) {
    try {
        const cached = localStorage.getItem(`market_research_${query}`);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < MARKET_RESEARCH_CONFIG.cacheTimeout) {
                return data.result;
            }
        }
    } catch (error) {
        console.error('Erro ao acessar cache:', error);
    }
    return null;
}

function setCachedResult(query, result) {
    try {
        const data = {
            result: result,
            timestamp: Date.now()
        };
        localStorage.setItem(`market_research_${query}`, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar no cache:', error);
    }
}

// Função para limpar pesquisa
function clearSearch() {
    const searchInput = document.getElementById('marketSearchInput');
    const resultsContainer = document.getElementById('marketResearchResultsContainer');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.classList.remove('invalid');
    }
    
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    
    hideInputError();
    currentSearchState.currentQuery = '';
    currentSearchState.lastResults = null;
}

// Função para mostrar erro de pesquisa
function showSearchError(message) {
    const resultsContainer = document.getElementById('marketResearchResultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro na Pesquisa</h3>
                <p>${message}</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initMarketResearch();
});

// Exportar funções para uso global
window.initMarketResearch = initMarketResearch;
window.handleMarketSearch = handleMarketSearch;
window.clearSearch = clearSearch;

