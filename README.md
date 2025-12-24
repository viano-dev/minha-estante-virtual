# 📚 Minha Estante Virtual

![Project Status](https://img.shields.io/badge/status-concluído-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

Uma aplicação web interativa e "aesthetic" para catalogar livros lidos. O projeto simula uma estante física onde o usuário pode adicionar livros, escrever resenhas pessoais e manter seu histórico de leitura salvo na nuvem.

🔗 **Acesse o projeto online:** [Clique aqui para ver a Estante](https://viano-dev.github.io/minha-estante-virtual/)

## 🖼️ Screenshots

<div align="center">
  <img src="https://github.com/viano-dev/minha-estante-virtual/blob/main/screenshot-1.png?raw=true" alt="Visualização Desktop" width="700">
  <br>
  <em>Visualização no Desktop com o Modal de detalhes aberto</em>
</div>

<br>

<div align="center">
   <img src="https://github.com/viano-dev/minha-estante-virtual/blob/main/screenshot-mobile.jpeg?raw=true" alt="Visualização Mobile" width="300">
   <br>
   <em>Visualização Responsiva (Mobile)</em>
</div>

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando conceitos de **Front-end** e **Serverless** (Firebase):

* **HTML5 & CSS3:** Semântica, Flexbox, animações e design responsivo.
* **JavaScript (ES6+):** Manipulação do DOM, Lógica de programação e Módulos.
* **Google Firebase Authentication:** Sistema de login seguro com conta Google.
* **Google Firestore (NoSQL):** Banco de dados em nuvem para persistência dos dados.
* **LocalStorage:** Para gerenciamento de dados no "Modo Convidado".
* **Glassmorphism UI:** Estilização moderna com efeitos de vidro fosco.

## ✨ Funcionalidades

- **Autenticação Híbrida:**
  - 👤 **Modo Convidado:** Permite testar a aplicação sem login (dados salvos no navegador).
  - ☁️ **Login Google:** Sincroniza a estante na nuvem, permitindo acesso via PC e Celular.
- **Gerenciamento de Livros:** Adicionar, visualizar e excluir livros.
- **Diário de Leitura (Modal):** Ao clicar em um livro, abre-se um cartão onde é possível salvar uma opinião/resenha sobre a obra.
- **Design Dinâmico:** Os livros são gerados com cores e alturas aleatórias para simular uma biblioteca real.
- **Responsividade:** Layout adaptável para telas de desktop e smartphones.

## 🚀 Como rodar o projeto localmente

1. Clone o repositório:
   ```bash
   git clone [https://github.com/viano-dev/minha-estante-virtual.git](https://github.com/viano-dev/minha-estante-virtual.git)
Configuração do Firebase:

Crie um projeto no Firebase Console.

Crie um arquivo script.js (ou use o existente) e adicione suas credenciais no objeto firebaseConfig.

Abra o arquivo index.html no seu navegador ou use uma extensão como o Live Server no VS Code.

🧠 Aprendizados
Durante o desenvolvimento deste projeto, pratiquei:

Integração entre Front-end e Banco de Dados (Firestore).

Lógica de autenticação e proteção de rotas/dados.

Manipulação de arrays e objetos complexos em JavaScript.

Criação de Modais e interfaces interativas sem frameworks.

Tratamento de erros e feedback visual para o usuário.

📝 Autor
Desenvolvido por Flaviano Alves. 
