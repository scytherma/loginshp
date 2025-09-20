// spa.js - Sistema de Single Page Application

document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');
    const navLinks = document.querySelectorAll('.nav__item');

    // Função para carregar o conteúdo da página
    function loadPage(route) {
        let pageContent = '';

        switch (route) {
            case 'home':
                pageContent = getHomeContent();
                break;
            case 'calculadora':
                pageContent = getCalculadoraContent();
                break;
            case 'gerenciar':
                pageContent = getGerenciarContent();
                break;
            case 'fechamento':
                pageContent = getFechamentoContent();
                break;
            case 'pesquisa':
                pageContent = getPesquisaContent();
                setTimeout(() => {
                    initEnhancedMarketResearch();
                }, 0);
                break;
            case 'dre':
                pageContent = getDreContent();
                break;
            case 'conexoes':
                pageContent = getConexoesContent();
                break;
            case 'planos':
                pageContent = getPlanosContent();
                // Adicionar event listeners para os botões de plano após o carregamento do conteúdo
                setTimeout(() => {
                    const planButtons = document.querySelectorAll(".plan-btn-page");
                    planButtons.forEach(button => {
                        const planId = button.getAttribute("data-plan");
                        if (planId && typeof window.selectPlan === 'function') {
                            button.addEventListener('click', () => {
                                window.selectPlan(planId);
                            });
                        }
                    });
                }, 0);
                break;
            default:
                pageContent = getHomeContent();
        }

        contentContainer.innerHTML = pageContent;

        // Se for a página da calculadora, reinicializar os event listeners
        if (route === 'calculadora') {
            initCalculatorEvents();
            applyAccessControls();
        }
        
        // Se for a página DRE, inicializar a calculadora DRE
        if (route === 'dre') {
            setupDREPage();
        }
    }

    // Função para atualizar a classe 'active' nos links da navegação
    function updateActiveClass(route) {
        navLinks.forEach(link => {
            if (link.getAttribute('data-route') === route) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Manipulador de cliques para os links da navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const currentRoute = getCurrentRoute();
            const newRoute = link.getAttribute('data-route');
            
            // Se estiver saindo da calculadora ou DRE, resetar os cálculos
            if (currentRoute === 'calculadora' && newRoute !== 'calculadora') {
                resetAllCalculators();
            }
            if (currentRoute === 'dre' && newRoute !== 'dre') {
                resetDRECalculator();
            }
            
            loadPage(newRoute);
            updateActiveClass(newRoute);
        });
    });

    // Carrega a página inicial (Home)
    loadPage('home');
    updateActiveClass('home');
});

// Função para obter a rota atual
function getCurrentRoute() {
    const activeLink = document.querySelector('.nav__item.active');
    return activeLink ? activeLink.getAttribute('data-route') : 'home';
}

// Função para resetar todas as calculadoras
function resetAllCalculators() {
    // Resetar calculadora Shopee
    if (typeof resetarCalculadoraShopee === 'function') {
        resetarCalculadoraShopee();
    }
    
    // Resetar calculadora Mercado Livre
    if (typeof resetarCalculadoraMercadoLivre === 'function') {
        resetarCalculadoraMercadoLivre();
    }
}

// Função para resetar a calculadora DRE
function resetDRECalculator() {
    if (typeof dreCalculator !== 'undefined' && dreCalculator && typeof dreCalculator.clearAll === 'function') {
        dreCalculator.clearAll();
    }
}

