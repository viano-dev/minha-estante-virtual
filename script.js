// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- CONFIGURAÇÃO DO FIREBASE ---
// ⚠️ MANTENHA SUAS CHAVES AQUI! NÃO APAGUE!
// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCrNxN7pdvofENzxN5U4f0rc4t4DhbZPJE",
    authDomain: "minha-estante-web.firebaseapp.com",
    projectId: "minha-estante-web",
    storageBucket: "minha-estante-  web.firebasestorage.app",
    messagingSenderId: "439439834776",
    appId: "1:439439834776:web:6b4951c12f85e4e6c99aed"
  };


// Se você já tem as chaves no seu arquivo, apenas verifique se as funções abaixo (salvar/carregar) estão iguais a este código.

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 
const provider = new GoogleAuthProvider();

// --- VARIÁVEIS GLOBAIS ---
const LIMITE_LIVROS = 20;
let prateleiraSelecionada = null;
let livroAtualSendoEditado = null;
let usuarioAtual = null; 

// --- SISTEMA DE LOGIN ---

document.getElementById('btn-login').addEventListener('click', () => {
    signInWithPopup(auth, provider).catch((error) => {
        console.error("Erro:", error);
        alert("Erro no login Google.");
    });
});

document.getElementById('btn-convidado').addEventListener('click', () => {
    usuarioAtual = { displayName: 'Visitante', uid: 'guest', isAnonymous: true };
    atualizarInterface(usuarioAtual);
});

document.getElementById('btn-logout').addEventListener('click', () => {
    if (usuarioAtual && !usuarioAtual.isAnonymous) {
        signOut(auth);
    } else {
        usuarioAtual = null;
        atualizarInterface(null); 
    }
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        usuarioAtual = user;
        await atualizarInterface(user);
    } else {
        if (!usuarioAtual || !usuarioAtual.isAnonymous) {
            atualizarInterface(null);
        }
    }
});

async function atualizarInterface(user) {
    const areaBotoesLogin = document.getElementById('area-login-botoes');
    const areaUsuario = document.getElementById('area-usuario');
    const areaControles = document.getElementById('area-controles');
    const movelBiblioteca = document.getElementById('movel-biblioteca');
    const nomeUsuarioSpan = document.getElementById('nome-usuario');

    if (user) {
        nomeUsuarioSpan.innerText = user.displayName || "Visitante";
        areaBotoesLogin.style.display = 'none';
        areaUsuario.style.display = 'block';
        areaControles.style.display = 'block';
        movelBiblioteca.style.display = 'flex';

        await carregarDados(); 
    } else {
        areaBotoesLogin.style.display = 'flex';
        areaUsuario.style.display = 'none';
        areaControles.style.display = 'none';
        movelBiblioteca.innerHTML = ''; 
        movelBiblioteca.style.display = 'none';
    }
}

// --- FUNÇÕES DE SALVAR/CARREGAR (CORRIGIDAS 🛠️) ---

async function salvarDados() {
    if (!usuarioAtual) return;

    // 1. Prepara os dados
    const movelBiblioteca = document.getElementById('movel-biblioteca');
    const prateleiras = movelBiblioteca.getElementsByClassName('prateleira');
    let dadosDaBiblioteca = [];

    for (let i = 0; i < prateleiras.length; i++) {
        let livrosNaPrateleira = [];
        const livros = prateleiras[i].getElementsByClassName('livro');
        for (let j = 0; j < livros.length; j++) {
            livrosNaPrateleira.push({
                texto: livros[j].innerText,
                cor: livros[j].style.backgroundColor,
                altura: livros[j].style.height,
                autor: livros[j].dataset.autor, 
                opiniao: livros[j].dataset.opiniao
            });
        }
        dadosDaBiblioteca.push(livrosNaPrateleira);
    }

    // 2. Decide ONDE salvar
    if (usuarioAtual.isAnonymous) {
        localStorage.setItem('minhaBibliotecaVirtual_Guest', JSON.stringify(dadosDaBiblioteca));
    } else {
        try {
            // CORREÇÃO AQUI: Usamos JSON.stringify para transformar a lista em Texto
            // Isso evita o erro de "Nested Arrays" do Firestore
            const dadosEmTexto = JSON.stringify(dadosDaBiblioteca);

            await setDoc(doc(db, "usuarios", usuarioAtual.uid), {
                bibliotecaJSON: dadosEmTexto 
            });
            console.log("Salvo na nuvem com sucesso!");
        } catch (e) {
            console.error("Erro ao salvar na nuvem: ", e);
            alert("Erro ao salvar! Verifique o console (F12) para detalhes.");
        }
    }
}

async function carregarDados() {
    const movelBiblioteca = document.getElementById('movel-biblioteca');
    movelBiblioteca.innerHTML = ''; 

    let dadosDaBiblioteca = null;

    // 1. Decide DE ONDE pegar
    if (usuarioAtual.isAnonymous) {
        const dadosLocais = localStorage.getItem('minhaBibliotecaVirtual_Guest');
        if (dadosLocais) dadosDaBiblioteca = JSON.parse(dadosLocais);
    } else {
        try {
            const docRef = doc(db, "usuarios", usuarioAtual.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // CORREÇÃO AQUI: Pegamos o texto e transformamos de volta em Lista
                const dadosTexto = docSnap.data().bibliotecaJSON;
                if (dadosTexto) {
                    dadosDaBiblioteca = JSON.parse(dadosTexto);
                }
            }
        } catch (e) {
            console.error("Erro ao ler da nuvem:", e);
        }
    }

    // 2. Constrói a tela
    if (!dadosDaBiblioteca) {
        for(let k=0; k<4; k++) criarNovaPrateleira(movelBiblioteca);
    } else {
        dadosDaBiblioteca.forEach((livrosDessaPrateleira) => {
            const novaPrateleira = criarNovaPrateleira(movelBiblioteca);
            livrosDessaPrateleira.forEach((dadosLivro) => {
                criarVisualLivro(dadosLivro.texto, dadosLivro.cor, dadosLivro.altura, novaPrateleira, dadosLivro.autor, dadosLivro.opiniao);
            });
        });
        while (movelBiblioteca.childElementCount < 4) {
            criarNovaPrateleira(movelBiblioteca);
        }
    }
}

