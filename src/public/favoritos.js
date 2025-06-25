let postParaRemover = null;

// Exemplo de posts favoritos (em simulação)
const postsFavoritos = JSON.parse(localStorage.getItem("favoritos")) || [
  {
    id: 1,
    autor: "Autor_04",
    data: "1 de jun.",
    titulo: "Tentando fazer com um LLM",
    comentarios: 83,
    likes: 102
  },
  {
    id: 2,
    autor: "Autor_04",
    data: "3 de jun.",
    titulo: "Ressurgimento do design de software em 2025?",
    comentarios: 83,
    likes: 102
  }
];

function renderFavoritos() {
  const container = document.getElementById("favoritos-container");
  container.innerHTML = "";

  postsFavoritos.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("post-card");
    div.innerHTML = `
      <div><strong>${post.autor}</strong> <span style="float:right;">${post.data}</span></div>
      <h3>${post.titulo}</h3>
      <p>💬 ${post.comentarios} comentários | ${post.likes} Likes 💜</p>
      <div class="remove" onclick="abrirModal(${post.id})">🗑️</div>
    `;
    container.appendChild(div);
  });
}

function abrirModal(id) {
  postParaRemover = id;
  document.getElementById("modal-confirmacao").style.display = "flex";
}

function cancelarRemocao() {
  postParaRemover = null;
  document.getElementById("modal-confirmacao").style.display = "none";
}

function confirmarRemocao() {
  const index = postsFavoritos.findIndex(p => p.id === postParaRemover);
  if (index > -1) {
    postsFavoritos.splice(index, 1);
    localStorage.setItem("favoritos", JSON.stringify(postsFavoritos));
    renderFavoritos();
  }
  cancelarRemocao();
}

function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}

function abrirPost(titulo, autor, data, comentarios, likes) {
  const postData = { titulo, autor, data, comentarios, likes };
  localStorage.setItem('postSelecionado', JSON.stringify(postData));
  window.location.href = 'post.html';
}

function abrirModalLogoff() {
  document.getElementById('modalLogoff').classList.remove('hidden');
}

function fecharModalLogoff() {
  document.getElementById('modalLogoff').classList.add('hidden');
}

function confirmarLogoff() {
  // Redireciona para logout ou realiza outra ação
  window.location.href = 'index.html'; // ou 'login.html'
}


renderFavoritos();