// Conteúdo da página Home
function getHomeContent() {
    return `
        <div class="page-container">
            <div class="welcome-section">
                <h1>Olá, bem-vindo ao Lucre Certo!</h1>
                <p>Utilize nossas ferramentas para potencializar suas vendas e maximizar seus lucros.</p>
            </div>

            <div class="updates-section">
                <h2>Atualizações</h2>
                
                <div class="update-item">
                    <div class="update-version">2.0.0</div>
                    <div class="update-content">
                        <ul>
                            <li>Nova interface com sidebar animada para melhor navegação</li>
                            <li>Sistema de Single Page Application (SPA) para transições mais rápidas</li>
                            <li>Página inicial com informações sobre atualizações e melhorias</li>
                            <li>Design responsivo aprimorado para dispositivos móveis</li>
                        </ul>
                    </div>
                </div>

                <div class="update-item">
                    <div class="update-version">1.5.0</div>
                    <div class="update-content">
                        <ul>
                            <li>Calculadora para Mercado Livre com taxas específicas por categoria</li>
                            <li>Sistema de multiplicadores para cálculo de múltiplos produtos</li>
                            <li>Melhorias na interface da calculadora de precificação</li>
                            <li>Correção de bugs menores</li>
                        </ul>
                    </div>
                </div>

                <div class="update-item">
                    <div class="update-version">1.4.0</div>
                    <div class="update-content">
                        <ul>
                            <li>Adicionado sistema de autenticação com Supabase</li>
                            <li>Tema claro/escuro para melhor experiência do usuário</li>
                            <li>Sistema de custos extras dinâmicos</li>
                            <li>Melhorias na responsividade mobile</li>
                        </ul>
                    </div>
                </div>

                <div class="update-item">
                    <div class="update-version">1.3.0</div>
                    <div class="update-content">
                        <ul>
                            <li>Calculadora da Shopee com programa de frete grátis</li>
                            <li>Sistema de abas para diferentes plataformas</li>
                            <li>Cálculos automáticos de margem de lucro</li>
                            <li>Interface moderna e intuitiva</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="future-features-section">
                <h2>Próximas Funcionalidades</h2>
                <div class="feature-grid">
                    <div class="feature-card">
                        <i class="fas fa-list-check"></i>
                        <h3>Gerenciar Anúncios</h3>
                        <p>Sistema completo para gerenciar seus anúncios em diferentes plataformas</p>
                        <span class="status coming-soon">Em breve</span>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-calendar-check"></i>
                        <h3>Fechamento de Mês</h3>
                        <p>Relatórios detalhados de vendas e lucros mensais</p>
                        <span class="status coming-soon">Em breve</span>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-search"></i>
                        <h3>Pesquisa de Mercado</h3>
                        <p>Análise competitiva e tendências de mercado</p>
                        <span class="status coming-soon">Em breve</span>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-chart-line"></i>
                        <h3>Tendências de Mercado</h3>
                        <p>Análise de tendências para o seu nicho</p>
                        <span class="status coming-soon">Em breve</span>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-plug"></i>
                        <h3>Conexões</h3>
                        <p>Integração com APIs das principais plataformas de e-commerce</p>
                        <span class="status coming-soon">Em breve</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Conteúdo da página Calculadora (conteúdo original)
function getCalculadoraContent() {
    return `
        <div class="container">
            <!-- Sistema de Abas -->
            <div class="tabs-container">
                <div class="tabs-header">
                    <button class="tab-button active" data-tab="shopee">Calculadora Shopee</button>
                    <button class="tab-button" data-tab="mercadolivre">Calculadora Mercado Livre</button>
                    <button class="tab-button disabled" data-tab="shein">Calculadora Shein</button>
                </div>
            </div>

            <!-- Conteúdo da Aba Shopee -->
            <div class="tab-content active" id="shopee-tab">
                <div class="calculator-wrapper">
                    <!-- Seção de Entrada de Dados -->
                    <div class="input-section">
                        <!-- Toggle Programa de Frete Grátis -->
                        <div class="frete-section">
                            <h2>PROGRAMA DE FRETE GRÁTIS DA SHOPEE</h2>
                            <div class="toggle-container">
                                <label class="toggle">
                                    <input type="checkbox" id="freteGratis" checked>
                                    <span class="slider"></span>
                                </label>
                                <span class="toggle-label">Sim</span>
                            </div>
                        </div>

                        <!-- Custo do Produto -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="custoProduto">CUSTO DO PRODUTO</label>
                                <span class="help-icon" title="Preço de custo do produto. Clique no + para adicionar mais de um produto.">?</span>
                            </div>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="custoProduto" placeholder="0,00">
                                <div class="multiplier-container">
                                    <span class="multiplier">1x</span>
                                    <div class="multiplier-arrows">
                                        <button type="button" class="arrow-up">▲</button>
                                        <button type="button" class="arrow-down">▼</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Impostos -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="impostos">IMPOSTOS</label>
                                <span class="help-icon" title="Porcentagem de imposto">?</span>
                            </div>
                            <div class="input-wrapper">
                                <span class="currency">%</span>
                                <input type="text" id="impostos" placeholder="0">
                            </div>
                        </div>

                        <!-- Despesas Variáveis -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="despesasVariaveis">DESPESAS VARIÁVEIS</label>
                                <span class="help-icon" title="Valor gasto com o anúncio. Ex: frete, embalagem, etiqueta, etc.">?</span>
                            </div>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="despesasVariaveis" placeholder="0,00">
                            </div>
                        </div>

                        <!-- Custos Extras Dinâmicos -->
                        <div class="input-group">
                            <div class="label-container">
                                <label>CUSTOS EXTRAS</label>
                                <span class="help-icon" title="Adicione valores que considerar importante para a precificação do anúncio clicando no +. Selecione entre R$ e %.">?</span>
                                <button type="button" class="add-custo-extra-btn">+</button>
                            </div>
                            <div id="custosExtrasContainer">
                                <!-- Campos de custo extra serão adicionados aqui via JavaScript -->
                            </div>
                        </div>
                    </div>

                    <!-- Seção de Resultados -->
                    <div class="results-section">
                        <!-- Seção de Salvamento no Topo -->
                        <div class="save-section-enhanced">
                            <div class="save-header">
                                <div class="save-title-container">
                                    <input type="text" id="nomeAnuncioShopee" placeholder="Nome do Anúncio..." class="save-title-input">
                                    <button type="button" class="photo-upload-btn" id="photoUploadBtnShopee">
                                        <i class="fas fa-camera"></i>
                                        Foto
                                    </button>
                                </div>
                                <input type="file" id="photoFileInputShopee" accept="image/*" style="display: none;">
                                <input type="text" id="fotoAnuncioShopee" placeholder="URL da foto (opcional)" class="photo-url-input" style="display: none;">
                            </div>
                        </div>

                        <!-- Resultados Principais -->
                        <div class="main-results">
                            <div class="result-item">
                                <span class="result-label">Preço de Venda</span>
                                <span class="result-value primary" id="precoVenda">R$ 5,00</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">Lucro por Venda</span>
                                <span class="result-value primary" id="lucroPorVenda">R$ 0,00</span>
                            </div>
                        </div>

                        <!-- Grid de Resultados Secundários -->
                        <div class="secondary-results">
                            <div class="result-box">
                                <span class="result-label">Taxa da Shopee</span>
                                <span class="result-value" id="taxaShopee">R$5,00</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Valor dos Impostos</span>
                                <span class="result-value" id="valorImpostos">R$0,00</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Custo Total do Produto</span>
                                <span class="result-value" id="custoTotal">R$0,00</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Retorno sobre Produto</span>
                                <span class="result-value" id="retornoProduto">0%</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Markup %</span>
                                <span class="result-value" id="markupPercent">0%</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Markup X</span>
                                <span class="result-value" id="markupX">0X</span>
                            </div>
                        </div>

                        <!-- Margem de Lucro -->
                        <div class="margin-section">
                            <h3>MARGEM DE LUCRO</h3>
                            <div class="margin-slider-container">
                                <input type="range" id="margemLucro" min="0" max="70" value="0" class="margin-slider" step="0.5">
                                <span class="margin-value" id="margemValue">0%</span>
                            </div>
                        </div>
                        <button type="button" id="limparCamposBtn" class="limpar-campos-btn">Limpar Campos</button>
                        
                        <!-- Campos de Salvamento Restantes -->
                        <div class="save-body">
                            <div class="save-field">
                                <label>Comentário</label>
                                <textarea id="comentarioShopee" placeholder="Adicione um comentário sobre este anúncio (opcional)"></textarea>
                            </div>
                            
                            <div class="save-field">
                                <label>Tags</label>
                                <input type="text" id="tagsShopee" placeholder="Digite e pressione Enter para adicionar">
                            </div>
                            
                            <button type="button" id="salvarCalculoShopeeBtn" class="save-btn-enhanced">
                                Apenas assinantes podem salvar
                            </button>
                        </div>

                        <!-- Lista de Cálculos Salvos -->
                        <div class="saved-calculations-section" id="savedCalculationsShopee">
                            <div class="saved-calculations-header">
                                <span>Anúncios Salvos (0)</span>
                                <i class="fas fa-list"></i>
                            </div>
                            <div class="saved-calculations-list" id="savedCalculationsListShopee">
                                <div class="no-calculations">
                                    <i class="fas fa-calculator"></i>
                                    <p>Nenhum cálculo salvo ainda</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Conteúdo da Aba Mercado Livre -->
            <div class="tab-content" id="mercadolivre-tab">
                <div class="calculator-wrapper">
                    <!-- Seção de Entrada de Dados -->
                    <div class="input-section">
                        <!-- Custo do Produto -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="custoProdutoML">CUSTO DO PRODUTO</label>
                                <span class="help-icon" title="Preço de custo do produto">?</span>
                            </div>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="custoProdutoML" placeholder="0,00">
                                <div class="multiplier-container">
                                    <span class="multiplier" id="multiplierML">1x</span>
                                    <div class="multiplier-arrows">
                                        <button type="button" class="arrow-up" data-target="ML">▲</button>
                                        <button type="button" class="arrow-down" data-target="ML">▼</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Impostos -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="impostosML">IMPOSTOS</label>
                                <span class="help-icon" title="Porcentagem de imposto">?</span>
                            </div>
                            <div class="input-wrapper">
                                <span class="currency">%</span>
                                <input type="text" id="impostosML" placeholder="0">
                            </div>
                        </div>

                        <!-- Despesas Variáveis -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="despesasVariaveisML">DESPESAS VARIÁVEIS</label>
                                <span class="help-icon" title="Valor gasto com embalagem, etiqueta, etc.">?</span>
                            </div>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="despesasVariaveisML" placeholder="0,00">
                            </div>
                        </div>

                        <!-- Taxa do Mercado Livre -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="taxaMercadoLivreSelect">TAXA DO MERCADO LIVRE</label>
                                <span class="help-icon" title="Selecione a categoria e tipo de anúncio">?</span>
                            </div>
                            <div class="input-wrapper">
                                <span class="currency">%</span>
                                <select id="taxaMercadoLivreSelect" class="select-input">
                                    <option value="12">Geral - Clássico (12%)</option>
                                    <option value="15">Geral - Premium (15%)</option>
                                    <option value="14">Eletrônicos - Clássico (14%)</option>
                                    <option value="17">Eletrônicos - Premium (17%)</option>
                                    <option value="16">Moda e Beleza - Clássico (16%)</option>
                                    <option value="19">Moda e Beleza - Premium (19%)</option>
                                    <option value="12">Casa e Jardim - Clássico (12%)</option>
                                    <option value="15">Casa e Jardim - Premium (15%)</option>
                                    <option value="13">Esportes - Clássico (13%)</option>
                                    <option value="16">Esportes - Premium (16%)</option>
                                    <option value="10">Livros - Clássico (10%)</option>
                                    <option value="13">Livros - Premium (13%)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Taxa de Frete -->
                        <div class="input-group">
                            <div class="label-container">
                                <label for="taxaFreteSelect">TAXA DE FRETE</label>
                                <span class="help-icon" title="Selecione baseado no peso e valor do produto">?</span>
                            </div>
                            <div class="input-wrapper">
                            <span class="currency">R$</span>
                            <select id="taxaFreteSelect" class="select-input">
                                <optgroup label="Produtos < R$ 79, usados">
                                    <option value="39.90">Até 300g (R$ 39,90)</option>
                                    <option value="42.90">300g a 500g (R$ 42,90)</option>
                                    <option value="44.90">500g a 1kg (R$ 44,90)</option>
                                    <option value="46.90">1kg a 2kg (R$ 46,90)</option>
                                    <option value="49.90">2kg a 3kg (R$ 49,90)</option>
                                    <option value="53.90">3kg a 4kg (R$ 53,90)</option>
                                    <option value="56.90">4kg a 5kg (R$ 56,90)</option>
                                    <option value="88.90">5kg a 9kg (R$ 88,90)</option>
                                </optgroup>
                                <optgroup label="Produtos R$ 79 a R$ 99,99">
                                    <option value="11.97">Até 300g (R$ 11,97)</option>
                                    <option value="12.87">300g a 500g (R$ 12,87)</option>
                                    <option value="13.47">500g a 1kg (R$ 13,47)</option>
                                    <option value="14.07">1kg a 2kg (R$ 14,07)</option>
                                    <option value="14.97">2kg a 3kg (R$ 14,97)</option>
                                    <option value="16.17">3kg a 4kg (R$ 16,17)</option>
                                    <option value="17.07">4kg a 5kg (R$ 17,07)</option>
                                    <option value="26.67">5kg a 9kg (R$ 26,67)</option>
                                </optgroup>
                                <optgroup label="Produtos R$ 100 a R$ 119,99">
                                    <option value="13.97">Até 300g (R$ 13,97)</option>
                                    <option value="15.02">300g a 500g (R$ 15,02)</option>
                                    <option value="15.72">500g a 1kg (R$ 15,72)</option>
                                    <option value="16.42">1kg a 2kg (R$ 16,42)</option>
                                    <option value="17.47">2kg a 3kg (R$ 17,47)</option>
                                    <option value="18.87">3kg a 4kg (R$ 18,87)</option>
                                    <option value="19.92">4kg a 5kg (R$ 19,92)</option>
                                </optgroup>
                                <optgroup label="Produtos R$ 120 a R$ 149,99">
                                    <option value="15.96">Até 300g (R$ 15,96)</option>
                                    <option value="17.16">300g a 500g (R$ 17,16)</option>
                                    <option value="17.96">500g a 1kg (R$ 17,96)</option>
                                    <option value="18.76">1kg a 2kg (R$ 18,76)</option>
                                    <option value="19.96">2kg a 3kg (R$ 19,96)</option>
                                </optgroup>
                                <optgroup label="Produtos R$ 150 a R$ 199,99">
                                    <option value="17.96">Até 300g (R$ 17,96)</option>
                                    <option value="19.31">300g a 500g (R$ 19,31)</option>
                                    <option value="20.21">500g a 1kg (R$ 20,21)</option>
                                    <option value="21.11">1kg a 2kg (R$ 21,11)</option>
                                    <option value="22.46">2kg a 3kg (R$ 22,46)</option>
                                </optgroup>
                                <optgroup label="Produtos > R$ 200">
                                    <option value="19.95">Até 300g (R$ 19,95)</option>
                                    <option value="21.45">300g a 500g (R$ 21,45)</option>
                                    <option value="22.45">500g a 1kg (R$ 22,45)</option>
                                    <option value="23.45">1kg a 2kg (R$ 23,45)</option>
                                    <option value="24.95">2kg a 3kg (R$ 24,95)</option>
                                </optgroup>
                                <optgroup label="Frete Grátis (R$ 19 a R$ 78,99)">
                                    <option value="0">Frete Grátis - ML paga (R$ 0,00)</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>

                        <!-- Custos Extras Dinâmicos -->
                        <div class="input-group">
                            <div class="label-container">
                                <label>CUSTOS EXTRAS</label>
                                <span class="help-icon" title="Adicione valores que considerar importante para a precificação do anúncio clicando no +. Selecione entre R$ e %.">?</span>
                                <button type="button" class="add-custo-extra-btn" data-target="ML">+</button>
                            </div>
                            <div id="custosExtrasContainerML">
                                <!-- Campos de custo extra serão adicionados aqui via JavaScript -->
                            </div>
                        </div>
                    </div>

                    <!-- Seção de Resultados -->
                    <div class="results-section">
                        <!-- Seção de Salvamento no Topo -->
                        <div class="save-section-enhanced">
                            <div class="save-header">
                                <div class="save-title-container">
                                    <input type="text" id="nomeAnuncioML" placeholder="Nome do Anúncio..." class="save-title-input">
                                    <button type="button" class="photo-upload-btn" id="photoUploadBtnML">
                                        <i class="fas fa-camera"></i>
                                        Foto
                                    </button>
                                </div>
                                <input type="file" id="photoFileInputML" accept="image/*" style="display: none;">
                                <input type="text" id="fotoAnuncioML" placeholder="URL da foto (opcional)" class="photo-url-input" style="display: none;">
                            </div>
                        </div>

                        <!-- Resultados Principais -->
                        <div class="main-results">
                            <div class="result-item">
                                <span class="result-label">Preço de Venda</span>
                                <span class="result-value primary" id="precoVendaML">R$ 5,00</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">Lucro por Venda</span>
                                <span class="result-value primary" id="lucroPorVendaML">R$ 0,00</span>
                            </div>
                        </div>

                        <!-- Grid de Resultados Secundários -->
                        <div class="secondary-results">
                            <div class="result-box">
                                <span class="result-label">Taxa do ML</span>
                                <span class="result-value" id="taxaMercadoLivre">R$5,00</span>
                            </div>

                            <div class="result-box">
                                <span class="result-label">Valor dos Impostos</span>
                                <span class="result-value" id="valorImpostosML">R$0,00</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Custo Total do Produto</span>
                                <span class="result-value" id="custoTotalML">R$0,00</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Retorno sobre Produto</span>
                                <span class="result-value" id="retornoProdutoML">0%</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Markup %</span>
                                <span class="result-value" id="markupPercentML">0%</span>
                            </div>
                            <div class="result-box">
                                <span class="result-label">Markup X</span>
                                <span class="result-value" id="markupXML">0X</span>
                            </div>
                        </div>

                        <!-- Margem de Lucro -->
                        <div class="margin-section">
                            <h3>MARGEM DE LUCRO</h3>
                            <div class="margin-slider-container">
                                <input type="range" id="margemLucroML" min="0" max="70" value="0" class="margin-slider" step="0.5">
                                <span class="margin-value" id="margemValueML">0%</span>
                            </div>
                        </div>
                        <button type="button" id="limparCamposBtnML" class="limpar-campos-btn">Limpar Campos</button>
                        
                        <!-- Campos de Salvamento Restantes -->
                        <div class="save-body">
                            <div class="save-field">
                                <label>Comentário</label>
                                <textarea id="comentarioML" placeholder="Adicione um comentário sobre este anúncio (opcional)"></textarea>
                            </div>
                            
                            <div class="save-field">
                                <label>Tags</label>
                                <input type="text" id="tagsML" placeholder="Digite e pressione Enter para adicionar">
                            </div>
                            
                            <button type="button" id="salvarCalculoMLBtn" class="save-btn-enhanced">
                                Apenas assinantes podem salvar
                            </button>
                        </div>

                        <!-- Lista de Cálculos Salvos -->
                        <div class="saved-calculations-section" id="savedCalculationsML">
                            <div class="saved-calculations-header">
                                <span>Anúncios Salvos (0)</span>
                                <i class="fas fa-list"></i>
                            </div>
                            <div class="saved-calculations-list" id="savedCalculationsListML">
                                <div class="no-calculations">
                                    <i class="fas fa-calculator"></i>
                                    <p>Nenhum cálculo salvo ainda</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Conteúdo da Aba Shein -->
            <div class="tab-content" id="shein-tab">
                <div class="coming-soon-container">
                    <div class="coming-soon-content">
                        <i class="fas fa-tools"></i>
                        <h2>Calculadora Shein</h2>
                        <p>Esta funcionalidade está em desenvolvimento e estará disponível em breve!</p>
                        <div class="features-preview">
                            <h3>O que você pode esperar:</h3>
                            <ul>
                                <li>Cálculo específico para taxas da Shein</li>
                                <li>Consideração de impostos de importação</li>
                                <li>Análise de margem para produtos internacionais</li>
                                <li>Interface otimizada para dropshipping</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Páginas "Em breve"
function getGerenciarContent() {
    return `
        <div class="coming-soon-page">
            <div class="coming-soon-content">
                <i class="fas fa-list-check"></i>
                <h1>Gerenciar Anúncios</h1>
                <p>Esta funcionalidade está em desenvolvimento e estará disponível em breve!</p>
                <div class="features-preview">
                    <h3>O que você pode esperar:</h3>
                    <ul>
                        <li>Visualização de todos os seus anúncios em um só lugar</li>
                        <li>Edição rápida de preços e descrições</li>
                        <li>Análise de performance por anúncio</li>
                        <li>Sincronização com múltiplas plataformas</li>
                        <li>Relatórios detalhados de vendas</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function getFechamentoContent() {
    return `
        <div class="coming-soon-page">
            <div class="coming-soon-content">
                <i class="fas fa-calendar-check"></i>
                <h1>Fechamento de Mês</h1>
                <p>Esta funcionalidade está em desenvolvimento e estará disponível em breve!</p>
                <div class="features-preview">
                    <h3>O que você pode esperar:</h3>
                    <ul>
                        <li>Relatórios mensais automatizados</li>
                        <li>Análise de lucros e despesas</li>
                        <li>Gráficos de performance</li>
                        <li>Comparativo entre meses</li>
                        <li>Exportação para Excel/PDF</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function getPesquisaContent() {
    return `
        <div class="market-research-page">
            <!-- Header da Pesquisa de Mercado -->
            <div class="market-research-header">
                <div class="header-content">
                    <div class="header-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="header-text">
                        <h1>Pesquisa de Mercado Inteligente</h1>
                        <p>Análise completa com IA, tendências e dados de mercado</p>
                    </div>
                </div>
                <div class="header-stats">
                    <div class="stat-item">
                        <span class="stat-number">5+</span>
                        <span class="stat-label">Fontes de Dados</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">AI</span>
                        <span class="stat-label">Insights Inteligentes</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">Real-time</span>
                        <span class="stat-label">Dados Atualizados</span>
                    </div>
                </div>
            </div>

            <!-- Container de Pesquisa Melhorado -->
            <div class="market-search-container">
                <div class="search-form">
                    <div class="search-input-group">
                        <div class="search-input-wrapper">
                            <div class="search-input-icon">
                                <i class="fas fa-search"></i>
                            </div>
                            <input 
                                type="text" 
                                id="marketSearchInput" 
                                placeholder="Digite o nome do produto (ex: smartphone, tênis, fone de ouvido...)"
                                maxlength="100"
                                autocomplete="off"
                            >
                            <button id="clearSearchButton" type="button" title="Limpar pesquisa">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div id="searchInputError" class="search-input-error"></div>
                        <div class="search-suggestions" id="searchSuggestions">
                            <div class="suggestions-header">Sugestões populares:</div>
                            <div class="suggestions-list">
                                <button class="suggestion-item" data-query="smartphone">📱 Smartphone</button>
                                <button class="suggestion-item" data-query="tênis esportivo">👟 Tênis Esportivo</button>
                                <button class="suggestion-item" data-query="fone bluetooth">🎧 Fone Bluetooth</button>
                                <button class="suggestion-item" data-query="notebook">💻 Notebook</button>
                                <button class="suggestion-item" data-query="smartwatch">⌚ Smartwatch</button>
                            </div>
                        </div>
                    </div>
                    <div class="search-button-group">
                        <button id="marketSearchButton" type="button" class="search-btn">
                            <i class="fas fa-search"></i>
                            <span>Analisar Produto</span>
                        </button>
                    </div>
                </div>
                
                <!-- Indicador de Loading Melhorado -->
                <div id="searchLoadingIndicator" class="loading-container">
                    <div class="loading-progress-container">
                        <div class="loading-header">
                            <div class="loading-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                            <h2>Analisando seu produto...</h2>
                            <p>Coletando dados de múltiplas fontes para fornecer insights precisos</p>
                        </div>
                        
                        <div class="loading-steps">
                            <div class="loading-step active" id="step-trends">
                                <div class="step-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="step-content">
                                    <h3>Analisando Tendências</h3>
                                    <p>Coletando dados do Google Trends...</p>
                                </div>
                                <div class="step-spinner">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </div>
                            </div>
                            
                            <div class="loading-step" id="step-demographics">
                                <div class="step-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="step-content">
                                    <h3>Dados Demográficos</h3>
                                    <p>Consultando base de dados do IBGE...</p>
                                </div>
                                <div class="step-spinner">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </div>
                            </div>
                            
                            <div class="loading-step" id="step-competition">
                                <div class="step-icon">
                                    <i class="fas fa-balance-scale"></i>
                                </div>
                                <div class="step-content">
                                    <h3>Análise de Concorrência</h3>
                                    <p>Pesquisando em marketplaces...</p>
                                </div>
                                <div class="step-spinner">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </div>
                            </div>
                            
                            <div class="loading-step" id="step-ai">
                                <div class="step-icon">
                                    <i class="fas fa-brain"></i>
                                </div>
                                <div class="step-content">
                                    <h3>Insights Inteligentes</h3>
                                    <p>Gerando recomendações com IA...</p>
                                </div>
                                <div class="step-spinner">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div class="loading-progress-bar">
                            <div class="progress-bar-fill" id="progressBarFill"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Container para os resultados da pesquisa -->
            <div id="marketResearchResultsContainer" class="market-research-results-container">
                <!-- Os resultados serão inseridos aqui dinamicamente -->
            </div>

            <!-- Seção de Histórico Melhorada -->
            <div class="history-section" id="searchHistorySection">
                <div class="history-header">
                    <h2>
                        <i class="fas fa-history"></i>
                        Pesquisas Recentes
                    </h2>
                    <button class="clear-history-btn" id="clearHistoryBtn" title="Limpar histórico">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="history-list" id="searchHistoryList">
                    <!-- Histórico será inserido dinamicamente -->
                </div>
            </div>

            <!-- Seção de Recursos e Dicas -->
            <div class="resources-section">
                <div class="resources-header">
                    <h2>
                        <i class="fas fa-lightbulb"></i>
                        Recursos e Dicas
                    </h2>
                </div>
                <div class="resources-grid">
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <h3>Análise de Tendências</h3>
                        <p>Entenda como interpretar os gráficos de interesse ao longo do tempo e sazonalidade.</p>
                        <button class="resource-btn" onclick="showTrendsGuide()">
                            <span>Saiba Mais</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="fas fa-target"></i>
                        </div>
                        <h3>Estratégias de Preço</h3>
                        <p>Aprenda a definir preços competitivos baseados na análise de concorrência.</p>
                        <button class="resource-btn" onclick="showPricingGuide()">
                            <span>Saiba Mais</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="fas fa-map-marked-alt"></i>
                        </div>
                        <h3>Mercado Regional</h3>
                        <p>Descubra como usar os dados regionais para focar suas estratégias de marketing.</p>
                        <button class="resource-btn" onclick="showRegionalGuide()">
                            <span>Saiba Mais</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal para Guias -->
            <div id="guideModal" class="guide-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalTitle">Guia</h3>
                        <button class="modal-close" onclick="closeGuideModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="modalBody">
                        <!-- Conteúdo do guia será inserido aqui -->
                    </div>
                </div>
            </div>

            <!-- Overlay para Modal -->
            <div id="modalOverlay" class="modal-overlay" onclick="closeGuideModal()"></div>
        </div>

        <!-- Scripts necessários -->
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            // Inicializar pesquisa de mercado melhorada quando a página carregar
            document.addEventListener(\'DOMContentLoaded\', function() {
                if (typeof initEnhancedMarketResearch === \'function\') {
                    initEnhancedMarketResearch();
                }
                
                // Configurar sugestões de pesquisa
                setupSearchSuggestions();
                
                // Configurar histórico
                setupHistoryControls();
            });

            // Configurar sugestões de pesquisa
            function setupSearchSuggestions() {
                const suggestions = document.querySelectorAll(\".suggestion-item\");
                suggestions.forEach(suggestion => {
                    suggestion.addEventListener(\'click\', function() {
                        const query = this.getAttribute(\'data-query\');
                        const searchInput = document.getElementById(\'marketSearchInput\');
                        if (searchInput) {
                            searchInput.value = query;
                            searchInput.focus();
                            
                            // Trigger search automatically
                            if (typeof handleEnhancedMarketSearch === \'function\') {
                                handleEnhancedMarketSearch();
                            }
                        }
                    });
                });
            }

            // Configurar controles de histórico
            function setupHistoryControls() {
                const clearHistoryBtn = document.getElementById(\'clearHistoryBtn\');
                if (clearHistoryBtn) {
                    clearHistoryBtn.addEventListener(\'click\', function() {
                        if (confirm(\'Tem certeza que deseja limpar todo o histórico de pesquisas?\')) {
                            localStorage.removeItem(\'market_research_history\');
                            const historySection = document.getElementById(\'searchHistorySection\');
                            if (historySection) {
                                historySection.style.display = \'none\';
                            }
                        }
                    });
                }
            }

            // Funções para os guias
            function showTrendsGuide() {
                showGuideModal(\'Análise de Tendências\', \
                    <div class="guide-content">
                        <h4>Como Interpretar o Gráfico de Tendências</h4>
                        <ul>
                            <li><strong>Linha Ascendente:</strong> Produto em alta, boa oportunidade</li>
                            <li><strong>Linha Descendente:</strong> Interesse diminuindo, cuidado</li>
                            <li><strong>Picos Sazonais:</strong> Identifique épocas de maior demanda</li>
                            <li><strong>Estabilidade:</strong> Mercado maduro, concorrência estabelecida</li>
                        </ul>
                        <h4>Dicas Importantes</h4>
                        <p>• Observe tendências de pelo menos 6 meses</p>
                        <p>• Compare com eventos sazonais (Natal, Black Friday)</p>
                        <p>• Considere fatores externos (economia, moda)</p>
                    </div>
                \');
            }

            function showPricingGuide() {
                showGuideModal(\'Estratégias de Preço\', \
                    <div class="guide-content">
                        <h4>Como Definir o Preço Ideal</h4>
                        <ul>
                            <li><strong>Preço Competitivo:</strong> 5-10% abaixo da média</li>
                            <li><strong>Preço Premium:</strong> 10-20% acima, com diferencial</li>
                            <li><strong>Preço de Penetração:</strong> Muito baixo para ganhar mercado</li>
                        </ul>
                        <h4>Fatores a Considerar</h4>
                        <p>• Qualidade do produto vs. concorrência</p>
                        <p>• Margem de lucro desejada</p>
                        <p>• Poder de compra do público-alvo</p>
                        <p>• Custos de marketing e logística</p>
                    </div>
                \');
            }

            function showRegionalGuide() {
                showGuideModal(\'Mercado Regional\', \
                    <div class="guide-content">
                        <h4>Como Usar Dados Regionais</h4>
                        <ul>
                            <li><strong>Regiões Quentes:</strong> Foque marketing e estoque</li>
                            <li><strong>Regiões Frias:</strong> Investigue oportunidades</li>
                            <li><strong>Distribuição:</strong> Priorize centros de distribuição</li>
                        </ul>
                        <h4>Estratégias por Região</h4>
                        <p>• <strong>Sudeste:</strong> Maior poder de compra, preços premium</p>
                        <p>• <strong>Nordeste:</strong> Preços competitivos, produtos populares</p>
                        <p>• <strong>Sul:</strong> Qualidade valorizada, produtos duráveis</p>
                    </div>
                \');
            }

            function showGuideModal(title, content) {
                const modal = document.getElementById(\'guideModal\');
                const overlay = document.getElementById(\'modalOverlay\');
                const modalTitle = document.getElementById(\'modalTitle\');
                const modalBody = document.getElementById(\'modalBody\');
                
                if (modal && overlay && modalTitle && modalBody) {
                    modalTitle.textContent = title;
                    modalBody.innerHTML = content;
                    
                    modal.style.display = \'block\';
                    overlay.style.display = \'block\';
                    
                    // Animar entrada
                    setTimeout(() => {
                        modal.classList.add(\'active\');
                        overlay.classList.add(\'active\');
                    }, 10);
                }
            }

            function closeGuideModal() {
                const modal = document.getElementById(\'guideModal\');
                const overlay = document.getElementById(\'modalOverlay\');
                
                if (modal && overlay) {
                    modal.classList.remove(\'active\');
                    overlay.classList.remove(\'active\');
                    
                    setTimeout(() => {
                        modal.style.display = \'none\';
                        overlay.style.display = \'none\';
                    }, 300);
                }
            }

            // Fechar modal com ESC
            document.addEventListener(\'keydown\', function(e) {
                if (e.key === \'Escape\') {
                    closeGuideModal();
                }
            });
        </script>
    `;
}r, aguarde.</span>
                </div>
            </div>

            <!-- Container para os resultados da pesquisa -->
            <div id="marketResearchResultsContainer" class="market-research-results-container">
                <!-- Tendência de Busca e Regiões -->
                <div class="result-card trend-region-section">
                    <div class="trend-chart-container">
                        <h2><i class="fas fa-chart-line icon"></i> Tendência de Busca</h2>
                        <p>Gráfico de tendência de busca aqui</p>
                    </div>
                    <div class="region-map-container">
                        <h2><i class="fas fa-map-marked-alt icon"></i> Regiões</h2>
                        <p>Mapa do Brasil aqui</p>
                    </div>
                </div>

                <!-- Demografia & Mercado e Concorrência -->
                <div class="result-card demography-competition-section">
                    <div class="demography-chart-container">
                        <h2><i class="fas fa-users icon"></i> Demografia & Mercado</h2>
                        <p>Gráfico de demografia e mercado aqui</p>
                    </div>
                    <div class="competition-table-container">
                        <h2><i class="fas fa-balance-scale icon"></i> Concorrência</h2>
                        <p>Tabela de concorrência aqui</p>
                    </div>
                </div>

                <!-- Preço Sugerido e Insights de Vendas -->
                <div class="result-card suggested-price-insights-section">
                    <div class="suggested-price-container">
                        <h2><i class="fas fa-dollar-sign icon"></i> Preço Sugerido</h2>
                        <p>Preço sugerido aqui</p>
                    </div>
                    <div class="sales-insights-chart-container">
                        <h2><i class="fas fa-chart-bar icon"></i> Insights de Vendas</h2>
                        <p>Gráfico de insights de vendas aqui</p>
                    </div>
                </div>

                <!-- Insights e Recomendações -->
                <div class="result-card insights-recommendations-section">
                    <h2><i class="fas fa-lightbulb icon"></i> Insights e Recomendações</h2>
                    <p>Insights e recomendações aqui</p>
                </div>
            </div>

            <!-- Seção de Histórico (será mostrada dinamicamente) -->
            <div class="history-section" id="searchHistorySection">
                <h2>
                    <i class="fas fa-history"></i>
                    Pesquisas Recentes
                </h2>
                <div class="history-list" id="searchHistoryList">
                    <!-- Histórico será inserido dinamicamente -->
                </div>
            </div>
        </div>
    `;
}

function getConexoesContent() {
    return `
        <div class="coming-soon-page">
            <div class="coming-soon-content">
                <i class="fas fa-plug"></i>
                <h1>Conexões</h1>
                <p>Esta funcionalidade está em desenvolvimento e estará disponível em breve!</p>
                <div class="features-preview">
                    <h3>O que você pode esperar:</h3>
                    <ul>
                        <li>Integração com APIs do Mercado Livre</li>
                        <li>Conexão com Shopee Seller Center</li>
                        <li>Sincronização automática de produtos</li>
                        <li>Atualização de preços em massa</li>
                        <li>Gestão centralizada de inventário</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// Configurações da Shopee
const SHOPEE_CONFIG = {
    taxaComissaoPadrao: 0.14, // 14%
    taxaComissaoFreteGratis: 0.20, // 20%
    taxaTransacao: 0.00, // 0%
    taxaFixaPorItem: 4.00, // R$4,00 por item vendido
};

// Multiplicadores
let multiplicadorCustoShopee = 1;
let multiplicadorCustoML = 1;

// Função para reinicializar os event listeners da calculadora
function initCalculatorEvents() {
    // Sistema de abas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('disabled')) return;

            const targetTab = button.getAttribute('data-tab');

            // Remove active de todos os botões e conteúdos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Adiciona active ao botão clicado e seu conteúdo correspondente
            button.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });

    // Inicializar calculadoras
    // Botão salvar cálculo Shopee
    const salvarCalculoShopeeBtn = document.getElementById("salvarCalculoShopeeBtn");
    if (salvarCalculoShopeeBtn) {
        salvarCalculoShopeeBtn.addEventListener("click", () => saveCalculation("shopee"));
    }

    // Botão salvar cálculo Mercado Livre
    const salvarCalculoMLBtn = document.getElementById("salvarCalculoMLBtn");
    if (salvarCalculoMLBtn) {
        salvarCalculoMLBtn.addEventListener("click", () => saveCalculation("mercadolivre"));
    }

    // Event listeners para upload de foto
    const photoUploadBtnShopee = document.getElementById("photoUploadBtnShopee");
    const photoFileInputShopee = document.getElementById("photoFileInputShopee");
    const photoUrlInputShopee = document.getElementById("fotoAnuncioShopee");

    if (photoUploadBtnShopee && photoFileInputShopee) {
        photoUploadBtnShopee.addEventListener("click", () => {
            photoFileInputShopee.click();
        });

        photoFileInputShopee.addEventListener("change", (e) => {
            if (e.target.files[0]) {
                photoUrlInputShopee.style.display = "none";
                photoUploadBtnShopee.innerHTML = '<i class="fas fa-check"></i> Foto Selecionada';
                photoUploadBtnShopee.style.background = '#28a745';
            } else {
                photoUrlInputShopee.style.display = "block";
                photoUploadBtnShopee.innerHTML = '<i class="fas fa-camera"></i> Foto';
                photoUploadBtnShopee.style.background = '#ff6b35';
            }
        });
    }

    const photoUploadBtnML = document.getElementById("photoUploadBtnML");
    const photoFileInputML = document.getElementById("photoFileInputML");
    const photoUrlInputML = document.getElementById("fotoAnuncioML");

    if (photoUploadBtnML && photoFileInputML) {
        photoUploadBtnML.addEventListener("click", () => {
            photoFileInputML.click();
        });

        photoFileInputML.addEventListener("change", (e) => {
            if (e.target.files[0]) {
                photoUrlInputML.style.display = "none";
                photoUploadBtnML.innerHTML = '<i class="fas fa-check"></i> Foto Selecionada';
                photoUploadBtnML.style.background = '#28a745';
            } else {
                photoUrlInputML.style.display = "block";
                photoUploadBtnML.innerHTML = '<i class="fas fa-camera"></i> Foto';
                photoUploadBtnML.style.background = '#ff6b35';
            }
        });
    }

    initializeShopeeCalculator();
    initializeMercadoLivreCalculator();
    
    // Carregar cálculos salvos ao inicializar
    loadSavedCalculations('shopee');
    loadSavedCalculations('mercadolivre');
}

