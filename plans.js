// plans.js - Funcionalidade dos planos

// Função para mostrar o modal de planos
function showPlansModal() {
    const modal = document.getElementById('plansModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Previne scroll do body
    }
}

// Função para fechar o modal de planos
function closePlansModal() {
    const modal = document.getElementById('plansModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restaura scroll do body
    }
}

// Função para selecionar um plano
function selectPlan(planType) {
    // Aqui você pode implementar a lógica de pagamento/upgrade
    switch (planType) {
        case 'pro':
            alert('Redirecionando para pagamento do Plano Pro...\n\nEm breve você terá acesso a:\n• Cálculos ilimitados\n• Relatórios avançados\n• Suporte prioritário');
            break;
        case 'premium':
            alert('Redirecionando para pagamento do Plano Premium...\n\nEm breve você terá acesso a:\n• Tudo do Pro\n• API de integração\n• Suporte 24/7');
            break;
        default:
            alert('Plano não reconhecido');
    }
    
    // Fechar modal após seleção
    closePlansModal();
    
    // Aqui você pode adicionar integração com gateway de pagamento
    // Por exemplo: Stripe, PagSeguro, Mercado Pago, etc.
}

// Função para atualizar o progresso do plano atual
function updatePlanProgress(used, total) {
    const limitValue = document.querySelector('.limit-value');
    const progressFill = document.querySelector('.progress-fill');
    
    if (limitValue && progressFill) {
        limitValue.textContent = `${used}/${total}`;
        const percentage = (used / total) * 100;
        progressFill.style.width = `${percentage}%`;
        
        // Mudar cor baseado no uso
        if (percentage >= 90) {
            progressFill.style.background = 'linear-gradient(90deg, #dc3545 0%, #c82333 100%)';
        } else if (percentage >= 70) {
            progressFill.style.background = 'linear-gradient(90deg, #ffc107 0%, #e0a800 100%)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #28a745 0%, #20c997 100%)';
        }
    }
}

// Função para atualizar o badge do plano
function updatePlanBadge(planType, planName) {
    const planBadge = document.querySelector('.plan-badge');
    
    if (planBadge) {
        // Remove classes existentes
        planBadge.classList.remove('free', 'pro', 'premium');
        
        // Adiciona nova classe
        planBadge.classList.add(planType);
        
        // Atualiza o texto
        const planText = planBadge.querySelector('span');
        if (planText) {
            planText.textContent = planName;
        }
        
        // Atualiza o ícone
        const planIcon = planBadge.querySelector('i');
        if (planIcon) {
            planIcon.className = getPlanIcon(planType);
        }
    }
}

// Função para obter o ícone do plano
function getPlanIcon(planType) {
    switch (planType) {
        case 'free':
            return 'fas fa-user';
        case 'pro':
            return 'fas fa-star';
        case 'premium':
            return 'fas fa-crown';
        default:
            return 'fas fa-user';
    }
}

// Função para simular dados do usuário (substituir por dados reais da API)
function loadUserPlanData() {
    // Simular dados do usuário
    const userData = {
        planType: 'free',
        planName: 'Plano Gratuito',
        calculationsUsed: 45,
        calculationsLimit: 100
    };
    
    // Atualizar interface
    updatePlanBadge(userData.planType, userData.planName);
    updatePlanProgress(userData.calculationsUsed, userData.calculationsLimit);
}

// Fechar modal ao clicar fora dele
document.addEventListener('click', (e) => {
    const modal = document.getElementById('plansModal');
    if (modal && e.target === modal) {
        closePlansModal();
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePlansModal();
    }
});

// Inicializar dados do plano quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    loadUserPlanData();
});

// Função para incrementar uso de cálculos (chamar quando usuário fizer um cálculo)
function incrementCalculationUsage() {
    const limitValue = document.querySelector('.limit-value');
    if (limitValue) {
        const currentText = limitValue.textContent;
        const [used, total] = currentText.split('/').map(num => parseInt(num));
        
        if (used < total) {
            updatePlanProgress(used + 1, total);
            
            // Salvar no localStorage para persistência
            localStorage.setItem('calculationsUsed', used + 1);
            
            // Verificar se atingiu o limite
            if (used + 1 >= total) {
                setTimeout(() => {
                    alert('Você atingiu o limite de cálculos do seu plano!\n\nFaça upgrade para continuar usando todas as funcionalidades.');
                    showPlansModal();
                }, 1000);
            }
        } else {
            // Usuário já atingiu o limite
            alert('Limite de cálculos atingido!\n\nFaça upgrade para continuar.');
            showPlansModal();
            return false; // Impedir o cálculo
        }
    }
    return true; // Permitir o cálculo
}

// Função para verificar se o usuário pode fazer mais cálculos
function canMakeCalculation() {
    const limitValue = document.querySelector('.limit-value');
    if (limitValue) {
        const currentText = limitValue.textContent;
        const [used, total] = currentText.split('/').map(num => parseInt(num));
        return used < total;
    }
    return true; // Se não conseguir verificar, permitir
}

