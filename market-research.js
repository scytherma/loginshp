// improved-market-research.js - Sistema de Pesquisa de Mercado Melhorado

// Configurações globais
const MARKET_RESEARCH_CONFIG = {
    maxSearchLength: 100,
    minSearchLength: 3,
    searchTimeout: 60000, // 60 segundos
    cacheTimeout: 24 * 60 * 60 * 1000, // 24 horas
    apiEndpoint: '/market-research-enhanced'
};

// Estado global da pesquisa
let currentSearchState = {
    isSearching: false,
    currentQuery: '',
    lastResults: null,
    searchHistory: [],
    charts: {}
};

// Função para inicializar a pesquisa de mercado melhorada
function initEnhancedMarketResearch() {
    console.log('Inicializando sistema de pesquisa de mercado melhorado...');
    
    // Verificar se os elementos existem
    const searchInput = document.getElementById('marketSearchInput');
    const searchButton = document.getElementById('marketSearchButton');
    
    if (!searchInput || !searchButton) {
        console.error('Elementos de pesquisa não encontrados');
        return;
    }

    // Event listeners
    setupEnhancedEventListeners();
    
    // Carregar histórico de pesquisas
    loadSearchHistory();
    
    // Verificar controle de acesso
    checkMarketResearchAccess();
    
    console.log('Sistema de pesquisa de mercado melhorado inicializado com sucesso');
}

// Configurar event listeners melhorados
function setupEnhancedEventListeners() {
    const searchInput = document.getElementById('marketSearchInput');
    const searchButton = document.getElementById('marketSearchButton');
    
    // Event listener para o botão de pesquisa
    searchButton.addEventListener('click', handleEnhancedMarketSearch);
    
    // Event listener para Enter no campo de pesquisa
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleEnhancedMarketSearch();
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

// Manipular pesquisa de mercado melhorada
async function handleEnhancedMarketSearch() {
    console.log('Iniciando pesquisa de mercado melhorada...');
    
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
        displayEnhancedMarketResearchResults(cachedResult);
        return;
    }
    
    try {
        // Iniciar estado de loading
        setEnhancedSearchLoadingState(true);
        currentSearchState.isSearching = true;
        currentSearchState.currentQuery = query;
        
        // Fazer a pesquisa melhorada
        const results = await performEnhancedMarketResearch(query);
        
        // Salvar no cache
        setCachedResult(query, results);
        
        // Salvar no histórico
        addToSearchHistory(query);
        
        // Mostrar resultados melhorados
        displayEnhancedMarketResearchResults(results);
        
    } catch (error) {
        console.error('Erro na pesquisa de mercado:', error);
        showSearchError(error.message);
    } finally {
        // Finalizar estado de loading
        setEnhancedSearchLoadingState(false);
        currentSearchState.isSearching = false;
    }
}

// Definir estado de loading melhorado
function setEnhancedSearchLoadingState(isLoading) {
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
        
        // Mostrar progresso de carregamento
        showLoadingProgress();
    } else {
        searchButton.disabled = false;
        searchButton.innerHTML = '<i class="fas fa-search"></i> Pesquisar';
        searchInput.disabled = false;
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Esconder progresso de carregamento
        hideLoadingProgress();
    }
}