// ===== CALCULADORA SHOPEE =====
function initializeShopeeCalculator() {
    const elements = {
        freteGratis: document.getElementById("freteGratis"),
        custoProduto: document.getElementById("custoProduto"),
        impostos: document.getElementById("impostos"),
        despesasVariaveis: document.getElementById("despesasVariaveis"),
        margemLucro: document.getElementById("margemLucro"),
        custosExtrasContainer: document.getElementById("custosExtrasContainer"),
        addCustoExtraBtn: document.querySelector(".add-custo-extra-btn:not([data-target])"),
        limparCamposBtn: document.getElementById("limparCamposBtn"),

        // Resultados
        precoVenda: document.getElementById("precoVenda"),
        lucroPorVenda: document.getElementById("lucroPorVenda"),
        taxaShopee: document.getElementById("taxaShopee"),
        valorImpostos: document.getElementById("valorImpostos"),
        custoTotal: document.getElementById("custoTotal"),
        retornoProduto: document.getElementById("retornoProduto"),
        markupPercent: document.getElementById("markupPercent"),
        markupX: document.getElementById("markupX"),
        margemValue: document.getElementById("margemValue")
    };

    // Event Listeners
    if (elements.margemLucro) {
        elements.margemLucro.addEventListener("input", function() {
            atualizarMargemValue(elements.margemValue, this.value);
            atualizarCorMargem(this, this.value);
            calcularPrecoVendaShopee();
        });
    }

    // Botões do multiplicador
    const arrowUp = document.querySelector(".arrow-up:not([data-target])");
    const arrowDown = document.querySelector(".arrow-down:not([data-target])");

    if (arrowUp) {
        arrowUp.addEventListener("click", () => {
            multiplicadorCustoShopee = Math.max(1, multiplicadorCustoShopee + 1);
            const multiplierEl = document.querySelector(".multiplier:not([id])");
            if (multiplierEl) multiplierEl.textContent = `${multiplicadorCustoShopee}x`;
            calcularPrecoVendaShopee();
        });
    }

    if (arrowDown) {
        arrowDown.addEventListener("click", () => {
            multiplicadorCustoShopee = Math.max(1, multiplicadorCustoShopee - 1);
            const multiplierEl = document.querySelector(".multiplier:not([id])");
            if (multiplierEl) multiplierEl.textContent = `${multiplicadorCustoShopee}x`;
            calcularPrecoVendaShopee();
        });
    }

    // Validação de inputs numéricos
    [elements.custoProduto, elements.despesasVariaveis].forEach(element => {
        if (element) {
            element.addEventListener("input", function() {
                validarEntradaNumerica(this);
                calcularPrecoVendaShopee();
            });

            element.addEventListener("blur", function() {
                formatarCampo(this);
                calcularPrecoVendaShopee();
            });
        }
    });

    // Validação especial para impostos
    if (elements.impostos) {
        elements.impostos.addEventListener("input", function() {
            validarEntradaNumerica(this);
            calcularPrecoVendaShopee();
        });

        elements.impostos.addEventListener("blur", function() {
            let valorString = this.value.replace(",", ".");
            let valor = parseFloat(valorString);

            if (isNaN(valor) || valor < 0) {
                this.value = "0,00";
            } else if (valor > 100) {
                this.value = "100,00";
            } else {
                this.value = valor.toFixed(2).replace(".", ",");
            }
            calcularPrecoVendaShopee();
        });
    }

    // Toggle frete grátis
    if (elements.freteGratis) {
        elements.freteGratis.addEventListener("change", calcularPrecoVendaShopee);
    }

    // Botão adicionar custo extra
    if (elements.addCustoExtraBtn) {
        elements.addCustoExtraBtn.addEventListener("click", () => adicionarCustoExtra("Shopee"));
    }

    // Botão limpar campos
    if (elements.limparCamposBtn) {
        elements.limparCamposBtn.addEventListener("click", resetarCalculadoraShopee);
    }

    // Cálculo inicial
    atualizarMargemValue(elements.margemValue, 0);
    calcularPrecoVendaShopee();
}

