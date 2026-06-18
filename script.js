document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnPocao = document.getElementById('btn-pocao');
    const qtdPocaoTxt = document.getElementById('qtd-pocao');
    const telaJogo = document.getElementById('tela-jogo');
    const placarTxt = document.getElementById('placar');
    const vidaTxt = document.getElementById('vida');
    const tempoTxt = document.getElementById('tempo');

    let pontos = 0;
    let vidaPlantacao = 100;
    let pocoesRestantes = 3;
    let jogoAtivo = false;
    let tempoRestante = 20; // Tempo do desafio
    
    let intervaloCriacao;
    let intervaloCronometro;
    let tempoAtaque = 2500; 

    btnIniciar.addEventListener('click', () => {
        if (!jogoAtivo) {
            iniciarJogo();
        }
    });

    btnPocao.addEventListener('click', () => {
        if (jogoAtivo && pocoesRestantes > 0 && vidaPlantacao < 100) {
            usarPocao();
        }
    });

    function iniciarJogo() {
        pontos = 0;
        vidaPlantacao = 100;
        pocoesRestantes = 3;
        tempoRestante = 20;
        tempoAtaque = 2500; 
        jogoAtivo = true;
        
        telaJogo.innerHTML = ''; 
        placarTxt.textContent = pontos;
        vidaTxt.textContent = vidaPlantacao + '%';
        vidaTxt.style.color = 'inherit';
        tempoTxt.textContent = tempoRestante + 's';
        
        qtdPocaoTxt.textContent = pocoesRestantes;
        btnPocao.disabled = false;
        btnIniciar.textContent = 'Reiniciar';

        desenharPlantacao();
        
        // Intervalos do jogo
        intervaloCriacao = setInterval(criarInseto, 1000); // Insetos surgem um pouco mais rápido
        intervaloCronometro = setInterval(atualizarCronometro, 1000);
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

    function atualizarCronometro() {
        if (!jogoAtivo) return;
        
        tempoRestante--;
        tempoTxt.textContent = tempoRestante + 's';
        
        if (tempoRestante <= 0) {
            fimDeJogo(false); // Fim de jogo por tempo esgotado
        }
    }

    function usarPocao() {
        pocoesRestantes--;
        qtdPocaoTxt.textContent = pocoesRestantes;
        vidaPlantacao += 30; 
        if (vidaPlantacao > 100) vidaPlantacao = 100; 
        vidaTxt.textContent = vidaPlantacao + '%';
        
        tempoAtaque -= 500; 
        
        const aviso = document.createElement('div');
        aviso.style = "position: absolute; width: 100%; text-align: center; top: 10px; color: #e74c3c; font-weight: bold; z-index: 5;";
        aviso.textContent = "⚠️ Lagartas aceleradas!";
        telaJogo.appendChild(aviso);
        setTimeout(() => aviso.remove(), 1200);

        if (vidaPlantacao > 40) vidaTxt.style.color = 'inherit';
        if (pocoesRestantes === 0) btnPocao.disabled = true;
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
        }, tempoAtaque);
    }

    function danificarPlantacao() {
        vidaPlantacao -= 20;
        if (vidaPlantacao <= 0) {
            vidaPlantacao = 0;
            fimDeJogo(true); // Fim de jogo por destruição
        }
        vidaTxt.textContent = vidaPlantacao + '%';
        
        if (vidaPlantacao <= 40) {
            vidaTxt.style.color = '#e74c3c';
        }
    }

    function calcularNota(score) {
        if (score >= 100) return { letra: 'A', cor: '#2ecc71', msg: 'Excelente protetor!' };
        if (score >= 75) return { letra: 'B', cor: '#3498db', msg: 'Bom trabalho no campo!' };
        if (score >= 40) return { letra: 'C', cor: '#f1c40f', msg: 'Pode melhorar o manejo.' };
        return { letra: 'D', cor: '#e74c3c', msg: 'A plantação sofreu muito!' };
    }

    function fimDeJogo(foiDestruido) {
        jogoAtivo = false;
        clearInterval(intervaloCriacao);
        clearInterval(intervaloCronometro);
        btnPocao.disabled = true; 

        const resultadoNota = calcularNota(pontos);

        let mensagemFinal = "";
        if (foiDestruido) {
            mensagemFinal = `💥 A plantação foi destruída antes do tempo!`;
        } else {
            mensagemFinal = `⏰ TEMPO ESGOTADO!`;
        }

        telaJogo.innerHTML = `
            <div style="position: relative; z-index: 10; padding-top: 50px; font-family: sans-serif; color: #2d3436;">
                <h4 style="font-size: 18px; color: ${foiDestruido ? '#e74c3c' : '#2cc71'};">${mensagemFinal}</h4>
                <p style="font-size: 16px; margin: 10px 0;">Pontuação final: <strong>${pontos}</strong></p>
                <div style="font-size: 48px; font-weight: bold; color: ${resultadoNota.cor}; margin: 10px 0;">
                    NOTA ${resultadoNota.letra}
                </div>
                <p style="font-style: italic; color: #7f8c8d;">"${resultadoNota.msg}"</p>
            </div>
        `;
        btnIniciar.textContent = 'Jogar Novamente';
    }
});