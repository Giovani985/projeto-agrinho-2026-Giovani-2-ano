document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos da tela
    const btnIniciar = document.getElementById('btn-iniciar');
    const telaJogo = document.getElementById('tela-jogo');
    const placarTxt = document.getElementById('placar');
    const vidaTxt = document.getElementById('vida');

    let pontos = 0;
    let vidaPlantacao = 100;
    let jogoAtivo = false;
    let intervaloCriacao;

    // Inicia o jogo ao clicar no botão
    btnIniciar.addEventListener('click', () => {
        if (!jogoAtivo) {
            iniciarJogo();
        }
    });

    function iniciarJogo() {
        pontos = 0;
        vidaPlantacao = 100;
        jogoAtivo = true;
        telaJogo.innerHTML = ''; // Limpa a tela
        placarTxt.textContent = pontos;
        vidaTxt.textContent = vidaPlantacao + '%';
        vidaTxt.style.color = 'inherit';
        btnIniciar.textContent = 'Reiniciar Jogo';

        // Cria um novo inseto a cada 1.2 segundos
        intervaloCriacao = setInterval(criarInseto, 1200);
    }

    function criarInseto() {
        if (!jogoAtivo) return;

        const inseto = document.createElement('div');
        inseto.classList.add('inseto');
        inseto.textContent = '🐛'; // Emoji do bixinho

        // Define uma posição aleatória dentro da tela do jogo
        const larguraMax = telaJogo.clientWidth - 40;
        const alturaMax = telaJogo.clientHeight - 40;
        
        inseto.style.left = Math.floor(Math.random() * larguraMax) + 'px';
        inseto.style.top = Math.floor(Math.random() * alturaMax) + 'px';

        // Se o jogador clicar no bixinho (eliminar/jogar produto)
        inseto.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita cliques duplicados
            pontos += 10;
            placarTxt.textContent = pontos;
            inseto.remove(); // Remove o bixinho da tela
        });

        telaJogo.appendChild(inseto);

        // Se o jogador não clicar em 2.5 segundos, o bixinho come o milho e some
        setTimeout(() => {
            if (inseto.parentNode === telaJogo && jogoAtivo) {
                inseto.remove();
                danificarPlantacao();
            }
        }, 2500);
    }

    function danificarPlantacao() {
        vidaPlantacao -= 20; // Perde 20% de vida
        if (vidaPlantacao <= 0) {
            vidaPlantacao = 0;
            fimDeJogo();
        }
        vidaTxt.textContent = vidaPlantacao + '%';
        
        if (vidaPlantacao <= 40) {
            vidaTxt.style.color = '#e74c3c'; // Fica vermelho se estiver perigoso
        }
    }

    function fimDeJogo() {
        jogoAtivo = false;
        clearInterval(intervaloCriacao);
        telaJogo.innerHTML = `<div style="padding-top: 100px; font-weight: bold; color: #e74c3c; font-size: 20px;">
                                💥 FIM DE JOGO!<br>Os bixinhos destruíram a plantação.<br>Pontuação final: ${pontos}
                              </div>`;
        btnIniciar.textContent = 'Jogar Novamente';
    }
});