const LIMITE_LIVROS = 20;
let prateleiraSelecionada = null;

// --- INICIALIZAÇÃO ---
window.onload = function() {
    // Tenta carregar os livros salvos. Se não tiver nada, inicia vazio.
    if (!carregarDados()) {
        configurarSelecaoDePrateleiras(); // Configura o padrão se não tiver save
    }
}

// --- FUNÇÕES DE SALVAMENTO (LOCALSTORAGE) ---

function salvarDados() {
    const movelBiblioteca = document.getElementById('movel-biblioteca');
    const prateleiras = movelBiblioteca.getElementsByClassName('prateleira');
    
    let dadosDaBiblioteca = [];

    // Vamos varrer prateleira por prateleira
    for (let i = 0; i < prateleiras.length; i++) {
        let livrosNaPrateleira = [];
        const livros = prateleiras[i].getElementsByClassName('livro');
        
        // Varrer livro por livro desta prateleira
        for (let j = 0; j < livros.length; j++) {
            livrosNaPrateleira.push({
                texto: livros[j].innerText,
                cor: livros[j].style.backgroundColor,
                altura: livros[j].style.height
            });
        }
        
        // Adiciona o array de livros dessa prateleira nos dados gerais
        dadosDaBiblioteca.push(livrosNaPrateleira);
    }

    // Transforma o array em texto e salva no navegador
    localStorage.setItem('minhaBibliotecaVirtual', JSON.stringify(dadosDaBiblioteca));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem('minhaBibliotecaVirtual');
    
    if (!dadosSalvos) return false; // Não tinha nada salvo

    const dadosDaBiblioteca = JSON.parse(dadosSalvos);
    const movelBiblioteca = document.getElementById('movel-biblioteca');
    
    // Limpa a estante atual (para reconstruir do zero baseada no save)
    movelBiblioteca.innerHTML = '';

    // Reconstrói prateleira por prateleira
    dadosDaBiblioteca.forEach((livrosDessaPrateleira) => {
        // Cria a prateleira
        const novaPrateleira = document.createElement('div');
        novaPrateleira.classList.add('prateleira');
        movelBiblioteca.appendChild(novaPrateleira);

        // Cria os livros dentro dela
        livrosDessaPrateleira.forEach((dadosLivro) => {
            criarVisualLivro(dadosLivro.texto, dadosLivro.cor, dadosLivro.altura, novaPrateleira);
        });
    });

    // Garante que tenhamos pelo menos 4 prateleiras (visual padrão)
    while (movelBiblioteca.childElementCount < 4) {
        const novaPrateleira = document.createElement('div');
        novaPrateleira.classList.add('prateleira');
        movelBiblioteca.appendChild(novaPrateleira);
    }

    // Reativa os cliques nas prateleiras
    configurarSelecaoDePrateleiras();
    return true;
}

// --- FUNÇÕES DE LÓGICA ---

function criarVisualLivro(nome, cor, altura, ondeAdicionar) {
    const livroDiv = document.createElement('div');
    livroDiv.classList.add('livro');
    livroDiv.innerText = nome;
    livroDiv.style.backgroundColor = cor;
    livroDiv.style.height = altura;

    livroDiv.onclick = function() {
        if(confirm(`Deseja remover o livro "${nome}"?`)) {
            livroDiv.parentElement.removeChild(livroDiv);
            salvarDados(); // <--- IMPORTANTE: Salva após remover
        }
    };

    ondeAdicionar.appendChild(livroDiv);
}

function configurarSelecaoDePrateleiras() {
    const prateleiras = document.getElementsByClassName('prateleira');
    
    for (let i = 0; i < prateleiras.length; i++) {
        // Remove listeners antigos para não duplicar
        prateleiras[i].onclick = null; 
        
        prateleiras[i].onclick = function(event) {
            if (event.target !== this) return; 

            if (this === prateleiraSelecionada) {
                this.classList.remove('prateleira-selecionada');
                prateleiraSelecionada = null;
                return;
            }

            for (let p of prateleiras) {
                p.classList.remove('prateleira-selecionada');
            }

            this.classList.add('prateleira-selecionada');
            prateleiraSelecionada = this;
        }
    }
}

function adicionarLivro() {
    const tituloInput = document.getElementById('titulo');
    const autorInput = document.getElementById('autor');
    const nomeDoLivro = tituloInput.value; 

    if (nomeDoLivro === '' || autorInput.value === '') {
        alert('Por favor, preencha o título e o autor!');
        return;
    }

    const movelBiblioteca = document.getElementById('movel-biblioteca');
    const todasPrateleiras = movelBiblioteca.getElementsByClassName('prateleira');
    let prateleiraAlvo = null;

    // Lógica de Seleção
    if (prateleiraSelecionada !== null) {
        if (prateleiraSelecionada.childElementCount < LIMITE_LIVROS) {
            prateleiraAlvo = prateleiraSelecionada;
        } else {
            alert('Essa prateleira encheu! Clique nela novamente para desmarcar.');
            return;
        }
    } else {
        for (let i = 0; i < todasPrateleiras.length; i++) {
            if (todasPrateleiras[i].childElementCount < LIMITE_LIVROS) {
                prateleiraAlvo = todasPrateleiras[i];
                break;
            }
        }
    }

    if (prateleiraAlvo === null) {
        const novaPrateleira = document.createElement('div');
        novaPrateleira.classList.add('prateleira');
        movelBiblioteca.appendChild(novaPrateleira);
        configurarSelecaoDePrateleiras();
        prateleiraAlvo = novaPrateleira;
    }

    // Gera os dados do novo livro
    const corAleatoria = '#' + Math.floor(Math.random()*16777215).toString(16);
    const alturaAleatoria = `${Math.floor(Math.random() * (125 - 90 + 1) + 90)}px`;

    // Cria o visual usando a função auxiliar
    criarVisualLivro(nomeDoLivro, corAleatoria, alturaAleatoria, prateleiraAlvo);

    // Salva tudo no navegador
    salvarDados(); // <--- IMPORTANTE: Salva após adicionar

    tituloInput.value = '';
    autorInput.value = '';
}