// --- RESTO DO CÓDIGO (Igual) ---

document.getElementById('btn-adicionar').addEventListener('click', adicionarLivro);
document.getElementById('btn-modal-salvar').addEventListener('click', salvarOpiniao);
document.getElementById('btn-modal-excluir').addEventListener('click', excluirLivroAberto);
document.querySelector('.fechar-modal').addEventListener('click', fecharModal);

window.onclick = function(event) {
    const modal = document.getElementById('modal-livro');
    if (event.target == modal) fecharModal();
}

function adicionarLivro() {
    const tituloInput = document.getElementById('titulo');
    const autorInput = document.getElementById('autor');
    const nomeDoLivro = tituloInput.value; 
    const nomeDoAutor = autorInput.value;

    if (nomeDoLivro === '' || nomeDoAutor === '') {
        alert('Por favor, preencha tudo!');
        return;
    }

    const movelBiblioteca = document.getElementById('movel-biblioteca');
    const todasPrateleiras = movelBiblioteca.getElementsByClassName('prateleira');
    let prateleiraAlvo = null;

    if (prateleiraSelecionada !== null) {
        if (prateleiraSelecionada.childElementCount < LIMITE_LIVROS) {
            prateleiraAlvo = prateleiraSelecionada;
        } else {
            alert('Essa prateleira encheu!');
            return;
        }
    } else {
        if (todasPrateleiras.length === 0) criarNovaPrateleira(movelBiblioteca);
        const prateleirasAtualizadas = movelBiblioteca.getElementsByClassName('prateleira');
        for (let i = 0; i < prateleirasAtualizadas.length; i++) {
            if (prateleirasAtualizadas[i].childElementCount < LIMITE_LIVROS) {
                prateleiraAlvo = prateleirasAtualizadas[i];
                break;
            }
        }
    }

    if (prateleiraAlvo === null) {
        prateleiraAlvo = criarNovaPrateleira(movelBiblioteca);
    }

    const corAleatoria = '#' + Math.floor(Math.random()*16777215).toString(16);
    const alturaAleatoria = `${Math.floor(Math.random() * (125 - 90 + 1) + 90)}px`;

    criarVisualLivro(nomeDoLivro, corAleatoria, alturaAleatoria, prateleiraAlvo, nomeDoAutor);
    salvarDados(); 

    tituloInput.value = '';
    autorInput.value = '';
}

function criarNovaPrateleira(container) {
    const novaPrateleira = document.createElement('div');
    novaPrateleira.classList.add('prateleira');
    container.appendChild(novaPrateleira);
    configurarSelecaoDePrateleiras();
    return novaPrateleira;
}

function criarVisualLivro(nome, cor, altura, ondeAdicionar, autor, opiniao = "") {
    const livroDiv = document.createElement('div');
    livroDiv.classList.add('livro');
    livroDiv.innerText = nome;
    livroDiv.style.backgroundColor = cor;
    livroDiv.style.height = altura;
    livroDiv.dataset.autor = autor; 
    livroDiv.dataset.opiniao = opiniao;

    livroDiv.addEventListener('click', function() {
        abrirModal(this);
    });

    ondeAdicionar.appendChild(livroDiv);
}

function abrirModal(elementoLivro) {
    livroAtualSendoEditado = elementoLivro;
    const titulo = elementoLivro.innerText;
    const autor = elementoLivro.dataset.autor || "Desconhecido"; 
    const opiniao = elementoLivro.dataset.opiniao || "";

    document.getElementById('modal-titulo').innerText = titulo;
    document.getElementById('modal-autor').innerText = autor;
    document.getElementById('modal-opiniao').value = opiniao;
    document.getElementById('modal-livro').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-livro').style.display = 'none';
    livroAtualSendoEditado = null;
}

function salvarOpiniao() {
    if (livroAtualSendoEditado) {
        const novaOpiniao = document.getElementById('modal-opiniao').value;
        livroAtualSendoEditado.dataset.opiniao = novaOpiniao;
        salvarDados();
        fecharModal();
        alert("Salvo! 💾");
    }
}

function excluirLivroAberto() {
    if (livroAtualSendoEditado) {
        if(confirm(`Excluir "${livroAtualSendoEditado.innerText}"?`)) {
            livroAtualSendoEditado.parentElement.removeChild(livroAtualSendoEditado);
            salvarDados();
            fecharModal();
        }
    }
}

function configurarSelecaoDePrateleiras() {
    const prateleiras = document.getElementsByClassName('prateleira');
    for (let i = 0; i < prateleiras.length; i++) {
        prateleiras[i].onclick = function(event) {
             if (event.target !== this) return; 
             if (this === prateleiraSelecionada) {
                 this.classList.remove('prateleira-selecionada');
                 prateleiraSelecionada = null;
                 return;
             }
             for (let p of prateleiras) p.classList.remove('prateleira-selecionada');
             this.classList.add('prateleira-selecionada');
             prateleiraSelecionada = this;
        };
    }
}