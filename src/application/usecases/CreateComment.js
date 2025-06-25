// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\CreateComment.js

// Importa a entidade Comment
import Comment from "../../domain/entities/Comment.js";

export default class CreateComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute({ id, postId, authorName, content, createdAt }) {
    const comment = new Comment(id, postId, authorName, content, createdAt);
    await this.commentRepository.create(comment); // Usa o método create, não save
    return comment;
  }
}