function calcularPrecoVendaShopee() {
    const custoProdutoValue = document.getElementById("custoProduto")?.value || "0";
    const custoProdutoBase = parseFloat(custoProdutoValue.replace(",", ".")) || 0;
    const custoProduto = custoProdutoBase * multiplicadorCustoShopee;

    const impostosValue = document.getElementById("impostos")?.value || "0";
    const impostosPercent = parseFloat(impostosValue.replace(",", ".")) || 0;

    const despesasValue = document.getElementById("despesasVariaveis")?.value || "0";
    const despesasVariaveis = parseFloat(despesasValue.replace(",", ".")) || 0;

    const margemDesejada = parseFloat(document.getElementById("margemLucro")?.value) || 0;
    const freteGratis = document.getElementById("freteGratis")?.checked || false;

    // Determinar taxa da Shopee baseada no programa de frete grátis
    const taxaShopee = freteGratis ? SHOPEE_CONFIG.taxaComissaoFreteGratis : SHOPEE_CONFIG.taxaComissaoPadrao;

    // Separar custos extras em valores reais e percentuais
    let custosExtrasReais = 0;
    let custosExtrasPercentuais = 0;

    document.querySelectorAll("#custosExtrasContainer .custo-extra-item").forEach(item => {
        const valueInput = item.querySelector(".custo-extra-value");
        const typeSelector = item.querySelector(".custo-extra-type-selector");

        const valor = parseFloat(valueInput.value.replace(",", ".")) || 0;
        const tipo = typeSelector.value;

        if (tipo === "real") {
            custosExtrasReais += valor;
        } else if (tipo === "percent") {
            custosExtrasPercentuais += (valor / 100);
        }
    });

    const custoTotalProduto = custoProduto + custosExtrasReais;

    const denominador = (1 - taxaShopee - (margemDesejada / 100) - (impostosPercent / 100) - custosExtrasPercentuais);
    let precoVenda = 0;
    if (denominador > 0) {
        precoVenda = (custoTotalProduto + despesasVariaveis + SHOPEE_CONFIG.taxaFixaPorItem) / denominador;
    }

    const valorImpostos = precoVenda * (impostosPercent / 100);
    const valorCustosExtrasPercentuais = precoVenda * custosExtrasPercentuais;
    const taxaShopeeValor = precoVenda * taxaShopee + SHOPEE_CONFIG.taxaFixaPorItem;

    const lucroLiquido = precoVenda - custoTotalProduto - despesasVariaveis - taxaShopeeValor - valorImpostos - valorCustosExtrasPercentuais;

    const retornoProduto = custoTotalProduto > 0 ? (lucroLiquido / custoTotalProduto) * 100 : 0;
    const markupPercent = custoTotalProduto > 0 ? ((precoVenda - custoTotalProduto) / custoTotalProduto) * 100 : 0;
    const markupX = custoTotalProduto > 0 ? precoVenda / custoTotalProduto : 0;

    // Atualizar interface
    atualizarResultadosShopee({
        precoVenda,
        lucroLiquido,
        taxaShopeeValor,
        valorImpostos,
        custoTotalProduto,
        retornoProduto,
        markupPercent,
        markupX
    });
}

