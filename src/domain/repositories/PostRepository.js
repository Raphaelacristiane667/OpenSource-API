// Caminho: C:\Users\MarcoErapha\backend\src\domain\repositories\PostRepository.js

// Exporta a classe PostRepository como uma exportação padrão (default)
export default class PostRepository {
  // Método abstrato para encontrar todos os posts
  findAll() {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para encontrar um post por ID
  findById(id) {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para encontrar um post por slug
  findBySlug(slug) {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para criar um novo post
  create(post) {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para atualizar um post
  update(id, post) {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para excluir um post por ID
  delete(id) {
    throw new Error("Método não implementado.");
  }
}