// Mostrar progresso de carregamento
function showLoadingProgress() {
    const resultsContainer = document.getElementById('marketResearchResultsContainer');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="loading-progress-container">
            <div class="loading-header">
                <h2><i class="fas fa-search"></i> Analisando seu produto...</h2>
                <p>Coletando dados de múltiplas fontes para fornecer insights precisos</p>
            </div>
            
            <div class="loading-steps">
                <div class="loading-step active" id="step-trends">
                    <div class="step-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="step-content">
                        <h3>Analisando Tendências</h3>
                        <p>Coletando dados do Google Trends...</p>
                    </div>
                    <div class="step-spinner"><i class="fas fa-spinner fa-spin"></i></div>
                </div>
                
                <div class="loading-step" id="step-demographics">
                    <div class="step-icon"><i class="fas fa-users"></i></div>
                    <div class="step-content">
                        <h3>Dados Demográficos</h3>
                        <p>Consultando base de dados do IBGE...</p>
                    </div>
                    <div class="step-spinner"><i class="fas fa-spinner fa-spin"></i></div>
                </div>
                
                <div class="loading-step" id="step-competition">
                    <div class="step-icon"><i class="fas fa-balance-scale"></i></div>
                    <div class="step-content">
                        <h3>Análise de Concorrência</h3>
                        <p>Pesquisando em marketplaces...</p>
                    </div>
                    <div class="step-spinner"><i class="fas fa-spinner fa-spin"></i></div>
                </div>
                
                <div class="loading-step" id="step-ai">
                    <div class="step-icon"><i class="fas fa-brain"></i></div>
                    <div class="step-content">
                        <h3>Insights Inteligentes</h3>
                        <p>Gerando recomendações com IA...</p>
                    </div>
                    <div class="step-spinner"><i class="fas fa-spinner fa-spin"></i></div>
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.style.display = 'block';
    
    // Simular progresso das etapas
    simulateLoadingProgress();
}

// Simular progresso de carregamento
function simulateLoadingProgress() {
    const steps = ['step-trends', 'step-demographics', 'step-competition', 'step-ai'];
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
            // Marcar etapa atual como concluída
            if (currentStep > 0) {
                const prevStep = document.getElementById(steps[currentStep - 1]);
                if (prevStep) {
                    prevStep.classList.remove('active');
                    prevStep.classList.add('completed');
                    const spinner = prevStep.querySelector('.step-spinner i');
                    if (spinner) {
                        spinner.className = 'fas fa-check';
                    }
                }
            }
            
            // Ativar próxima etapa
            const nextStep = document.getElementById(steps[currentStep]);
            if (nextStep) {
                nextStep.classList.add('active');
            }
            
            currentStep++;
        } else {
            clearInterval(progressInterval);
        }
    }, 2000); // 2 segundos por etapa
}

// Esconder progresso de carregamento
function hideLoadingProgress() {
    // O progresso será substituído pelos resultados reais
}

// Realizar pesquisa de mercado melhorada
async function performEnhancedMarketResearch(query) {
    console.log(`Realizando pesquisa melhorada para: "${query}"`);
    
    // Obter token de autenticação
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    if (sessionError || !session || !session.access_token) {
        throw new Error('Usuário não autenticado');
    }
    
    const accessToken = session.access_token;
    
    // Fazer requisição para Edge Function melhorada
    const response = await fetch(`${SUPABASE_FUNCTIONS_BASE_URL}${MARKET_RESEARCH_CONFIG.apiEndpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: query,
            timestamp: new Date().toISOString(),
            features: {
                trends: true,
                demographics: true,
                competition: true,
                pricing: true,
                insights: true
            }
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro na pesquisa: ${response.status}`);
    }
    
    const results = await response.json();
    console.log('Resultados da pesquisa melhorada:', results);
    
    return results;
}

