// Caminho: C:\Users\MarcoErapha\backend\src\domain\entities\Comment.js

// Exporta a classe Comment como uma exportação padrão (default)
export default class Comment {
  // Construtor da classe Comment
  constructor(id, postId, authorName, content, createdAt) {
    this.id = id;
    this.postId = postId;
    this.authorName = authorName;
    this.content = content;
    this.createdAt = createdAt || new Date().toISOString(); // Define createdAt se não for fornecido
  }
}