function atualizarResultadosShopee(resultados) {
    const precoVendaEl = document.getElementById("precoVenda");
    const lucroPorVendaEl = document.getElementById("lucroPorVenda");
    const taxaShopeeEl = document.getElementById("taxaShopee");
    const valorImpostosEl = document.getElementById("valorImpostos");
    const custoTotalEl = document.getElementById("custoTotal");
    const retornoProdutoEl = document.getElementById("retornoProduto");
    const markupPercentEl = document.getElementById("markupPercent");
    const markupXEl = document.getElementById("markupX");

    if (precoVendaEl) precoVendaEl.textContent = formatarReal(resultados.precoVenda);
    if (lucroPorVendaEl) lucroPorVendaEl.textContent = formatarReal(resultados.lucroLiquido);
    if (taxaShopeeEl) taxaShopeeEl.textContent = formatarReal(resultados.taxaShopeeValor);
    if (valorImpostosEl) valorImpostosEl.textContent = formatarReal(resultados.valorImpostos);
    if (custoTotalEl) custoTotalEl.textContent = formatarReal(resultados.custoTotalProduto);
    if (retornoProdutoEl) retornoProdutoEl.textContent = formatarPercentual(resultados.retornoProduto);
    if (markupPercentEl) markupPercentEl.textContent = formatarPercentual(resultados.markupPercent);
    if (markupXEl) markupXEl.textContent = `${resultados.markupX.toFixed(2)}X`;

    // Atualizar cor do lucro
    if (lucroPorVendaEl) {
        if (resultados.lucroLiquido > 0) {
            lucroPorVendaEl.style.color = "#4CAF50";
        } else if (resultados.lucroLiquido < 0) {
            lucroPorVendaEl.style.color = "#f44336";
        } else {
            lucroPorVendaEl.style.color = "#ff6b35";
        }
    }
}

function resetarCalculadoraShopee() {
    const custoProdutoEl = document.getElementById("custoProduto");
    const impostosEl = document.getElementById("impostos");
    const despesasVariaveisEl = document.getElementById("despesasVariaveis");
    const margemLucroEl = document.getElementById("margemLucro");
    const freteGratisEl = document.getElementById("freteGratis");
    const margemValueEl = document.getElementById("margemValue");
    const custosExtrasContainerEl = document.getElementById("custosExtrasContainer");
    const multiplierEl = document.querySelector(".multiplier:not([id])");

    if (custoProdutoEl) custoProdutoEl.value = "";
    if (impostosEl) impostosEl.value = "";
    if (despesasVariaveisEl) despesasVariaveisEl.value = "";
    if (margemLucroEl) margemLucroEl.value = 0;
    if (freteGratisEl) freteGratisEl.checked = true;
    if (custosExtrasContainerEl) custosExtrasContainerEl.innerHTML = '';
    if (multiplierEl) multiplierEl.textContent = "1x";

    multiplicadorCustoShopee = 1;

    atualizarMargemValue(margemValueEl, 0);
    calcularPrecoVendaShopee();
}

// ===== CALCULADORA MERCADO LIVRE =====
function initializeMercadoLivreCalculator() {
    const elements = {
        custoProduto: document.getElementById("custoProdutoML"),
        impostos: document.getElementById("impostosML"),
        despesasVariaveis: document.getElementById("despesasVariaveisML"),
        taxaMercadoLivreSelect: document.getElementById("taxaMercadoLivreSelect"),
        taxaFreteSelect: document.getElementById("taxaFreteSelect"),
        margemLucro: document.getElementById("margemLucroML"),
        custosExtrasContainer: document.getElementById("custosExtrasContainerML"),
        addCustoExtraBtn: document.querySelector(".add-custo-extra-btn[data-target='ML']"),
        limparCamposBtn: document.getElementById("limparCamposBtnML"),

        // Resultados
        precoVenda: document.getElementById("precoVendaML"),
        lucroPorVenda: document.getElementById("lucroPorVendaML"),
        taxaMercadoLivre: document.getElementById("taxaMercadoLivre"),
        valorImpostos: document.getElementById("valorImpostosML"),
        custoTotal: document.getElementById("custoTotalML"),
        retornoProduto: document.getElementById("retornoProdutoML"),
        markupPercent: document.getElementById("markupPercentML"),
        markupX: document.getElementById("markupXML"),
        margemValue: document.getElementById("margemValueML")
    };

    // Event Listeners
    if (elements.margemLucro) {
        elements.margemLucro.addEventListener("input", function() {
            atualizarMargemValue(elements.margemValue, this.value);
            atualizarCorMargem(this, this.value);
            calcularPrecoVendaML();
        });
    }

    // Botões do multiplicador
    const arrowUpML = document.querySelector(".arrow-up[data-target='ML']");
    const arrowDownML = document.querySelector(".arrow-down[data-target='ML']");

    if (arrowUpML) {
        arrowUpML.addEventListener("click", () => {
            multiplicadorCustoML = Math.max(1, multiplicadorCustoML + 1);
            const multiplierEl = document.getElementById("multiplierML");
            if (multiplierEl) multiplierEl.textContent = `${multiplicadorCustoML}x`;
            calcularPrecoVendaML();
        });
    }

    if (arrowDownML) {
        arrowDownML.addEventListener("click", () => {
            multiplicadorCustoML = Math.max(1, multiplicadorCustoML - 1);
            const multiplierEl = document.getElementById("multiplierML");
            if (multiplierEl) multiplierEl.textContent = `${multiplicadorCustoML}x`;
            calcularPrecoVendaML();
        });
    }

    // Validação de inputs numéricos
    [elements.custoProduto, elements.despesasVariaveis].forEach(element => {
        if (element) {
            element.addEventListener("input", function() {
                validarEntradaNumerica(this);
                calcularPrecoVendaML();
            });

            element.addEventListener("blur", function() {
                formatarCampo(this);
                calcularPrecoVendaML();
            });
        }
    });

    // Validação especial para impostos
    if (elements.impostos) {
        elements.impostos.addEventListener("input", function() {
            validarEntradaNumerica(this);
            calcularPrecoVendaML();
        });

        elements.impostos.addEventListener("blur", function() {
            let valorString = this.value.replace(",", ".");
            let valor = parseFloat(valorString);

            if (isNaN(valor) || valor < 0) {
                this.value = "0,00";
            } else if (valor > 100) {
                this.value = "100,00";
            } else {
                this.value = valor.toFixed(2).replace(".", ",");
            }
            calcularPrecoVendaML();
        });
    }

    // Selects
    if (elements.taxaMercadoLivreSelect) {
        elements.taxaMercadoLivreSelect.addEventListener("change", calcularPrecoVendaML);
    }

    if (elements.taxaFreteSelect) {
        elements.taxaFreteSelect.addEventListener("change", calcularPrecoVendaML);
    }

    // Botão adicionar custo extra
    if (elements.addCustoExtraBtn) {
        elements.addCustoExtraBtn.addEventListener("click", () => adicionarCustoExtra("ML"));
    }

    // Botão limpar campos
    if (elements.limparCamposBtn) {
        elements.limparCamposBtn.addEventListener("click", resetarCalculadoraML);
    }

    // Cálculo inicial
    atualizarMargemValue(elements.margemValue, 0);
    calcularPrecoVendaML();
}