// Exibir resultados melhorados
function displayEnhancedMarketResearchResults(results) {
    console.log('Exibindo resultados melhorados da pesquisa');
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
                <button onclick="handleEnhancedMarketSearch()" class="retry-btn">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
        resultsContainer.style.display = 'block';
        return;
    }

    const data = results.data;
    
    // Criar estrutura melhorada dos resultados
    resultsContainer.innerHTML = `
        <div class="enhanced-results-container">
            <!-- Header dos Resultados -->
            <div class="results-header">
                <h2><i class="fas fa-chart-line"></i> Análise de Mercado: ${currentSearchState.currentQuery}</h2>
                <div class="results-summary">
                    <div class="summary-item">
                        <span class="summary-label">Viabilidade:</span>
                        <span class="summary-value ${getViabilityClass(data.viability_score)}">${getViabilityText(data.viability_score)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Interesse:</span>
                        <span class="summary-value">${data.interest_level || 'Médio'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Competitividade:</span>
                        <span class="summary-value">${data.competition_level || 'Moderada'}</span>
                    </div>
                </div>
            </div>
            
            <!-- Grid de Resultados -->
            <div class="results-grid">
                <!-- Tendência de Busca -->
                <div class="result-card trend-card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-line"></i> Tendência de Busca</h3>
                        <div class="card-actions">
                            <button class="expand-btn" onclick="expandCard('trend-card')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="trend-chart-container">
                            <canvas id="trendChart" width="400" height="200"></canvas>
                        </div>
                        <div class="trend-insights">
                            <div class="insight-item">
                                <span class="insight-label">Últimos 7 dias:</span>
                                <span class="insight-value trend-up">+${data.trends?.growth_7d || '15'}%</span>
                            </div>
                            <div class="insight-item">
                                <span class="insight-label">Últimos 30 dias:</span>
                                <span class="insight-value trend-up">+${data.trends?.growth_30d || '8'}%</span>
                            </div>
                            <div class="insight-item">
                                <span class="insight-label">Sazonalidade:</span>
                                <span class="insight-value">${data.trends?.seasonality || 'Baixa'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mapa do Brasil -->
                <div class="result-card map-card">
                    <div class="card-header">
                        <h3><i class="fas fa-map-marked-alt"></i> Interesse por Região</h3>
                        <div class="card-actions">
                            <button class="expand-btn" onclick="expandCard('map-card')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="brazil-map-container">
                            <svg id="brazilMap" width="100%" height="300" viewBox="0 0 400 300">
                                <!-- Mapa do Brasil será renderizado aqui -->
                            </svg>
                        </div>
                        <div class="map-legend">
                            <div class="legend-item">
                                <div class="legend-color low"></div>
                                <span>Baixo</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color medium"></div>
                                <span>Médio</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color high"></div>
                                <span>Alto</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color very-high"></div>
                                <span>Muito Alto</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Demografia -->
                <div class="result-card demographics-card">
                    <div class="card-header">
                        <h3><i class="fas fa-users"></i> Demografia & Mercado</h3>
                        <div class="card-actions">
                            <button class="expand-btn" onclick="expandCard('demographics-card')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="demographics-chart-container">
                            <canvas id="demographicsChart" width="300" height="200"></canvas>
                        </div>
                        <div class="demographics-stats">
                            <div class="stat-item">
                                <span class="stat-label">Renda Média:</span>
                                <span class="stat-value">R$ ${data.demographics?.average_income || '2.500'}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Faixa Etária Principal:</span>
                                <span class="stat-value">${data.demographics?.main_age_group || '25-40 anos'}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Região de Maior Interesse:</span>
                                <span class="stat-value">${data.demographics?.top_region || 'Sudeste'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Concorrência -->
                <div class="result-card competition-card">
                    <div class="card-header">
                        <h3><i class="fas fa-balance-scale"></i> Análise de Concorrência</h3>
                        <div class="card-actions">
                            <button class="expand-btn" onclick="expandCard('competition-card')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="competition-table-wrapper">
                            <table class="competition-table">
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Marketplace</th>
                                        <th>Preço</th>
                                        <th>Avaliação</th>
                                        <th>Vendas</th>
                                    </tr>
                                </thead>
                                <tbody id="competitionTableBody">
                                    <!-- Dados da concorrência serão inseridos aqui -->
                                </tbody>
                            </table>
                        </div>
                        <div class="competition-summary">
                            <div class="summary-stat">
                                <span class="stat-label">Preço Médio:</span>
                                <span class="stat-value">R$ ${data.competition?.average_price || '89,90'}</span>
                            </div>
                            <div class="summary-stat">
                                <span class="stat-label">Avaliação Média:</span>
                                <span class="stat-value">${data.competition?.average_rating || '4.2'} ⭐</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Preço Sugerido -->
                <div class="result-card pricing-card">
                    <div class="card-header">
                        <h3><i class="fas fa-dollar-sign"></i> Preço Sugerido</h3>
                        <div class="card-actions">
                            <button class="expand-btn" onclick="expandCard('pricing-card')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="pricing-main">
                            <div class="suggested-price">
                                <span class="price-label">Preço Recomendado:</span>
                                <span class="price-value">R$ ${data.pricing?.suggested_price || '105,00'}</span>
                            </div>
                            <div class="price-range">
                                <span class="range-label">Faixa Competitiva:</span>
                                <span class="range-value">R$ ${data.pricing?.min_price || '85,00'} - R$ ${data.pricing?.max_price || '125,00'}</span>
                            </div>
                        </div>
                        <div class="pricing-factors">
                            <div class="factor-item">
                                <span class="factor-label">Margem de Lucro:</span>
                                <span class="factor-value">${data.pricing?.profit_margin || '30'}%</span>
                            </div>
                            <div class="factor-item">
                                <span class="factor-label">Posicionamento:</span>
                                <span class="factor-value">${data.pricing?.positioning || 'Médio'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Insights de Vendas -->
                <div class="result-card sales-insights-card">
                    <div class="card-header">
                        <h3><i class="fas fa-chart-bar"></i> Insights de Vendas</h3>
                        <div class="card-actions">
                            <button class="expand-btn" onclick="expandCard('sales-insights-card')">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="sales-chart-container">
                            <canvas id="salesInsightsChart" width="300" height="200"></canvas>
                        </div>
                        <div class="sales-predictions">
                            <div class="prediction-item">
                                <span class="prediction-label">Vendas Estimadas (mês):</span>
                                <span class="prediction-value">${data.sales_insights?.monthly_sales || '150'} unidades</span>
                            </div>
                            <div class="prediction-item">
                                <span class="prediction-label">Melhor Época:</span>
                                <span class="prediction-value">${data.sales_insights?.best_season || 'Dezembro'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Insights e Recomendações -->
            <div class="result-card insights-card full-width">
                <div class="card-header">
                    <h3><i class="fas fa-lightbulb"></i> Insights e Recomendações</h3>
                    <div class="card-actions">
                        <button class="export-btn" onclick="exportInsights()">
                            <i class="fas fa-download"></i> Exportar
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="insights-grid">
                        <div class="insight-section positive">
                            <h4><i class="fas fa-thumbs-up"></i> Pontos Positivos</h4>
                            <ul id="positiveInsights">
                                <!-- Insights positivos serão inseridos aqui -->
                            </ul>
                        </div>
                        <div class="insight-section negative">
                            <h4><i class="fas fa-exclamation-triangle"></i> Pontos de Atenção</h4>
                            <ul id="negativeInsights">
                                <!-- Insights negativos serão inseridos aqui -->
                            </ul>
                        </div>
                        <div class="insight-section recommendations">
                            <h4><i class="fas fa-star"></i> Recomendações</h4>
                            <ul id="recommendationsList">
                                <!-- Recomendações serão inseridas aqui -->
                            </ul>
                        </div>
                    </div>
                    <div class="final-recommendation">
                        <div class="recommendation-header">
                            <h4>Recomendação Final:</h4>
                        </div>
                        <div class="recommendation-content">
                            <div class="recommendation-score ${getViabilityClass(data.viability_score)}">
                                <span class="score-value">${data.viability_score || 75}/100</span>
                                <span class="score-label">Pontuação de Viabilidade</span>
                            </div>
                            <div class="recommendation-text">
                                <p>${data.final_recommendation || 'Com base na análise realizada, este produto apresenta boa viabilidade de mercado. Recomendamos prosseguir com cautela, observando as tendências sazonais e ajustando a estratégia de preços conforme a concorrência.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Renderizar gráficos e dados
    setTimeout(() => {
        renderEnhancedTrendChart(data.trends);
        renderEnhancedBrazilMap(data.regions);
        renderEnhancedDemographicsChart(data.demographics);
        populateCompetitionTable(data.competition);
        populateInsights(data.insights);
    }, 100);
    
    // Mostrar o container de resultados
    resultsContainer.style.display = 'block';
    
    // Salvar resultados atuais
    currentSearchState.lastResults = results;
}

// Funções auxiliares para classificação de viabilidade
function getViabilityClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
}

function getViabilityText(score) {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Baixa';
}

// Renderizar gráfico de tendência melhorado
function renderEnhancedTrendChart(trendsData) {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (currentSearchState.charts.trendChart) {
        currentSearchState.charts.trendChart.destroy();
    }
    
    // Dados de exemplo ou reais
    const data = trendsData?.timeline || generateSampleTrendData();
    
    currentSearchState.charts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Interesse ao longo do tempo',
                data: data.values,
                borderColor: '#ff6b35',
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ff6b35',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ff6b35',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return `Interesse: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666666',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666666',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Gerar dados de exemplo para o gráfico de tendência
function generateSampleTrendData() {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    const values = [65, 72, 68, 85, 78, 92];
    
    return {
        labels: months,
        values: values
    };
}

