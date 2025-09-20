// chart-implementations.js - Implementações específicas dos gráficos para pesquisa de mercado

// Configurações globais do Chart.js
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#64748b';

// Paleta de cores consistente
const CHART_COLORS = {
    primary: '#ff6b35',
    secondary: '#1e40af',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    gradient: {
        primary: 'rgba(255, 107, 53, 0.1)',
        secondary: 'rgba(30, 64, 175, 0.1)',
        success: 'rgba(34, 197, 94, 0.1)',
    }
};

// Classe para gerenciar gráficos
class MarketResearchCharts {
    constructor() {
        this.charts = {};
        this.initializeChartDefaults();
    }

    // Configurar padrões globais
    initializeChartDefaults() {
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
        Chart.defaults.plugins.tooltip.bodyColor = '#ffffff';
        Chart.defaults.plugins.tooltip.borderColor = CHART_COLORS.primary;
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
        Chart.defaults.plugins.tooltip.displayColors = false;
    }

    // Renderizar gráfico de tendências
    renderTrendChart(canvasId, trendsData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas ${canvasId} não encontrado`);
            return null;
        }

        // Destruir gráfico anterior se existir
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Dados padrão se não fornecidos
        const data = trendsData?.timeline || this.generateSampleTrendData();
        
        // Criar gradiente
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, CHART_COLORS.gradient.primary);
        gradient.addColorStop(1, 'rgba(255, 107, 53, 0.01)');

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Interesse (%)',
                    data: data.values,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: CHART_COLORS.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: CHART_COLORS.primary,
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
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
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `Interesse: ${context.parsed.y}%`;
                            },
                            afterLabel: function(context) {
                                const value = context.parsed.y;
                                if (value >= 80) return '🔥 Muito Alto';
                                if (value >= 60) return '📈 Alto';
                                if (value >= 40) return '📊 Médio';
                                return '📉 Baixo';
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
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return value + '%';
                            },
                            stepSize: 20
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    point: {
                        hoverRadius: 8
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });

        return this.charts[canvasId];
    }

    // Renderizar gráfico demográfico (renda)
    renderDemographicsChart(canvasId, demographicsData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas ${canvasId} não encontrado`);
            return null;
        }

        // Destruir gráfico anterior se existir
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Dados padrão se não fornecidos
        const data = demographicsData?.income_distribution || this.generateSampleDemographicsData();
        
        // Cores para cada segmento
        const colors = [
            '#ef4444', // Vermelho - Baixa renda
            '#f97316', // Laranja - Renda baixa-média
            '#eab308', // Amarelo - Renda média
            '#22c55e', // Verde - Renda média-alta
            '#3b82f6'  // Azul - Alta renda
        ];

        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: colors,
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 4,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#64748b'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${percentage}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                elements: {
                    arc: {
                        hoverBackgroundColor: function(context) {
                            const color = context.element.options.backgroundColor;
                            return Chart.helpers.color(color).alpha(0.8).rgbString();
                        }
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Renderizar gráfico de insights de vendas
    renderSalesInsightsChart(canvasId, salesData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas ${canvasId} não encontrado`);
            return null;
        }

        // Destruir gráfico anterior se existir
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Dados padrão se não fornecidos
        const data = salesData || this.generateSampleSalesData();
        
        // Criar gradientes para as barras
        const gradient1 = ctx.createLinearGradient(0, 0, 0, 200);
        gradient1.addColorStop(0, CHART_COLORS.primary);
        gradient1.addColorStop(1, CHART_COLORS.gradient.primary);

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 200);
        gradient2.addColorStop(0, CHART_COLORS.secondary);
        gradient2.addColorStop(1, CHART_COLORS.gradient.secondary);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Vendas Estimadas',
                    data: data.sales,
                    backgroundColor: gradient1,
                    borderColor: CHART_COLORS.primary,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }, {
                    label: 'Potencial de Mercado',
                    data: data.potential,
                    backgroundColor: gradient2,
                    borderColor: CHART_COLORS.secondary,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                const label = context.dataset.label;
                                const value = context.parsed.y;
                                return `${label}: ${value} unidades`;
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
                            color: '#94a3b8',
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return value + ' un';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                elements: {
                    bar: {
                        borderRadius: 8
                    }
                }
            }
        });

        return this.charts[canvasId];
    }

    // Renderizar gráfico de comparação de preços
    renderPriceComparisonChart(canvasId, competitionData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas ${canvasId} não encontrado`);
            return null;
        }

        // Destruir gráfico anterior se existir
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        const ctx = canvas.getContext('2d');
        
        // Dados padrão se não fornecidos
        const data = competitionData || this.generateSampleCompetitionData();
        
        // Cores baseadas no marketplace
        const colors = data.labels.map(label => {
            if (label.includes('Mercado Livre')) return '#ffe135';
            if (label.includes('Shopee')) return '#ee4d2d';
            if (label.includes('Shein')) return '#000000';
            return CHART_COLORS.info;
        });

        this.charts[canvasId] = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Preço (R$)',
                    data: data.prices,
                    backgroundColor: colors.map(color => Chart.helpers.color(color).alpha(0.7).rgbString()),
                    borderColor: colors,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `Preço: R$ ${context.parsed.x.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(0);
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                size: 10,
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });

        return this.charts[canvasId];
    }

    // Gerar dados de exemplo para tendências
    generateSampleTrendData() {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const baseValue = 60;
        const values = months.map((_, index) => {
            const trend = index * 5; // Tendência crescente
            const noise = (Math.random() - 0.5) * 10; // Ruído
            return Math.max(0, Math.min(100, baseValue + trend + noise));
        });
        
        return {
            labels: months,
            values: values
        };
    }

    // Gerar dados de exemplo para demografia
    generateSampleDemographicsData() {
        return {
            labels: ['Até R$ 1.000', 'R$ 1.000-2.000', 'R$ 2.000-4.000', 'R$ 4.000-8.000', 'Acima R$ 8.000'],
            values: [15, 25, 35, 20, 5]
        };
    }

    // Gerar dados de exemplo para vendas
    generateSampleSalesData() {
        return {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            sales: [120, 135, 150, 180, 165, 200],
            potential: [200, 220, 240, 280, 260, 320]
        };
    }

    // Gerar dados de exemplo para concorrência
    generateSampleCompetitionData() {
        return {
            labels: ['Produto A (ML)', 'Produto B (Shopee)', 'Produto C (Shein)', 'Produto D (ML)', 'Produto E (Shopee)'],
            prices: [89.90, 95.00, 75.50, 110.00, 85.90]
        };
    }

    // Destruir gráfico específico
    destroyChart(canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
        }
    }

    // Destruir todos os gráficos
    destroyAllCharts() {
        Object.keys(this.charts).forEach(canvasId => {
            this.destroyChart(canvasId);
        });
    }

    // Redimensionar gráficos
    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // Atualizar dados de um gráfico
    updateChartData(canvasId, newData) {
        const chart = this.charts[canvasId];
        if (!chart) return;

        chart.data = newData;
        chart.update('active');
    }

    // Animar entrada dos gráficos
    animateChartEntrance(canvasId, delay = 0) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        canvas.style.opacity = '0';
        canvas.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            canvas.style.transition = 'all 0.6s ease-out';
            canvas.style.opacity = '1';
            canvas.style.transform = 'translateY(0)';
        }, delay);
    }

    // Configurar responsividade
    setupResponsiveCharts() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.resizeCharts();
            }, 250);
        });
    }
}

// Classe para gerenciar o mapa do Brasil
class BrazilMapRenderer {
    constructor() {
        this.mapData = this.getBrazilMapData();
        this.colorScale = this.createColorScale();
    }

    // Renderizar mapa do Brasil
    renderMap(containerId, regionData) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} não encontrado`);
            return;
        }

        // Limpar container
        container.innerHTML = '';

        // Criar SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '300');
        svg.setAttribute('viewBox', '0 0 500 400');
        svg.setAttribute('class', 'brazil-map');

        // Renderizar estados
        this.mapData.states.forEach(state => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const interest = regionData?.states?.[state.id] || 0;
            
            path.setAttribute('d', state.path);
            path.setAttribute('fill', this.getColorForValue(interest));
            path.setAttribute('stroke', '#ffffff');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('class', 'map-state');
            path.setAttribute('data-state', state.id);
            path.setAttribute('data-name', state.name);
            path.setAttribute('data-interest', interest);
            
            // Eventos de hover
            path.addEventListener('mouseenter', (e) => this.showTooltip(e, state, interest));
            path.addEventListener('mouseleave', () => this.hideTooltip());
            path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
            
            svg.appendChild(path);
        });

        container.appendChild(svg);
        
        // Animar entrada
        this.animateMapEntrance(svg);
    }

    // Obter cor baseada no valor
    getColorForValue(value) {
        if (value >= 80) return '#1e40af'; // Azul escuro - Muito Alto
        if (value >= 60) return '#3b82f6'; // Azul médio - Alto  
        if (value >= 40) return '#93c5fd'; // Azul claro - Médio
        if (value >= 20) return '#fbbf24'; // Amarelo - Baixo
        return '#ef4444'; // Vermelho - Muito Baixo
    }

    // Mostrar tooltip
    showTooltip(event, state, interest) {
        this.hideTooltip(); // Remover tooltip anterior
        
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-header">${state.name}</div>
            <div class="tooltip-content">
                <div class="tooltip-row">
                    <span class="tooltip-label">Interesse:</span>
                    <span class="tooltip-value">${interest}%</span>
                </div>
                <div class="tooltip-status ${this.getStatusClass(interest)}">
                    ${this.getStatusText(interest)}
                </div>
            </div>
        `;
        
        this.positionTooltip(tooltip, event);
        document.body.appendChild(tooltip);
        
        // Animar entrada
        setTimeout(() => tooltip.classList.add('visible'), 10);
    }

    // Esconder tooltip
    hideTooltip() {
        const existingTooltips = document.querySelectorAll('.map-tooltip');
        existingTooltips.forEach(tooltip => {
            tooltip.classList.remove('visible');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 200);
        });
    }

    // Atualizar posição do tooltip
    updateTooltipPosition(event) {
        const tooltip = document.querySelector('.map-tooltip');
        if (tooltip) {
            this.positionTooltip(tooltip, event);
        }
    }

    // Posicionar tooltip
    positionTooltip(tooltip, event) {
        const rect = event.target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        tooltip.style.position = 'absolute';
        tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top + scrollTop - 10) + 'px';
        tooltip.style.transform = 'translate(-50%, -100%)';
        tooltip.style.zIndex = '1000';
        tooltip.style.pointerEvents = 'none';
    }

    // Obter classe de status
    getStatusClass(interest) {
        if (interest >= 80) return 'status-excellent';
        if (interest >= 60) return 'status-good';
        if (interest >= 40) return 'status-fair';
        return 'status-poor';
    }

    // Obter texto de status
    getStatusText(interest) {
        if (interest >= 80) return '🔥 Excelente';
        if (interest >= 60) return '📈 Bom';
        if (interest >= 40) return '📊 Regular';
        return '📉 Baixo';
    }

    // Animar entrada do mapa
    animateMapEntrance(svg) {
        const states = svg.querySelectorAll('.map-state');
        states.forEach((state, index) => {
            state.style.opacity = '0';
            state.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                state.style.transition = 'all 0.4s ease-out';
                state.style.opacity = '1';
                state.style.transform = 'scale(1)';
            }, index * 50);
        });
    }

    // Criar escala de cores
    createColorScale() {
        return {
            0: '#ef4444',   // Vermelho
            20: '#fbbf24',  // Amarelo
            40: '#93c5fd',  // Azul claro
            60: '#3b82f6',  // Azul médio
            80: '#1e40af'   // Azul escuro
        };
    }

    // Dados simplificados do mapa do Brasil
    getBrazilMapData() {
        return {
            states: [
                {
                    id: 'SP',
                    name: 'São Paulo',
                    path: 'M200,180 L280,180 L280,240 L200,240 Z'
                },
                {
                    id: 'RJ', 
                    name: 'Rio de Janeiro',
                    path: 'M280,180 L320,180 L320,210 L280,210 Z'
                },
                {
                    id: 'MG',
                    name: 'Minas Gerais', 
                    path: 'M200,120 L320,120 L320,180 L200,180 Z'
                },
                {
                    id: 'RS',
                    name: 'Rio Grande do Sul',
                    path: 'M180,280 L280,280 L280,340 L180,340 Z'
                },
                {
                    id: 'PR',
                    name: 'Paraná',
                    path: 'M180,240 L280,240 L280,280 L180,280 Z'
                },
                {
                    id: 'SC',
                    name: 'Santa Catarina',
                    path: 'M200,260 L300,260 L300,300 L200,300 Z'
                },
                {
                    id: 'BA',
                    name: 'Bahia',
                    path: 'M250,60 L350,60 L350,140 L250,140 Z'
                },
                {
                    id: 'GO',
                    name: 'Goiás',
                    path: 'M150,100 L250,100 L250,160 L150,160 Z'
                },
                {
                    id: 'PE',
                    name: 'Pernambuco',
                    path: 'M300,40 L380,40 L380,80 L300,80 Z'
                },
                {
                    id: 'CE',
                    name: 'Ceará',
                    path: 'M320,20 L400,20 L400,60 L320,60 Z'
                }
            ]
        };
    }
}

// Instância global dos gráficos
window.marketResearchCharts = new MarketResearchCharts();
window.brazilMapRenderer = new BrazilMapRenderer();

// Configurar responsividade quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (window.marketResearchCharts) {
        window.marketResearchCharts.setupResponsiveCharts();
    }
});

// Exportar para uso global
window.MarketResearchCharts = MarketResearchCharts;
window.BrazilMapRenderer = BrazilMapRenderer;

