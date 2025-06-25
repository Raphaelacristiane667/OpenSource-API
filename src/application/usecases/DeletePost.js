// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\DeletePost.js

export default class DeletePost {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(id) {
    await this.postRepository.delete(id);
  }
}
