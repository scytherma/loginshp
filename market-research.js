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
        errorElement.className = 'input-error';
        const searchInput = document.getElementById('marketSearchInput');
        searchInput.parentNode.insertBefore(errorElement, searchInput.nextSibling);
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

    const response = await fetch('https://api.lucrecerto.com/market-research', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
            query: query,
            user_id: session.user.id
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na pesquisa');
    }

    return await response.json();
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

// Atualizar seção de regiões - VERSÃO MELHORADA
function updateRegionSection(regionsData) {
    const regionContainer = document.querySelector('.region-map-container');
    if (!regionContainer) return;

    regionContainer.innerHTML = `
        <h2><i class="fas fa-map-marked-alt icon"></i> Regiões</h2>
        <div class="region-content">
            <div id="brazilMapContainer">
                <!-- O mapa será carregado aqui -->
            </div>
        </div>
    `;

    // Renderizar mapa do Brasil MELHORADO
    renderBrazilMapImproved(regionsData);
}

// NOVA FUNÇÃO: Renderizar Mapa do Brasil Melhorado
function renderBrazilMapImproved(regionsData) {
    const mapContainer = document.getElementById("brazilMapContainer");
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
    
    // Carregar o SVG melhorado do mapa do Brasil
    fetch('./brasil-map-github.svg')
        .then(response => response.text())
        .then(svgData => {
            mapContainer.innerHTML = svgData;
            
            // Configurar responsividade
            const svg = mapContainer.querySelector('svg');
            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', 'auto');
                svg.style.maxWidth = '100%';
                svg.style.height = 'auto';
            }
            
            // Aplicar cores aos estados baseado nos dados
            dataToRender.forEach(region => {
                const stateElement = mapContainer.querySelector(`#${region.state}`);
                if (stateElement) {
                    // Remover classes de cor anteriores
                    stateElement.classList.remove('pessimo', 'ruim', 'fraco', 'mediano', 'bom', 'excelente');
                    
                    // Adicionar nova classe baseada na porcentagem
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
            console.error('Erro ao carregar o mapa SVG melhorado:', error);
            // Fallback para o mapa original se o melhorado não carregar
            renderBrazilMapOriginal(dataToRender);
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
            const percentage = this.getAttribute('data-percentage') || '0';
            const searches = this.getAttribute('data-searches') || '0';
            const trend = this.getAttribute('data-trend') || '0';
            
            // Atualizar conteúdo do tooltip
            tooltip.innerHTML = `
                <div class="state-name">${stateName}</div>
                <div class="state-data">Interesse: ${percentage}%</div>
                <div class="state-data">Buscas: ${parseInt(searches).toLocaleString('pt-BR')}</div>
                <div class="state-data">Tendência: ${trend > 0 ? '+' : ''}${trend}%</div>
            `;
            
            // Mostrar tooltip
            tooltip.style.display = 'block';
            
            // Destacar estado
            this.style.strokeWidth = '3';
            this.style.filter = 'brightness(1.1)';
        });
        
        state.addEventListener('mousemove', function(e) {
            if (tooltip) {
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY - 10) + 'px';
            }
        });
        
        state.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.style.display = 'none';
            }
            
            // Remover destaque
            this.style.strokeWidth = '';
            this.style.filter = '';
        });
        
        // Suporte para touch em dispositivos móveis
        state.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.dispatchEvent(new Event('mouseenter'));
        });
        
        state.addEventListener('touchend', function(e) {
            e.preventDefault();
            setTimeout(() => {
                this.dispatchEvent(new Event('mouseleave'));
            }, 3000);
        });
    });
}