function calcularPrecoVendaML() {
    const custoProdutoValue = document.getElementById("custoProdutoML")?.value || "0";
    const custoProdutoBase = parseFloat(custoProdutoValue.replace(",", ".")) || 0;
    const custoProduto = custoProdutoBase * multiplicadorCustoML;

    const impostosValue = document.getElementById("impostosML")?.value || "0";
    const impostosPercent = parseFloat(impostosValue.replace(",", ".")) || 0;

    const despesasValue = document.getElementById("despesasVariaveisML")?.value || "0";
    const despesasVariaveis = parseFloat(despesasValue.replace(",", ".")) || 0;

    const margemDesejada = parseFloat(document.getElementById("margemLucroML")?.value) || 0;

    // Obter taxa do Mercado Livre selecionada
    const taxaMLPercent = parseFloat(document.getElementById("taxaMercadoLivreSelect")?.value) || 12;
    const taxaML = taxaMLPercent / 100;

    // Obter taxa de frete selecionada
    const taxaFrete = parseFloat(document.getElementById("taxaFreteSelect")?.value) || 0;

    // Separar custos extras em valores reais e percentuais
    let custosExtrasReais = 0;
    let custosExtrasPercentuais = 0;

    document.querySelectorAll("#custosExtrasContainerML .custo-extra-item").forEach(item => {
        const valueInput = item.querySelector(".custo-extra-value");
        const typeSelector = item.querySelector(".custo-extra-type-selector");

        const valor = parseFloat(valueInput.value.replace(",", ".")) || 0;
        const tipo = typeSelector.value;

        if (tipo === "real") {
            custosExtrasReais += valor;
        } else if (tipo === "percent") {
            custosExtrasPercentuais += (valor / 100);
        }
    });

    const custoTotalProduto = custoProduto + custosExtrasReais;

    const denominador = (1 - taxaML - (margemDesejada / 100) - (impostosPercent / 100) - custosExtrasPercentuais);
    let precoVenda = 0;
    if (denominador > 0) {
        precoVenda = (custoTotalProduto + despesasVariaveis + taxaFrete) / denominador;
    }

    const valorImpostos = precoVenda * (impostosPercent / 100);
    const valorCustosExtrasPercentuais = precoVenda * custosExtrasPercentuais;
    const taxaMLValor = (precoVenda * taxaML) + taxaFrete;

    const lucroLiquido = precoVenda - custoTotalProduto - despesasVariaveis - taxaMLValor - valorImpostos - valorCustosExtrasPercentuais;

    const retornoProduto = custoTotalProduto > 0 ? (lucroLiquido / custoTotalProduto) * 100 : 0;
    const markupPercent = custoTotalProduto > 0 ? ((precoVenda - custoTotalProduto) / custoTotalProduto) * 100 : 0;
    const markupX = custoTotalProduto > 0 ? precoVenda / custoTotalProduto : 0;

    // Atualizar interface
    atualizarResultadosML({
        precoVenda,
        lucroLiquido,
        taxaMLValor,
        valorImpostos,
        custoTotalProduto,
        retornoProduto,
        markupPercent,

        markupX
    });
}

function atualizarResultadosML(resultados) {
    const precoVendaEl = document.getElementById("precoVendaML");
    const lucroPorVendaEl = document.getElementById("lucroPorVendaML");
    const taxaMercadoLivreEl = document.getElementById("taxaMercadoLivre");
    const valorImpostosEl = document.getElementById("valorImpostosML");
    const custoTotalEl = document.getElementById("custoTotalML");
    const retornoProdutoEl = document.getElementById("retornoProdutoML");
    const markupPercentEl = document.getElementById("markupPercentML");
    const markupXEl = document.getElementById("markupXML");


    if (precoVendaEl) precoVendaEl.textContent = formatarReal(resultados.precoVenda);
    if (lucroPorVendaEl) lucroPorVendaEl.textContent = formatarReal(resultados.lucroLiquido);
    if (taxaMercadoLivreEl) taxaMercadoLivreEl.textContent = formatarReal(resultados.taxaMLValor);
    if (valorImpostosEl) valorImpostosEl.textContent = formatarReal(resultados.valorImpostos);
    if (custoTotalEl) custoTotalEl.textContent = formatarReal(resultados.custoTotalProduto);
    if (retornoProdutoEl) retornoProdutoEl.textContent = formatarPercentual(resultados.retornoProduto);
    if (markupPercentEl) markupPercentEl.textContent = formatarPercentual(resultados.markupPercent);
    if (markupXEl) markupXEl.textContent = `${resultados.markupX.toFixed(2)}X`;


    // Atualizar cor do lucro
    if (lucroPorVendaEl) {
        if (resultados.lucroLiquido > 0) {
            lucroPorVendaEl.style.color = "#4CAF50";
        } else if (resultados.lucroLiquido < 0) {
            lucroPorVendaEl.style.color = "#f44336";
        } else {
            lucroPorVendaEl.style.color = "#ff6b35";
        }
    }
}

function resetarCalculadoraML() {
    const custoProdutoEl = document.getElementById("custoProdutoML");
    const impostosEl = document.getElementById("impostosML");
    const despesasVariaveisEl = document.getElementById("despesasVariaveisML");
    const margemLucroEl = document.getElementById("margemLucroML");
    const taxaMercadoLivreSelectEl = document.getElementById("taxaMercadoLivreSelect");
    const taxaFreteSelectEl = document.getElementById("taxaFreteSelect");
    const margemValueEl = document.getElementById("margemValueML");
    const custosExtrasContainerEl = document.getElementById("custosExtrasContainerML");
    const multiplierEl = document.getElementById("multiplierML");

    if (custoProdutoEl) custoProdutoEl.value = "";
    if (impostosEl) impostosEl.value = "";
    if (despesasVariaveisEl) despesasVariaveisEl.value = "";
    if (margemLucroEl) margemLucroEl.value = 0;
    if (taxaMercadoLivreSelectEl) taxaMercadoLivreSelectEl.selectedIndex = 0;
    if (taxaFreteSelectEl) taxaFreteSelectEl.selectedIndex = 0;
    if (custosExtrasContainerEl) custosExtrasContainerEl.innerHTML = '';
    if (multiplierEl) multiplierEl.textContent = "1x";

    multiplicadorCustoML = 1;

    atualizarMargemValue(margemValueEl, 0);
    calcularPrecoVendaML();
}

