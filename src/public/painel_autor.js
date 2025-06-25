const postsAutor = [
    {
      id: 1,
      titulo: "Ressurgimento do design de software em 2025?",
      status: "publicado",
      data: "05/06/2025",
      comentarios: 63,
      likes: 102
    },
    {
      id: 2,
      titulo: "Ressurgimento do design de software em 2025?",
      status: "rascunho",
      data: "03/05/2025",
      comentarios: 0,
      likes: 0
    },
    {
      id: 3,
      titulo: "Ressurgimento do design de software em 2025?",
      status: "rascunho",
      data: "01/05/2025",
      comentarios: 0,
      likes: 0
    },
    {
      id: 4,
      titulo: "Ressurgimento do design de software em 2025?",
      status: "publicado",
      data: "01/04/2025",
      comentarios: 10,
      likes: 12
    }
  ];
  
  function renderPainel() {
    const container = document.getElementById("lista-posts");
    container.innerHTML = "";
  
    postsAutor.forEach(post => {
      const div = document.createElement("div");
      div.className = "post-box";
  
      div.innerHTML = `
        <h3>${post.titulo}</h3>
        <div class="post-info">
          <span>Status: <span class="${post.status === 'publicado' ? 'status-publicado' : 'status-rascunho'}">${capitalize(post.status)}</span></span>
          <span>${post.status === 'publicado' ? '📅 ' + post.data : '🛠️ Última edição: ' + post.data}</span>
        </div>
        <div class="post-info">
          <span>💬 ${post.comentarios} comentários</span>
          <span>❤️ ${post.likes} Likes</span>
        </div>
        <div class="post-acoes">
          <button class="btn-editar" onclick='abrirModalEditar(${JSON.stringify(post)})'>Editar</button>
          <button class="btn-excluir" onclick="abrirModalExclusao(${post.id})">Excluir</button>
          ${post.status === 'publicado' ?
            '<button class="btn-despublicar">Despublicar</button>' :
            '<button class="btn-publicar">Publicar</button>'
          }
        </div>
      `;
      container.appendChild(div);
    });
  }
  
  function capitalize(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
  
  function novoPost() {
    alert("Funcionalidade de criar novo post ainda não implementada.");
  }
  
  function novoPost() {
    document.getElementById("modalNovoPost").classList.remove("hidden");
  }
  
  function fecharModal() {
    document.getElementById("modalNovoPost").classList.add("hidden");
  }
  
  function salvarPost() {
    const titulo = document.getElementById("tituloPost").value.trim();
    const conteudo = document.getElementById("conteudoPost").value.trim();
  
    if (!titulo || !conteudo) {
      alert("Preencha todos os campos para salvar.");
      return;
    }
  
    // Simulação: salvar como rascunho
    postsAutor.push({
      id: Date.now(),
      titulo: titulo,
      status: "rascunho",
      data: new Date().toLocaleDateString("pt-BR"),
      comentarios: 0,
      likes: 0
    });
  
    fecharModal();
    renderPainel();
  }
  
  function publicarPost() {
    const titulo = document.getElementById("tituloPost").value.trim();
    const conteudo = document.getElementById("conteudoPost").value.trim();
  
    if (!titulo || !conteudo) {
      alert("Preencha todos os campos para publicar.");
      return;
    }
  
    // Simulação: salvar como publicado
    postsAutor.push({
      id: Date.now(),
      titulo: titulo,
      status: "publicado",
      data: new Date().toLocaleDateString("pt-BR"),
      comentarios: 0,
      likes: 0
    });
  
    fecharModal();
    renderPainel();
  }
  
  let idPostParaExcluir = null;

function abrirModalExclusao(idPost) {
  idPostParaExcluir = idPost;
  document.getElementById("modalConfirmarExclusao").classList.remove("hidden");
}

function fecharModalExclusao() {
  idPostParaExcluir = null;
  document.getElementById("modalConfirmarExclusao").classList.add("hidden");
}

function confirmarExclusao() {
  if (idPostParaExcluir !== null) {
    postsAutor = postsAutor.filter(post => post.id !== idPostParaExcluir);
    renderPainel();
    fecharModalExclusao();
  }
}


let idPostEditando = null;

function abrirModalEditar(post) {
  idPostEditando = post.id;
  document.getElementById("tituloEditar").value = post.titulo;
  document.getElementById("conteudoEditar").value = post.conteudo;
  document.getElementById("modalEditarPost").classList.remove("hidden");
}

function fecharModalEditar() {
  idPostEditando = null;
  document.getElementById("modalEditarPost").classList.add("hidden");
}

function atualizarPost() {
  const novoTitulo = document.getElementById("tituloEditar").value;
  const novoConteudo = document.getElementById("conteudoEditar").value;
  const post = postsAutor.find(p => p.id === idPostEditando);
  if (post) {
    post.titulo = novoTitulo;
    post.conteudo = novoConteudo;
    renderPainel();
  }
  fecharModalEditar();
}

function publicarPostEditado() {
  const post = postsAutor.find(p => p.id === idPostEditando);
  if (post) {
    post.status = "Publicado";
    post.data = new Date().toLocaleDateString();
    atualizarPost(); // atualiza título e conteúdo também
  }
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
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}

function abrirPost(titulo, autor, data, comentarios, likes) {
  const postData = { titulo, autor, data, comentarios, likes };
  localStorage.setItem('postSelecionado', JSON.stringify(postData));
  window.location.href = 'post.html';
}

  window.onload = renderPainel;
  