// Manter função original como fallback
function renderBrazilMapOriginal(regionsData) {
    const mapContainer = document.getElementById("brazilMapContainer");
    if (!mapContainer) return;

    const dataToRender = regionsData;

    // SVG simplificado do mapa do Brasil (versão original)
    mapContainer.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 500 500">
            <!-- Exemplo de alguns estados com caminhos simplificados -->
            <path d="M200,200 L250,200 L250,250 L200,250 Z" id="state-sp" data-state="São Paulo" data-percentage="${dataToRender.find(r => r.state === 'SP')?.percentage || 0}%" fill="#ff6b35" class="state-path"></path>
            <path d="M250,200 L300,200 L300,250 L250,250 Z" id="state-rj" data-state="Rio de Janeiro" data-percentage="${dataToRender.find(r => r.state === 'RJ')?.percentage || 0}%" fill="#ff8c5a" class="state-path"></path>
            <path d="M150,150 L200,150 L200,200 L150,200 Z" id="state-mg" data-state="Minas Gerais" data-percentage="${dataToRender.find(r => r.state === 'MG')?.percentage || 0}%" fill="#ffad7f" class="state-path"></path>
            <path d="M100,250 L150,250 L150,300 L100,300 Z" id="state-rs" data-state="Rio Grande do Sul" data-percentage="${dataToRender.find(r => r.state === 'RS')?.percentage || 0}%" fill="#ffce9f" class="state-path"></path>
            <path d="M150,250 L200,250 L200,300 L150,300 Z" id="state-pr" data-state="Paraná" data-percentage="${dataToRender.find(r => r.state === 'PR')?.percentage || 0}%" fill="#ffefbf" class="state-path"></path>
            <path d="M300,100 L350,100 L350,150 L300,150 Z" id="state-ba" data-state="Bahia" data-percentage="${dataToRender.find(r => r.state === 'BA')?.percentage || 0}%" fill="#ff6b35" class="state-path"></path>
            <path d="M350,100 L400,100 L400,150 L350,150 Z" id="state-pe" data-state="Pernambuco" data-percentage="${dataToRender.find(r => r.state === 'PE')?.percentage || 0}%" fill="#ff8c5a" class="state-path"></path>
            <path d="M400,100 L450,100 L450,150 L400,150 Z" id="state-ce" data-state="Ceará" data-percentage="${dataToRender.find(r => r.state === 'CE')?.percentage || 0}%" fill="#ffad7f" class="state-path"></path>
            <path d="M100,50 L150,50 L150,100 L100,100 Z" id="state-am" data-state="Amazonas" data-percentage="${dataToRender.find(r => r.state === 'AM')?.percentage || 0}%" fill="#ffce9f" class="state-path"></path>
            <path d="M250,150 L300,150 L300,200 L250,200 Z" id="state-df" data-state="Distrito Federal" data-percentage="${dataToRender.find(r => r.state === 'DF')?.percentage || 0}%" fill="#ffefbf" class="state-path"></path>
        </svg>
        <div id="mapTooltip" class="map-tooltip"></div>
    `;

    const statePaths = mapContainer.querySelectorAll(".state-path");
    const tooltip = document.getElementById("mapTooltip");

    statePaths.forEach(path => {
        path.addEventListener("mouseenter", (e) => {
            const state = e.target.getAttribute("data-state");
            const percentage = e.target.getAttribute("data-percentage");
            tooltip.innerHTML = `<strong>${state}</strong><br>Interesse: ${percentage}`;
            tooltip.style.display = "block";
        });

        path.addEventListener("mousemove", (e) => {
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY - 10 + "px";
        });

        path.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
}

// Continuar com as outras funções originais...
function updateDemographySection(demographicsData) {
    const demoContainer = document.querySelector('.demographics-chart-container');
    if (!demoContainer) return;

    demoContainer.innerHTML = `
        <h2><i class="fas fa-users icon"></i> Demografia & Mercado</h2>
        <div class="demographics-content">
            <p>Análise demográfica do público-alvo</p>
            <canvas id="demographicsChart" width="400" height="200"></canvas>
        </div>
    `;

    renderDemographicsChart(demographicsData);
}

function updateCompetitionSection(competitionData) {
    const compContainer = document.querySelector('.competition-table-container');
    if (!compContainer) return;

    compContainer.innerHTML = `
        <h2><i class="fas fa-balance-scale icon"></i> Concorrência</h2>
        <div class="competition-content">
            <p>Análise da concorrência</p>
            <div id="competitionTable">
                <table class="competition-table">
                    <thead>
                        <tr>
                            <th>Concorrente</th>
                            <th>Preço Médio</th>
                            <th>Avaliação</th>
                            <th>Volume</th>
                        </tr>
                    </thead>
                    <tbody id="competitionTableBody">
                        <!-- Dados serão inseridos aqui -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    renderCompetitionTable(competitionData);
}

function updateSuggestedPriceSection(priceData) {
    const priceContainer = document.querySelector('.suggested-price-container');
    if (!priceContainer) return;

    priceContainer.innerHTML = `
        <h2><i class="fas fa-dollar-sign icon"></i> Preço Sugerido</h2>
        <div class="price-content">
            <p>Análise de precificação</p>
            <div class="price-suggestion">
                <div class="price-range">
                    <span class="price-label">Faixa Recomendada:</span>
                    <span class="price-value">R$ 50,00 - R$ 80,00</span>
                </div>
                <div class="price-optimal">
                    <span class="price-label">Preço Ótimo:</span>
                    <span class="price-value optimal">R$ 65,00</span>
                </div>
            </div>
        </div>
    `;
}

function updateSalesInsightsSection(salesData) {
    const salesContainer = document.querySelector('.sales-insights-container');
    if (!salesContainer) return;

    salesContainer.innerHTML = `
        <h2><i class="fas fa-chart-bar icon"></i> Insights de Vendas</h2>
        <div class="sales-content">
            <p>Análise de potencial de vendas</p>
            <canvas id="salesChart" width="400" height="200"></canvas>
        </div>
    `;

    renderSalesChart(salesData);
}

function updateInsightsRecommendationsSection(insightsData) {
    const insightsContainer = document.querySelector('.insights-recommendations-container');
    if (!insightsContainer) return;

    insightsContainer.innerHTML = `
        <h2><i class="fas fa-lightbulb icon"></i> Insights e Recomendações</h2>
        <div class="insights-content">
            <div class="recommendations-list">
                <div class="recommendation-item">
                    <i class="fas fa-check-circle"></i>
                    <span>Produto com alta demanda na região Sudeste</span>
                </div>
                <div class="recommendation-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Concorrência moderada - oportunidade de entrada</span>
                </div>
                <div class="recommendation-item">
                    <i class="fas fa-trending-up"></i>
                    <span>Tendência de crescimento nos próximos 3 meses</span>
                </div>
            </div>
        </div>
    `;
}

// Funções de renderização de gráficos (placeholder)
function renderTrendChart(data) {
    // Implementar gráfico de tendência
    console.log('Renderizando gráfico de tendência:', data);
}

function renderDemographicsChart(data) {
    // Implementar gráfico demográfico
    console.log('Renderizando gráfico demográfico:', data);
}

function renderCompetitionTable(data) {
    // Implementar tabela de concorrência
    console.log('Renderizando tabela de concorrência:', data);
}

function renderSalesChart(data) {
    // Implementar gráfico de vendas
    console.log('Renderizando gráfico de vendas:', data);
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
        console.error('Erro ao ler cache:', error);
    }
    return null;
}

function setCachedResult(query, result) {
    try {
        const cacheData = {
            result: result,
            timestamp: Date.now()
        };
        localStorage.setItem(`market_research_${query}`, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Erro ao salvar cache:', error);
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