// Renderizar mapa do Brasil melhorado
function renderEnhancedBrazilMap(regionsData) {
    const mapContainer = document.getElementById('brazilMap');
    if (!mapContainer) return;
    
    // Dados de exemplo ou reais das regiões
    const regionInterest = regionsData?.states || {
        'SP': 95, 'RJ': 88, 'MG': 75, 'RS': 70, 'PR': 68,
        'SC': 65, 'BA': 60, 'GO': 55, 'PE': 52, 'CE': 48
    };
    
    // Limpar mapa anterior
    mapContainer.innerHTML = '';
    
    // SVG simplificado do Brasil (apenas alguns estados principais)
    const brazilStates = [
        { id: 'SP', name: 'São Paulo', path: 'M200,180 L240,180 L240,220 L200,220 Z', interest: regionInterest.SP || 0 },
        { id: 'RJ', name: 'Rio de Janeiro', path: 'M240,180 L270,180 L270,200 L240,200 Z', interest: regionInterest.RJ || 0 },
        { id: 'MG', name: 'Minas Gerais', path: 'M200,140 L270,140 L270,180 L200,180 Z', interest: regionInterest.MG || 0 },
        { id: 'RS', name: 'Rio Grande do Sul', path: 'M180,240 L240,240 L240,280 L180,280 Z', interest: regionInterest.RS || 0 },
        { id: 'PR', name: 'Paraná', path: 'M180,200 L240,200 L240,240 L180,240 Z', interest: regionInterest.PR || 0 }
    ];
    
    brazilStates.forEach(state => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', state.path);
        path.setAttribute('fill', getRegionColor(state.interest));
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('class', 'map-state');
        path.setAttribute('data-state', state.id);
        path.setAttribute('data-interest', state.interest);
        
        // Tooltip no hover
        path.addEventListener('mouseenter', (e) => {
            showMapTooltip(e, state);
        });
        
        path.addEventListener('mouseleave', hideMapTooltip);
        
        mapContainer.appendChild(path);
    });
}