// ===== FUNÇÕES AUXILIARES =====
function formatarReal(valor) {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

function formatarPercentual(valor) {
    return `${valor.toFixed(2).replace(".", ",")}%`;
}

function atualizarMargemValue(element, valor) {
    if (element) {
        element.textContent = `${valor}%`;
    }
}

function atualizarCorMargem(slider, valor) {
    if (!slider) return;

    const percentage = (valor - slider.min) / (slider.max - slider.min) * 100;
    let cor = '#ddd'; // cor padrão

    // Definir cor baseada nas faixas especificadas pelo usuário
    if (valor >= 0 && valor <= 5) {
        cor = '#ff0000'; // vermelho
    } else if (valor >= 5.5 && valor <= 7) {
        cor = '#ff8c00'; // laranja escuro
    } else if (valor >= 7.5 && valor <= 12) {
        cor = '#ffa500'; // laranja claro
    } else if (valor >= 12.5 && valor <= 17) {
        cor = '#ffff00'; // amarelo
    } else if (valor >= 17.5 && valor <= 25.5) {
        cor = '#32cd32'; // verde lima
    } else if (valor >= 26 && valor <= 35) {
        cor = '#90ee90'; // verde claro
    } else if (valor >= 35.5 && valor <= 40) {
        cor = '#00ffff'; // ciano
    } else if (valor >= 40.5 && valor <= 51) {
        cor = '#87ceeb'; // azul claro
    } else if (valor >= 51.5 && valor <= 70) {
        cor = '#0000cd'; // azul escuro
    }

    // Aplicar o gradiente com a cor determinada
    slider.style.background = `linear-gradient(to right, ${cor} 0%, ${cor} ${percentage}%, #ddd ${percentage}%, #ddd 100%)`;

    // Atualizar também as variáveis CSS customizadas para o thumb
    slider.style.setProperty('--track-color', cor);
    slider.style.setProperty('--track-fill', `${percentage}%`);
}

function validarEntradaNumerica(input) {
    let valor = input.value;

    // Remove caracteres não numéricos exceto vírgula e ponto
    valor = valor.replace(/[^0-9.,]/g, '');

    // Substitui múltiplas vírgulas/pontos por apenas um
    valor = valor.replace(/[.,]+/g, ',');

    // Garante que só há uma vírgula
    const partes = valor.split(',');
    if (partes.length > 2) {
        valor = partes[0] + ',' + partes.slice(1).join('');
    }

    // Limita casas decimais a 2
    if (partes.length === 2 && partes[1].length > 2) {
        valor = partes[0] + ',' + partes[1].substring(0, 2);
    }

    input.value = valor;
}

function formatarCampo(input) {
    let valor = parseFloat(input.value.replace(",", ".")) || 0;
    input.value = valor.toFixed(2).replace(".", ",");
}

function adicionarCustoExtra(target) {
    const id = `custoExtra-${Date.now()}`;
    const custoExtraWrapper = document.createElement("div");
    custoExtraWrapper.classList.add("custo-extra-wrapper");
    custoExtraWrapper.dataset.id = id;
    custoExtraWrapper.innerHTML = `
        <div class="custo-extra-item">
            <select class="custo-extra-type-selector">
                <option value="real">R$</option>
                <option value="percent">%</option>
            </select>
            <input type="text" class="custo-extra-value" placeholder="0,00">
        </div>
        <button type="button" class="remove-custo-extra-btn">X</button>
    `;

    const container = target === "ML" ? 
        document.getElementById("custosExtrasContainerML") : 
        document.getElementById("custosExtrasContainer");

    container.appendChild(custoExtraWrapper);

    // Adicionar listeners para o novo campo
    const inputElement = custoExtraWrapper.querySelector(".custo-extra-value");
    const typeSelector = custoExtraWrapper.querySelector(".custo-extra-type-selector");
    const removeButton = custoExtraWrapper.querySelector(".remove-custo-extra-btn");

    inputElement.addEventListener("input", function() {
        validarEntradaNumerica(this);
        if (target === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });

    inputElement.addEventListener("blur", function() {
        formatarCampo(this);
        if (target === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });

    typeSelector.addEventListener("change", function() {
        if (target === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });

    removeButton.addEventListener("click", function() {
        custoExtraWrapper.remove();
        if (target === "ML") {
            calcularPrecoVendaML();
        } else {
            calcularPrecoVendaShopee();
        }
    });
}


// Função para gerar o conteúdo da página de planos
function getPlanosContent() {
    return `
        <div class="page-container">
            <div class="page-header">
                <h1><i class="fas fa-crown"></i> Planos e Preços</h1>
                <p>Escolha o plano ideal para o seu negócio</p>
            </div>

            <div class="plans-page-container">
                <div class="plans-grid-page">
                    <div class="plan-card-page">
                        <div class="plan-header">
                            <div class="plan-name">Gratuito</div>
                            <div class="plan-price">R$ 0</div>
                            <div class="plan-period">3 dias de teste</div>
                        </div>
                        <div class="plan-features">
                            <h4>O que está incluído:</h4>
                            <ul>
                                <li><i class="fas fa-check"></i> Calculadora básica</li>
                                <li><i class="fas fa-check"></i> 100 cálculos por mês</li>
                                <li><i class="fas fa-check"></i> Suporte por email</li>
                                <li><i class="fas fa-times" style="color: #dc3545;"></i> Todas as ferramentas</li>
                                <li><i class="fas fa-times" style="color: #dc3545;"></i> Precificação ilimitada</li>
                            </ul>
                        </div>
                        <button class="plan-btn-page" data-plan="free">Começar Teste</button>
                    </div>

                    <div class="plan-card-page popular">
                        <div class="plan-badge-popular">Mais Popular</div>
                        <div class="plan-header">
                            <div class="plan-name">Mensal</div>
                            <div class="plan-price">R$ 27,90</div>
                            <div class="plan-period">por mês</div>
                        </div>
                        <div class="plan-features">
                            <h4>O que está incluído:</h4>
                            <ul>
                                <li><i class="fas fa-check"></i> Todas as ferramentas liberadas</li>
                                <li><i class="fas fa-check"></i> Precificação ilimitada</li>
                                <li><i class="fas fa-check"></i> Calculadoras avançadas</li>
                                <li><i class="fas fa-check"></i> Relatórios detalhados</li>
                                <li><i class="fas fa-check"></i> Suporte prioritário</li>
                            </ul>
                        </div>
                        <button class="plan-btn-page primary" data-plan="monthly">Escolher Mensal</button>
                    </div>

                    <div class="plan-card-page">
                        <div class="plan-header">
                            <div class="plan-name">Trimestral</div>
                            <div class="plan-price">R$ 72,00</div>
                            <div class="plan-period">por trimestre</div>
                            <div class="plan-savings">Economize R$ 11,70</div>
                        </div>
                        <div class="plan-features">
                            <h4>O que está incluído:</h4>
                            <ul>
                                <li><i class="fas fa-check"></i> Todas as ferramentas liberadas</li>
                                <li><i class="fas fa-check"></i> Precificação ilimitada</li>
                                <li><i class="fas fa-check"></i> Calculadoras avançadas</li>
                                <li><i class="fas fa-check"></i> Relatórios detalhados</li>
                                <li><i class="fas fa-check"></i> Suporte prioritário</li>
                            </ul>
                        </div>
                        <button class="plan-btn-page primary" data-plan="quarterly">Escolher Trimestral</button>
                    </div>

                    <div class="plan-card-page best-value">
                        <div class="plan-badge-best">Melhor Custo-Benefício</div>
                        <div class="plan-header">
                            <div class="plan-name">Anual</div>
                            <div class="plan-price">R$ 229,00</div>
                            <div class="plan-period">por ano</div>
                            <div class="plan-savings">Economize R$ 105,80</div>
                        </div>
                        <div class="plan-features">
                            <h4>O que está incluído:</h4>
                            <ul>
                                <li><i class="fas fa-check"></i> Todas as ferramentas liberadas</li>
                                <li><i class="fas fa-check"></i> Precificação ilimitada</li>
                                <li><i class="fas fa-check"></i> Calculadoras avançadas</li>
                                <li><i class="fas fa-check"></i> Relatórios detalhados</li>
                                <li><i class="fas fa-check"></i> Suporte prioritário</li>
                                <li><i class="fas fa-star" style="color: #ffd700;"></i> Acesso antecipado a novas funcionalidades</li>
                            </ul>
                        </div>
                        <button class="plan-btn-page primary" data-plan="yearly">Escolher Anual</button>
                    </div>
                </div>

                <div class="plans-benefits">
                    <h2>Por que escolher o Lucre Certo?</h2>
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <i class="fas fa-calculator"></i>
                            <h3>Cálculos Precisos</h3>
                            <p>Algoritmos avançados para cálculos de precificação precisos em todas as plataformas</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-chart-line"></i>
                            <h3>Relatórios Detalhados</h3>
                            <p>Análises completas de margem de lucro e performance de vendas</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-headset"></i>
                            <h3>Suporte Especializado</h3>
                            <p>Equipe dedicada para ajudar você a maximizar seus resultados</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-sync-alt"></i>
                            <h3>Atualizações Constantes</h3>
                            <p>Novas funcionalidades e melhorias adicionadas regularmente</p>
                        </div>
                    </div>
                </div>

                <div class="faq-plans">
                    <h2>Perguntas Frequentes</h2>
                    <div class="faq-item-plans">
                        <div class="faq-question-plans" onclick="toggleFaqPlans(this)">
                            <h3>Posso cancelar minha assinatura a qualquer momento?</h3>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer-plans">
                            <p>Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento e você continuará tendo acesso até o final do período pago.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item-plans">
                        <div class="faq-question-plans" onclick="toggleFaqPlans(this)">
                            <h3>Como funciona o período de teste gratuito?</h3>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer-plans">
                            <p>O período de teste de 3 dias é totalmente gratuito e não requer cartão de crédito. Você terá acesso limitado às funcionalidades básicas para avaliar a plataforma.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item-plans">
                        <div class="faq-question-plans" onclick="toggleFaqPlans(this)">
                            <h3>Quais formas de pagamento são aceitas?</h3>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer-plans">
                            <p>Aceitamos cartões de crédito (Visa, Mastercard, Elo), PIX e boleto bancário. Todos os pagamentos são processados de forma segura.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para alternar FAQ dos planos
function toggleFaqPlans(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer-plans');
    const icon = element.querySelector('i');

    faqItem.classList.toggle('active');

    if (faqItem.classList.contains('active')) {
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    }
}

// Função para selecionar um plano na página (atualizada)
function selectPlanPage(planType, price) {
    // Mapear os tipos de plano para os IDs corretos
    const planMapping = {
        'mensal': 'monthly',
        'trimestral': 'quarterly', 
        'anual': 'yearly'
    };

    const planId = planMapping[planType];
    if (planId && typeof selectPlan === 'function') {
        selectPlan(planId);
    } else {
        // Fallback para o comportamento anterior se a função não estiver disponível
        alert(`Você selecionou o plano ${planType.toUpperCase()}!\n\nPreço: R$ ${price.toFixed(2)}\n\nRedirecionando para o pagamento...\n\nEm breve você terá acesso a:\n• Todas as ferramentas liberadas\n• Precificação ilimitada\n• Suporte prioritário`);
    }
}


// Conteúdo da página DRE
function getDreContent() {
    return `
        <div class="dre-container">
            <div class="page-header">
                <h1><i class="fas fa-chart-line"></i> Demonstração do Resultado do Exercício (DRE)</h1>
                <p>Calcule e visualize o resultado financeiro da sua empresa de forma profissional</p>
            </div>

            <div class="dre-calculator-wrapper">
                <!-- Seção de Entrada de Dados -->
                <div class="dre-input-section">
                    <h2>Dados de Entrada</h2>
                    
                    <!-- Receitas -->
                    <div class="dre-section">
                        <h3><i class="fas fa-money-bill-wave"></i> Receitas</h3>
                        
                        <div class="input-group">
                            <label for="receitaBruta">Receita Operacional Bruta</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="receitaBruta" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                    </div>

                    <!-- Deduções -->
                    <div class="dre-section">
                        <h3><i class="fas fa-minus-circle"></i> Deduções da Receita Bruta</h3>
                        
                        <div class="input-group">
                            <label for="impostosSobreVendas">Impostos sobre Vendas (ICMS, PIS, COFINS)</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="impostosSobreVendas" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label for="devolucoes">Devoluções e Abatimentos</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="devolucoes" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                    </div>

                    <!-- Custos -->
                    <div class="dre-section">
                        <h3><i class="fas fa-box"></i> Custos dos Produtos/Serviços</h3>
                        
                        <div class="input-group">
                            <label for="cmv">Custo da Mercadoria Vendida (CMV)</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="cmv" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                    </div>

                    <!-- Despesas Operacionais -->
                    <div class="dre-section">
                        <h3><i class="fas fa-cogs"></i> Despesas Operacionais</h3>
                        
                        <div class="input-group">
                            <label for="despesasAdministrativas">Despesas Administrativas</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="despesasAdministrativas" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label for="despesasVendas">Despesas com Vendas</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="despesasVendas" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label for="despesasFinanceiras">Despesas Financeiras</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="despesasFinanceiras" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                    </div>

                    <!-- Impostos sobre o Lucro -->
                    <div class="dre-section">
                        <h3><i class="fas fa-percentage"></i> Impostos sobre o Lucro</h3>
                        
                        <div class="input-group">
                            <label for="irpjCsll">IRPJ e CSLL</label>
                            <div class="input-wrapper">
                                <span class="currency">R$</span>
                                <input type="text" id="irpjCsll" placeholder="0,00" class="dre-input">
                            </div>
                        </div>
                    </div>

                    <div class="dre-actions">
                        <button type="button" id="calcularDre" class="btn-primary">
                            <i class="fas fa-calculator"></i> Calcular DRE
                        </button>
                        <button type="button" id="limparDre" class="btn-secondary">
                            <i class="fas fa-eraser"></i> Limpar Campos
                        </button>
                    </div>
                </div>

                <!-- Seção de Resultados -->
                <div class="dre-results-section">
                    <h2>Demonstração do Resultado</h2>
                    
                    <div class="dre-table">
                        <div class="dre-row">
                            <span class="dre-label">Receita Operacional Bruta</span>
                            <span class="dre-value" id="resultReceitaBruta">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row deduction">
                            <span class="dre-label">(-) Deduções da Receita Bruta</span>
                            <span class="dre-value" id="resultDeducoes">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row subtotal">
                            <span class="dre-label">(=) Receita Operacional Líquida</span>
                            <span class="dre-value" id="resultReceitaLiquida">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row deduction">
                            <span class="dre-label">(-) Custo da Mercadoria Vendida</span>
                            <span class="dre-value" id="resultCmv">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row subtotal">
                            <span class="dre-label">(=) Lucro Bruto</span>
                            <span class="dre-value" id="resultLucroBruto">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row deduction">
                            <span class="dre-label">(-) Despesas Operacionais</span>
                            <span class="dre-value" id="resultDespesasOperacionais">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row subtotal">
                            <span class="dre-label">(=) Resultado Operacional</span>
                            <span class="dre-value" id="resultOperacional">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row deduction">
                            <span class="dre-label">(-) IRPJ e CSLL</span>
                            <span class="dre-value" id="resultIrpjCsll">R$ 0,00</span>
                        </div>
                        
                        <div class="dre-row final-result">
                            <span class="dre-label">(=) Resultado Líquido do Exercício</span>
                            <span class="dre-value" id="resultLiquido">R$ 0,00</span>
                        </div>
                    </div>

                    <!-- Indicadores -->
                    <div class="dre-indicators">
                        <h3>Indicadores de Performance</h3>
                        <div class="indicators-grid">
                            <div class="indicator-card">
                                <span class="indicator-label">Margem Bruta</span>
                                <span class="indicator-value" id="margemBruta">0%</span>
                            </div>
                            <div class="indicator-card">
                                <span class="indicator-label">Margem Operacional</span>
                                <span class="indicator-value" id="margemOperacional">0%</span>
                            </div>
                            <div class="indicator-card">
                                <span class="indicator-label">Margem Líquida</span>
                                <span class="indicator-value" id="margemLiquida">0%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Área para Gráficos -->
                    <div class="dre-charts">
                        <h3>Análise Visual</h3>
                        <div class="charts-container">
                            <div class="chart-wrapper">
                                <h4>Composição das Despesas</h4>
                                <canvas id="despesasChart" width="400" height="300"></canvas>
                            </div>
                            <div class="chart-wrapper">
                                <h4>Estrutura da DRE</h4>
                                <canvas id="estruturaChart" width="400" height="300"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}




// Função para fazer upload de imagem para o Supabase Storage
async function uploadImage(file, userId) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabaseClient.storage
            .from('ad-photos')
            .upload(fileName, file);

        if (error) {
            throw error;
        }

        // Obter URL pública da imagem
        const { data: { publicUrl } } = supabaseClient.storage
            .from('ad-photos')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
    }
}

// Função para salvar cálculo no Supabase (versão aprimorada)
async function saveCalculation(platform) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        showError("Você precisa estar logado para salvar cálculos.");
        return;
    }

    let adName, adPhotoUrl, comment, tags, calculationData;
    let photoFile = null;

    if (platform === 'shopee') {
        adName = document.getElementById("nomeAnuncioShopee")?.value;
        photoFile = document.getElementById("photoFileInputShopee")?.files[0];
        adPhotoUrl = document.getElementById("fotoAnuncioShopee")?.value;
        comment = document.getElementById("comentarioShopee")?.value;
        tags = document.getElementById("tagsShopee")?.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        // Coletar dados da calculadora Shopee
        const custoProduto = parseFloat(document.getElementById("custoProduto")?.value.replace(',', '.')) || 0;
        const impostos = parseFloat(document.getElementById("impostos")?.value.replace(',', '.')) || 0;
        const despesasVariaveis = parseFloat(document.getElementById("despesasVariaveis")?.value.replace(',', '.')) || 0;
        const freteGratis = document.getElementById("freteGratis")?.checked;
        const margemLucro = parseFloat(document.getElementById("margemLucro")?.value) || 0;
        const precoVenda = document.getElementById("precoVenda")?.textContent;
        const lucroPorVenda = document.getElementById("lucroPorVenda")?.textContent;
        const taxaShopee = document.getElementById("taxaShopee")?.textContent;
        const valorImpostos = document.getElementById("valorImpostos")?.textContent;
        const custoTotal = document.getElementById("custoTotal")?.textContent;
        const retornoProduto = document.getElementById("retornoProduto")?.textContent;
        const markupPercent = document.getElementById("markupPercent")?.textContent;
        const markupX = document.getElementById("markupX")?.textContent;

        const custosExtras = [];
        document.querySelectorAll("#custosExtrasContainer .custo-extra-item").forEach(item => {
            const valueInput = item.querySelector(".custo-extra-value");
            const typeSelector = item.querySelector(".custo-extra-type-selector");
            custosExtras.push({
                value: parseFloat(valueInput.value.replace(',', '.')) || 0,
                type: typeSelector.value
            });
        });

        calculationData = {
            inputs: {
                custoProduto, impostos, despesasVariaveis, freteGratis, margemLucro, custosExtras
            },
            results: {
                precoVenda, lucroPorVenda, taxaShopee, valorImpostos, custoTotal, retornoProduto, markupPercent, markupX
            }
        };

    } else if (platform === 'mercadolivre') {
        adName = document.getElementById("nomeAnuncioML")?.value;
        photoFile = document.getElementById("photoFileInputML")?.files[0];
        adPhotoUrl = document.getElementById("fotoAnuncioML")?.value;
        comment = document.getElementById("comentarioML")?.value;
        tags = document.getElementById("tagsML")?.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        // Coletar dados da calculadora Mercado Livre
        const custoProduto = parseFloat(document.getElementById("custoProdutoML")?.value.replace(',', '.')) || 0;
        const impostos = parseFloat(document.getElementById("impostosML")?.value.replace(',', '.')) || 0;
        const despesasVariaveis = parseFloat(document.getElementById("despesasVariaveisML")?.value.replace(',', '.')) || 0;
        const taxaMercadoLivreSelect = document.getElementById("taxaMercadoLivreSelect")?.value;
        const taxaFreteSelect = document.getElementById("taxaFreteSelect")?.value;
        const margemLucro = parseFloat(document.getElementById("margemLucroML")?.value) || 0;
        const precoVenda = document.getElementById("precoVendaML")?.textContent;
        const lucroPorVenda = document.getElementById("lucroPorVendaML")?.textContent;
        const taxaMercadoLivre = document.getElementById("taxaMercadoLivre")?.textContent;
        const valorImpostos = document.getElementById("valorImpostosML")?.textContent;
        const custoTotal = document.getElementById("custoTotalML")?.textContent;
        const retornoProduto = document.getElementById("retornoProdutoML")?.textContent;
        const markupPercent = document.getElementById("markupPercentML")?.textContent;
        const markupX = document.getElementById("markupXML")?.textContent;

        const custosExtras = [];
        document.querySelectorAll("#custosExtrasContainerML .custo-extra-item").forEach(item => {
            const valueInput = item.querySelector(".custo-extra-value");
            const typeSelector = item.querySelector(".custo-extra-type-selector");
            custosExtras.push({
                value: parseFloat(valueInput.value.replace(',', '.')) || 0,
                type: typeSelector.value
            });
        });

        calculationData = {
            inputs: {
                custoProduto, impostos, despesasVariaveis, taxaMercadoLivreSelect, taxaFreteSelect, margemLucro, custosExtras
            },
            results: {
                precoVenda, lucroPorVenda, taxaMercadoLivre, valorImpostos, custoTotal, retornoProduto, markupPercent, markupX
            }
        };
    }

    // Validar se o nome do anúncio foi preenchido
    if (!adName || adName.trim() === '') {
        showError("Por favor, preencha o nome do anúncio.");
        return;
    }

    try {
        // Fazer upload da imagem se foi selecionada
        if (photoFile) {
            adPhotoUrl = await uploadImage(photoFile, user.id);
        }

        const { data, error } = await supabaseClient
            .from('saved_calculations')
            .insert([
                {
                    user_id: user.id,
                    platform: platform,
                    ad_name: adName,
                    ad_photo_url: adPhotoUrl,
                    comment: comment,
                    tags: tags,
                    calculation_data: calculationData
                }
            ]);

        if (error) {
            throw error;
        }

        showSuccess("Cálculo salvo com sucesso!");
        
        // Limpar campos de salvamento
        clearSaveFields(platform);
        
        // Recarregar lista de cálculos salvos
        loadSavedCalculations(platform);
        
        console.log("Cálculo salvo:", data);
    } catch (error) {
        console.error("Erro ao salvar cálculo:", error);
        showError("Erro ao salvar cálculo: " + error.message);
    }
}

