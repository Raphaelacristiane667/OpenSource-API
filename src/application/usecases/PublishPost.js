// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\PublishPost.js

import Post from "../../domain/entities/Post.js"; // Importa a entidade Post para garantir o método .publish()

export default class PublishPost {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(id) {
    const post = await this.postRepository.findById(id);
    if (!post) throw new Error("Post não encontrado.");

    post.publish(); // Chama o método publish da entidade Post
    await this.postRepository.update(id, post); // Usa o método update, passando o ID e o objeto post
    return post;
  }
}
