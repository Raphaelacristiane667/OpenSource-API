// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\CreatePost.js

// Importa a entidade Post
import Post from "../../domain/entities/Post.js";

export default class CreatePost {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute({ id, title, content, slug, authorId, tags, createdAt }) {
    // Note: 'published' e 'updatedAt' estão sendo definidos aqui como 'false' e 'createdAt'
    const post = new Post(
      id,
      title,
      content,
      slug,
      authorId,
      tags,
      false,
      createdAt,
      createdAt
    );
    await this.postRepository.create(post); // Usa o método create, não save
    return post;
  }
}