// Função para limpar campos de salvamento
function clearSaveFields(platform) {
    if (platform === 'shopee') {
        document.getElementById("nomeAnuncioShopee").value = '';
        document.getElementById("photoFileInputShopee").value = '';
        document.getElementById("fotoAnuncioShopee").value = '';
        document.getElementById("comentarioShopee").value = '';
        document.getElementById("tagsShopee").value = '';
    } else if (platform === 'mercadolivre') {
        document.getElementById("nomeAnuncioML").value = '';
        document.getElementById("photoFileInputML").value = '';
        document.getElementById("fotoAnuncioML").value = '';
        document.getElementById("comentarioML").value = '';
        document.getElementById("tagsML").value = '';
    }
}



// Função para carregar cálculos salvos
async function loadSavedCalculations(platform) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    try {
        const { data, error } = await supabaseClient
            .from('saved_calculations')
            .select('*')
            .eq('user_id', user.id)
            .eq('platform', platform)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        displaySavedCalculations(data, platform);
    } catch (error) {
        console.error('Erro ao carregar cálculos salvos:', error);
    }
}

// Função para exibir cálculos salvos na interface
function displaySavedCalculations(calculations, platform) {
    const listId = platform === 'shopee' ? 'savedCalculationsListShopee' : 'savedCalculationsListML';
    const headerId = platform === 'shopee' ? 'savedCalculationsShopee' : 'savedCalculationsML';
    const listElement = document.getElementById(listId);
    const headerElement = document.querySelector(`#${headerId} .saved-calculations-header span`);

    if (!listElement || !headerElement) return;

    // Atualizar contador no header
    headerElement.textContent = `Anúncios Salvos (${calculations.length})`;

    if (calculations.length === 0) {
        listElement.innerHTML = `
            <div class="no-calculations">
                <i class="fas fa-calculator"></i>
                <p>Nenhum cálculo salvo ainda</p>
            </div>
        `;
        return;
    }

    listElement.innerHTML = calculations.map(calc => {
        const createdDate = new Date(calc.created_at).toLocaleDateString('pt-BR');
        const precoVenda = calc.calculation_data?.results?.precoVenda || 'N/A';
        const lucro = calc.calculation_data?.results?.lucroPorVenda || 'N/A';
        
        return `
            <div class="calculation-item" data-id="${calc.id}">
                <div class="calculation-photo">
                    ${calc.ad_photo_url ? 
                        `<img src="${calc.ad_photo_url}" alt="${calc.ad_name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` : 
                        '<i class="fas fa-image"></i>'
                    }
                </div>
                <div class="calculation-info">
                    <div class="calculation-name">${calc.ad_name || 'Sem nome'}</div>
                    <div class="calculation-meta">
                        <span>Preço: ${precoVenda}</span>
                        <span>Lucro: ${lucro}</span>
                        <span>${createdDate}</span>
                    </div>
                </div>
                <div class="calculation-actions">
                    <button class="calculation-action-btn load" onclick="loadCalculation('${calc.id}', '${platform}')">
                        Carregar
                    </button>
                    <button class="calculation-action-btn delete" onclick="deleteCalculation('${calc.id}', '${platform}')">
                        Excluir
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Função para carregar um cálculo específico
async function loadCalculation(calculationId, platform) {
    try {
        const { data, error } = await supabaseClient
            .from('saved_calculations')
            .select('*')
            .eq('id', calculationId)
            .single();

        if (error) {
            throw error;
        }

        // Preencher campos da calculadora com os dados salvos
        fillCalculatorFields(data, platform);
        
        showSuccess("Cálculo carregado com sucesso!");
    } catch (error) {
        console.error('Erro ao carregar cálculo:', error);
        showError("Erro ao carregar cálculo: " + error.message);
    }
}

// Função para preencher campos da calculadora
function fillCalculatorFields(calculation, platform) {
    const inputs = calculation.calculation_data.inputs;
    
    if (platform === 'shopee') {
        // Preencher campos Shopee
        if (inputs.custoProduto) document.getElementById("custoProduto").value = inputs.custoProduto.toString().replace('.', ',');
        if (inputs.impostos) document.getElementById("impostos").value = inputs.impostos.toString().replace('.', ',');
        if (inputs.despesasVariaveis) document.getElementById("despesasVariaveis").value = inputs.despesasVariaveis.toString().replace('.', ',');
        if (inputs.freteGratis !== undefined) document.getElementById("freteGratis").checked = inputs.freteGratis;
        if (inputs.margemLucro) document.getElementById("margemLucro").value = inputs.margemLucro;
        
        // Preencher campos de salvamento
        document.getElementById("nomeAnuncioShopee").value = calculation.ad_name || '';
        document.getElementById("fotoAnuncioShopee").value = calculation.ad_photo_url || '';
        document.getElementById("comentarioShopee").value = calculation.comment || '';
        document.getElementById("tagsShopee").value = calculation.tags ? calculation.tags.join(', ') : '';
        
        // Recalcular
        calcularPrecoVendaShopee();
        
    } else if (platform === 'mercadolivre') {
        // Preencher campos Mercado Livre
        if (inputs.custoProduto) document.getElementById("custoProdutoML").value = inputs.custoProduto.toString().replace('.', ',');
        if (inputs.impostos) document.getElementById("impostosML").value = inputs.impostos.toString().replace('.', ',');
        if (inputs.despesasVariaveis) document.getElementById("despesasVariaveisML").value = inputs.despesasVariaveis.toString().replace('.', ',');
        if (inputs.taxaMercadoLivreSelect) document.getElementById("taxaMercadoLivreSelect").value = inputs.taxaMercadoLivreSelect;
        if (inputs.taxaFreteSelect) document.getElementById("taxaFreteSelect").value = inputs.taxaFreteSelect;
        if (inputs.margemLucro) document.getElementById("margemLucroML").value = inputs.margemLucro;
        
        // Preencher campos de salvamento
        document.getElementById("nomeAnuncioML").value = calculation.ad_name || '';
        document.getElementById("fotoAnuncioML").value = calculation.ad_photo_url || '';
        document.getElementById("comentarioML").value = calculation.comment || '';
        document.getElementById("tagsML").value = calculation.tags ? calculation.tags.join(', ') : '';
        
        // Recalcular
        calcularPrecoVendaML();
    }
}

// Função para excluir um cálculo
async function deleteCalculation(calculationId, platform) {
    if (!confirm('Tem certeza que deseja excluir este cálculo?')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('saved_calculations')
            .delete()
            .eq('id', calculationId);

        if (error) {
            throw error;
        }

        showSuccess("Cálculo excluído com sucesso!");
        loadSavedCalculations(platform);
    } catch (error) {
        console.error('Erro ao excluir cálculo:', error);
        showError("Erro ao excluir cálculo: " + error.message);
    }
}

// Função para mostrar mensagem de sucesso
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.getElementById('message-styles')) {
        const styles = document.createElement('style');
        styles.id = 'message-styles';
        styles.textContent = `
            .success-message, .error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideIn 0.3s ease-out;
            }
            
            .success-message {
                background: #28a745;
            }
            
            .error-message {
                background: #dc3545;
            }
            
            .success-content, .error-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(successDiv);
    
    // Auto-remover após 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Função para mostrar mensagem de erro
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

