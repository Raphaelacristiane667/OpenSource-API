// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\UpdatePost.js

import Post from "../../domain/entities/Post.js"; // Importa a entidade Post se você estiver usando seus métodos ou propriedades diretas

export default class UpdatePost {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute({ id, title, content, tags }) {
    const post = await this.postRepository.findById(id);
    if (!post) throw new Error("Post não encontrado.");

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags; // Assume que tags é um array
    post.updatedAt = new Date().toISOString(); // Atualiza a data de modificação

    await this.postRepository.update(id, post); // Usa o método update
    return post;
  }
}
