// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\GetPost.js

export default class GetPost {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute(id) {
    return await this.postRepository.findById(id);
  }
}
