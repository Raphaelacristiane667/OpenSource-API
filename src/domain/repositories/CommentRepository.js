// Caminho: C:\Users\MarcoErapha\backend\src\domain\repositories\CommentRepository.js

// Exporta a classe CommentRepository como uma exportação padrão (default)
export default class CommentRepository {
  // Método abstrato para encontrar um comentário por ID
  findById(id) {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para encontrar comentários por ID de post
  findByPostId(postId) {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para criar um novo comentário
  create(comment) {
    throw new Error("Método não implementado.");
  }
  // Método abstrato para excluir um comentário por ID
  delete(id) {
    throw new Error("Método não implementado.");
  }
}