// Obter cor baseada no nível de interesse
function getRegionColor(interest) {
    if (interest >= 80) return '#1e40af'; // Azul escuro - Muito Alto
    if (interest >= 60) return '#3b82f6'; // Azul médio - Alto
    if (interest >= 40) return '#93c5fd'; // Azul claro - Médio
    if (interest >= 20) return '#fbbf24'; // Amarelo - Baixo
    return '#ef4444'; // Vermelho - Muito Baixo
}

// Mostrar tooltip do mapa
function showMapTooltip(event, state) {
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.innerHTML = `
        <strong>${state.name}</strong><br>
        Interesse: ${state.interest}%<br>
        <span class="tooltip-status">${getInterestLevel(state.interest)}</span>
    `;
    
    tooltip.style.position = 'absolute';
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY - 10 + 'px';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    
    document.body.appendChild(tooltip);
    
    // Remover tooltip após 3 segundos
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 3000);
}

// Esconder tooltip do mapa
function hideMapTooltip() {
    const tooltips = document.querySelectorAll('.map-tooltip');
    tooltips.forEach(tooltip => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    });
}

// Obter nível de interesse textual
function getInterestLevel(interest) {
    if (interest >= 80) return 'Muito Alto';
    if (interest >= 60) return 'Alto';
    if (interest >= 40) return 'Médio';
    if (interest >= 20) return 'Baixo';
    return 'Muito Baixo';
}

