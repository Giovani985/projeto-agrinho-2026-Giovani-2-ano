document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btn-iniciar');
    const telaJogo = document.getElementById('tela-jogo');
    const placarTxt = document.getElementById('placar');
    const vidaTxt = document.getElementById('vida');

    let pontos = 0;
    let vidaPlantacao = 100;
    let jogoAtivo = false;
    let intervaloCriacao;

    btnIniciar.addEventListener('click', () => {
        if (!jogoAtivo) {
            iniciarJogo();
        }
    });

    function iniciarJogo() {
        pontos = 0;
        vidaPlantacao = 100;
        jogoAtivo = true;
        telaJogo.innerHTML = ''; // Limpa a tela antiga
        placarTxt.textContent = pontos;
        vidaTxt.textContent = vidaPlantacao + '%';
        vidaTxt.style.color = 'inherit';
        btnIniciar.textContent = 'Reiniciar Jogo';

        // Desenha a plantação de milho no fundo
        desenharPlantacao();

        // Cria um novo inseto a cada 1.2 segundos
        intervaloCriacao = setInterval(criarInseto, 1200);
    }

    function desenharPlantacao() {
        const containerPlantas = document.createElement('div');
        containerPlantas.classList.add('plantacao-fundo');

        // Calcula quantos milhos cabem na tela dinamicamente
        const totalPlantas = 42; 

        for (let i = 0; i < totalPlantas; i++) {
            const planta = document.createElement('div');
            planta.classList.add('planta-milho');
            planta.textContent = '🌽';
            containerPlantas.appendChild(planta);
        }

        telaJogo.appendChild(containerPlantas);
    }

    function criarInseto() {
        if (!jogoAtivo) return;

        const inseto = document.createElement('div');
        inseto.classList.add('inseto');
        inseto.textContent = '🐛'; // Inseto comedor de milho

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

        // Tempo limite para clicar antes do milho sofrer dano
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
        telaJogo.innerHTML = `<div style="position: relative; z-index: 10; padding-top: 100px; font-weight: bold; color: #e74c3c; font-size: 20px;">
                                💥 FIM DE JOGO!<br>Os bixinhos destruíram a plantação.<br>Pontuação final: ${pontos}
                              </div>`;
        btnIniciar.textContent = 'Jogar Novamente';
    }
});