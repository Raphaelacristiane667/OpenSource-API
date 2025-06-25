let comentariosUsuario = [
    {
      id: 1,
      post: "Ressurgimento do design de software em 2025?",
      texto: "Achei esse conteúdo muito útil. Obrigado!",
      data: "2 de jun."
    },
    {
      id: 2,
      post: "AI Agent Prompting",
      texto: "Adoro a amplitude da oportunidade para os participantes.",
      data: "2 de jun."
    }
  ];
  
  let comentarioParaExcluir = null;
  
  function renderComentarios() {
    const lista = document.getElementById("lista-comentarios");
    lista.innerHTML = "";
  
    comentariosUsuario.forEach(c => {
      const div = document.createElement("div");
      div.className = "comentario-box";
      div.innerHTML = `
        <p><strong>Post:</strong> ${c.post}</p>
        <p>“${c.texto}”</p>
        <p><a href="#">Ver Post...</a></p>
        <p class="acoes">
          <span style="margin-right: 10px;">${c.data}</span>
          <button onclick="confirmarRemocao(${c.id})" style="background: none; border: none; font-size: 18px;">🗑️</button>
        </p>
      `;
      lista.appendChild(div);
    });
  }
  
  function confirmarRemocao(id) {
    comentarioParaExcluir = id;
    document.getElementById("modal-comentario").style.display = "flex";
  }
  
  function cancelarExclusao() {
    comentarioParaExcluir = null;
    document.getElementById("modal-comentario").style.display = "none";
  }
  
  function confirmarExclusao() {
    comentariosUsuario = comentariosUsuario.filter(c => c.id !== comentarioParaExcluir);
    comentarioParaExcluir = null;
    document.getElementById("modal-comentario").style.display = "none";
    renderComentarios();
  }

  function toggleMenu() {
    document.getElementById("sideMenu").classList.toggle("open");
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
  

  function abrirPost(titulo, autor, data, comentarios, likes) {
    const postData = { titulo, autor, data, comentarios, likes };
    localStorage.setItem('postSelecionado', JSON.stringify(postData));
    window.location.href = 'post.html';
  }
  

  
  window.onload = renderComentarios;
  