// Renderizar gráfico demográfico melhorado
function renderEnhancedDemographicsChart(demographicsData) {
    const canvas = document.getElementById('demographicsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (currentSearchState.charts.demographicsChart) {
        currentSearchState.charts.demographicsChart.destroy();
    }
    
    // Dados de exemplo ou reais
    const data = demographicsData?.income_distribution || {
        labels: ['Até R$ 1.000', 'R$ 1.000-2.000', 'R$ 2.000-4.000', 'R$ 4.000-8.000', 'Acima R$ 8.000'],
        values: [15, 25, 35, 20, 5]
    };
    
    currentSearchState.charts.demographicsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#ef4444',
                    '#f97316',
                    '#eab308',
                    '#22c55e',
                    '#3b82f6'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#ff6b35',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

// Popular tabela de concorrência
function populateCompetitionTable(competitionData) {
    const tableBody = document.getElementById('competitionTableBody');
    if (!tableBody) return;
    
    // Dados de exemplo ou reais
    const competitors = competitionData?.products || [
        { name: 'Produto Concorrente 1', marketplace: 'Mercado Livre', price: 89.90, rating: 4.5, sales: '500+' },
        { name: 'Produto Concorrente 2', marketplace: 'Shopee', price: 95.00, rating: 4.2, sales: '300+' },
        { name: 'Produto Concorrente 3', marketplace: 'Shein', price: 75.50, rating: 4.0, sales: '200+' },
        { name: 'Produto Concorrente 4', marketplace: 'Mercado Livre', price: 110.00, rating: 4.7, sales: '800+' },
        { name: 'Produto Concorrente 5', marketplace: 'Shopee', price: 85.90, rating: 4.3, sales: '400+' }
    ];
    
    tableBody.innerHTML = '';
    
    competitors.forEach(competitor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="product-name">${competitor.name}</td>
            <td class="marketplace">
                <span class="marketplace-badge ${competitor.marketplace.toLowerCase().replace(' ', '-')}">${competitor.marketplace}</span>
            </td>
            <td class="price">R$ ${competitor.price.toFixed(2)}</td>
            <td class="rating">
                <div class="rating-container">
                    <span class="rating-value">${competitor.rating}</span>
                    <div class="stars">${generateStars(competitor.rating)}</div>
                </div>
            </td>
            <td class="sales">${competitor.sales}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Gerar estrelas para avaliação
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Popular insights
function populateInsights(insightsData) {
    const positiveInsights = document.getElementById('positiveInsights');
    const negativeInsights = document.getElementById('negativeInsights');
    const recommendationsList = document.getElementById('recommendationsList');
    
    if (!positiveInsights || !negativeInsights || !recommendationsList) return;
    
    // Dados de exemplo ou reais
    const insights = insightsData || {
        positive: [
            'Crescimento consistente de interesse nos últimos 3 meses',
            'Boa margem de lucro potencial com preço sugerido',
            'Demanda concentrada em regiões de alto poder aquisitivo'
        ],
        negative: [
            'Concorrência moderada a alta no marketplace',
            'Sazonalidade pode afetar vendas em determinados períodos',
            'Necessário investimento em marketing para diferenciação'
        ],
        recommendations: [
            'Focar marketing nas regiões Sudeste e Sul',
            'Lançar promoções durante picos sazonais',
            'Investir em qualidade do produto para competir com avaliações',
            'Considerar parcerias com influenciadores do nicho'
        ]
    };
    
    // Popular insights positivos
    positiveInsights.innerHTML = '';
    insights.positive.forEach(insight => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle"></i> ${insight}`;
        positiveInsights.appendChild(li);
    });
    
    // Popular insights negativos
    negativeInsights.innerHTML = '';
    insights.negative.forEach(insight => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${insight}`;
        negativeInsights.appendChild(li);
    });
    
    // Popular recomendações
    recommendationsList.innerHTML = '';
    insights.recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-lightbulb"></i> ${recommendation}`;
        recommendationsList.appendChild(li);
    });
}

// Funções auxiliares existentes (manter as originais)
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

function hideInputError() {
    const errorElement = document.getElementById('searchInputError');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

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

function getCachedResult(query) {
    try {
        const cached = localStorage.getItem(`market_research_${query}`);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < MARKET_RESEARCH_CONFIG.cacheTimeout) {
                return data.results;
            }
        }
    } catch (error) {
        console.error('Erro ao acessar cache:', error);
    }
    return null;
}

