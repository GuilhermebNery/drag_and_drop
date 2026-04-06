// 1. Selecionamos os elementos da tela que vamos usar
const campoTexto = document.getElementById('task-input');
const botaoAdicionar = document.getElementById('add-btn');
const colunas = document.querySelectorAll('.drop-zone');

/**
 * Função para criar um novo card de tarefa (o quadradinho branco)
 */
const criarCardDeTarefa = (texto) => {
    // Criamos a div principal do card
    const card = document.createElement('div');
    card.classList.add('task-card');
    card.setAttribute('draggable', 'true'); // Permite que o elemento seja arrastado
    
    // Criamos o texto da tarefa dentro de um span
    const spanTexto = document.createElement('span');
    spanTexto.innerText = texto;
    card.appendChild(spanTexto);

    // Criamos o botão de "X" para deletar
    const botaoDeletar = document.createElement('button');
    botaoDeletar.innerHTML = '&times;'; // O símbolo de "X"
    botaoDeletar.classList.add('delete-btn');
    
    // O que acontece quando clica no X:
    botaoDeletar.onclick = () => {
        card.remove();     // Remove o card da tela
        atualizarContadores(); // Atualiza os números das colunas
    };

    card.appendChild(botaoDeletar);

    // --- EVENTOS DE ARRASTAR O CARD ---

    // Quando começa a arrastar o card
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging'); // Deixa o card meio transparente
    });

    // Quando termina de arrastar
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging'); // Volta ao normal
        atualizarContadores();   // Atualiza os números
    });

    return card;
};

/**
 * Função que adiciona a tarefa digitada no campo
 */
const adicionarNovaTarefa = () => {
    const texto = campoTexto.value.trim(); // Pega o que foi digitado

    if (texto === "") {
        alert("Por favor, digite uma tarefa!");
        return; 
    }

    const colunaTodo = document.getElementById('todo-zone');
    const card = criarCardDeTarefa(texto);
    
    colunaTodo.appendChild(card); // Coloca o card na primeira coluna
    
    campoTexto.value = ""; // Limpa o campo para a próxima
    atualizarContadores();
};

/**
 * Atualiza os números (contadores) em cima das colunas
 */
const atualizarContadores = () => {
    // Para cada zona de drop (os 3 retângulos escuros)
    colunas.forEach((zona) => {
        // Encontra quantos cards existem dentro desta coluna
        const quantidade = zona.querySelectorAll('.task-card').length;
        
        // Descobre qual é o contador certo para essa zona através do ID
        const idDaColuna = zona.id.split('-')[0]; // Pega 'todo', 'doing' ou 'done'
        const contador = document.querySelector(`#${idDaColuna} .counter`);
        
        contador.innerText = quantidade;
    });
};

// --- CONFIGURAÇÃO DOS EVENTOS ---

// Quando clica no botão "Adicionar"
botaoAdicionar.addEventListener('click', adicionarNovaTarefa);

// Quando aperta a tecla "Enter" dentro do campo de texto
campoTexto.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        adicionarNovaTarefa();
    }
});

// --- CONFIGURAÇÃO DO ARRASTAR PARA DENTRO DAS COLUNAS ---

colunas.forEach((zona) => {
    // Quando o card está passando por cima da coluna
    zona.addEventListener('dragover', (evento) => {
        evento.preventDefault(); // Necessário para permitir soltar o card aqui
        zona.classList.add('drag-over'); // Muda a cor de fundo da coluna
        
        const cardSendoArrastado = document.querySelector('.dragging');
        if (cardSendoArrastado) {
            zona.appendChild(cardSendoArrastado); // "Move" o card visualmente
        }
    });

    // Quando o card sai de cima da coluna (sem soltar)
    zona.addEventListener('dragleave', () => {
        zona.classList.remove('drag-over'); // Volta a cor normal
    });

    // Quando o card é solto na coluna
    zona.addEventListener('drop', (evento) => {
        evento.preventDefault();
        zona.classList.remove('drag-over'); // Garante que a cor volte ao normal
        atualizarContadores(); // Atualiza os números das colunas
    });
});

// --- INICIALIZAÇÃO ---
atualizarContadores();
