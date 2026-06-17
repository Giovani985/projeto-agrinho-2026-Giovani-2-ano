document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnPocao = document.getElementById('btn-pocao');
    const qtdPocaoTxt = document.getElementById('qtd-pocao');
    const telaJogo = document.getElementById('tela-jogo');
    const placarTxt = document.getElementById('placar');
    const vidaTxt = document.getElementById('vida');

    let pontos = 0;
    let vidaPlantacao = 100;
    let pocoesRestantes = 3;
    let jogoAtivo = false;
    let intervaloCriacao;

    btnIniciar.addEventListener('click', () => {
        if (!jogoAtivo) {
            iniciarJogo();
        }
    });

    // Lógica do clique na poção
    btnPocao.addEventListener('click', () => {
        if (jogoAtivo && pocoesRestantes > 0 && vidaPlantacao < 100) {
            usarPocao();
        }
    });

    function iniciarJogo() {
        pontos = 0;
        vidaPlantacao = 100;
        pocoesRestantes = 3;
        jogoAtivo = true;
        
        telaJogo.innerHTML = ''; 
        placarTxt.textContent = pontos;
        vidaTxt.textContent = vidaPlantacao + '%';
        vidaTxt.style.color = 'inherit';
        
        qtdPocaoTxt.textContent = pocoesRestantes;
        btnPocao.disabled = false; // Ativa o botão de poção
        btnIniciar.textContent = 'Reiniciar Jogo';

        desenharPlantacao();
        intervaloCriacao = setInterval(criarInseto, 1200);
    }

    function desenharPlantacao() {
        const containerPlantas = document.createElement('div');
        containerPlantas.classList.add('plantacao-fundo');
        const totalPlantas = 42; 

        for (let i = 0; i < totalPlantas; i++) {
            const planta = document.createElement('div');
            planta.classList.add('planta-milho');
            planta.textContent = '🌽';
            containerPlantas.appendChild(planta);
        }
        telaJogo.appendChild(containerPlantas);
    }

    function usarPocao() {
        pocoesRestantes--;
        qtdPocaoTxt.textContent = pocoesRestantes;

        vidaPlantacao += 30; // Cura 30% da vida
        if (vidaPlantacao > 100) {
            vidaPlantacao = 100; // Não deixa passar de 100%
        }

        vidaTxt.textContent = vidaPlantacao + '%';
        
        // Atualiza a cor do texto de saúde se sair da zona de perigo
        if (vidaPlantacao > 40) {
            vidaTxt.style.color = 'inherit';
        }

        // Se acabarem as poções, desativa o botão
        if (pocoesRestantes === 0) {
            btnPocao.disabled = true;
        }
    }

    function criarInseto() {
        if (!jogoAtivo) return;

        const inseto = document.createElement('div');
        inseto.classList.add('inseto');
        inseto.textContent = '🐛';

        const larguraMax = telaJogo.clientWidth - 45;
        const alturaMax = telaJogo.clientHeight - 45;
        
        inseto.style.left = Math.floor(Math.random() * larguraMax) + 'px';
        inseto.style.top = Math.floor(Math.random() * alturaMax) + 'px';

        inseto.addEventListener('click', (e) => {
            e.stopPropagation();
            pontos += 10;
            placarTxt.textContent = pontos;
            inseto.remove();
        });

        telaJogo.appendChild(inseto);

        setTimeout(() => {
            if (inseto.parentNode === telaJogo && jogoAtivo) {
                inseto.remove();
                danificarPlantacao();
            }
        }, 2500);
    }

    function danificarPlantacao() {
        vidaPlantacao -= 20;
        if (vidaPlantacao <= 0) {
            vidaPlantacao = 0;
            fimDeJogo();
        }
        vidaTxt.textContent = vidaPlantacao + '%';
        
        if (vidaPlantacao <= 40) {
            vidaTxt.style.color = '#e74c3c';
        }
    }

    function fimDeJogo() {
        jogoAtivo = false;
        clearInterval(intervaloCriacao);
        btnPocao.disabled = true; // Desativa a poção ao perder
        telaJogo.innerHTML = `<div style="position: relative; z-index: 10; padding-top: 100px; font-weight: bold; color: #e74c3c; font-size: 20px;">
                                💥 FIM DE JOGO!<br>Os bixinhos destruíram a plantação.<br>Pontuação final: ${pontos}
                              </div>`;
        btnIniciar.textContent = 'Jogar Novamente';
    }
});