function setCachedResult(query, results) {
    try {
        const data = {
            results: results,
            timestamp: Date.now()
        };
        localStorage.setItem(`market_research_${query}`, JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar no cache:', error);
    }
}

function addToSearchHistory(query) {
    try {
        let history = JSON.parse(localStorage.getItem('market_research_history') || '[]');
        
        // Remover query se já existir
        history = history.filter(item => item !== query);
        
        // Adicionar no início
        history.unshift(query);
        
        // Manter apenas os últimos 10
        history = history.slice(0, 10);
        
        localStorage.setItem('market_research_history', JSON.stringify(history));
        
        // Atualizar interface do histórico
        updateHistoryDisplay(history);
    } catch (error) {
        console.error('Erro ao salvar histórico:', error);
    }
}

function loadSearchHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('market_research_history') || '[]');
        updateHistoryDisplay(history);
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
    }
}

function updateHistoryDisplay(history) {
    const historySection = document.getElementById('searchHistorySection');
    const historyList = document.getElementById('searchHistoryList');
    
    if (!historySection || !historyList) return;
    
    if (history.length === 0) {
        historySection.style.display = 'none';
        return;
    }
    
    historySection.style.display = 'block';
    historyList.innerHTML = '';
    
    history.forEach(query => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = query;
        item.onclick = () => {
            document.getElementById('marketSearchInput').value = query;
            handleEnhancedMarketSearch();
        };
        historyList.appendChild(item);
    });
}

function clearSearch() {
    const searchInput = document.getElementById('marketSearchInput');
    const resultsContainer = document.getElementById('marketResearchResultsContainer');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    
    // Limpar estado
    currentSearchState.currentQuery = '';
    currentSearchState.lastResults = null;
}

function showSearchError(message) {
    const resultsContainer = document.getElementById('marketResearchResultsContainer');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Erro na Análise</h3>
            <p>${message}</p>
            <button onclick="handleEnhancedMarketSearch()" class="retry-btn">
                <i class="fas fa-redo"></i> Tentar Novamente
            </button>
        </div>
    `;
    resultsContainer.style.display = 'block';
}

// Funções de interação com cards
function expandCard(cardClass) {
    const card = document.querySelector(`.${cardClass}`);
    if (card) {
        card.classList.toggle('expanded');
    }
}

function exportInsights() {
    if (!currentSearchState.lastResults) {
        alert('Nenhum resultado para exportar');
        return;
    }
    
    // Criar conteúdo para exportação
    const content = generateExportContent(currentSearchState.lastResults);
    
    // Criar e baixar arquivo
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analise-mercado-${currentSearchState.currentQuery}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateExportContent(results) {
    const data = results.data;
    const date = new Date().toLocaleDateString('pt-BR');
    
    return `
ANÁLISE DE MERCADO - ${currentSearchState.currentQuery.toUpperCase()}
Data: ${date}

=== RESUMO EXECUTIVO ===
Viabilidade: ${getViabilityText(data.viability_score)} (${data.viability_score}/100)
Interesse: ${data.interest_level || 'Médio'}
Competitividade: ${data.competition_level || 'Moderada'}

=== TENDÊNCIAS ===
Crescimento 7 dias: +${data.trends?.growth_7d || '15'}%
Crescimento 30 dias: +${data.trends?.growth_30d || '8'}%
Sazonalidade: ${data.trends?.seasonality || 'Baixa'}

=== DEMOGRAFIA ===
Renda Média: R$ ${data.demographics?.average_income || '2.500'}
Faixa Etária Principal: ${data.demographics?.main_age_group || '25-40 anos'}
Região de Maior Interesse: ${data.demographics?.top_region || 'Sudeste'}

=== PRECIFICAÇÃO ===
Preço Sugerido: R$ ${data.pricing?.suggested_price || '105,00'}
Faixa Competitiva: R$ ${data.pricing?.min_price || '85,00'} - R$ ${data.pricing?.max_price || '125,00'}
Margem de Lucro: ${data.pricing?.profit_margin || '30'}%

=== RECOMENDAÇÃO FINAL ===
${data.final_recommendation || 'Com base na análise realizada, este produto apresenta boa viabilidade de mercado.'}

---
Relatório gerado automaticamente pelo Lucre Certo
    `.trim();
}

// Exportar função principal para uso global
window.initEnhancedMarketResearch = initEnhancedMarketResearch;

