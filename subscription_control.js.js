// Função para aplicar bloqueios (free user)
function applyStrictFreeUserLimitations() {
    console.log("🔒 Usuário sem assinatura, aplicando limitações...");

    // Exemplo: bloquear calculadora
    const calcContainer = document.querySelector(".calculator-container");
    if (calcContainer && !calcContainer.querySelector(".premium-overlay")) {
        const overlay = document.createElement("div");
        overlay.className = "premium-overlay";
        overlay.innerHTML = `
            <div class="overlay-content">
                <h2>🚫 Recurso exclusivo para assinantes</h2>
                <p>Adquira um plano para desbloquear esta funcionalidade.</p>
                <button onclick="loadPage('planos')">Ver Planos</button>
            </div>
        `;
        calcContainer.appendChild(overlay);
    }
}

// Função para remover bloqueios (usuário premium)
function removeLimitations() {
    console.log("✅ Usuário com assinatura ativa, liberando tudo...");

    document.querySelectorAll(".premium-overlay").forEach(el => el.remove());
}

// Verifica status da assinatura do usuário
async function checkUserSubscriptionStatus() {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        applyStrictFreeUserLimitations();
        return;
    }

    const { data, error } = await supabaseClient
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

    if (error) {
        console.error("Erro ao verificar assinatura:", error);
        applyStrictFreeUserLimitations();
        return;
    }

    if (!data) {
        applyStrictFreeUserLimitations();
    } else {
        removeLimitations();
    }
}
