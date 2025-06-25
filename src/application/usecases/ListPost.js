// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\ListPost.js

export default class ListPost {
  // Mantido como ListPost, conforme seu código anterior
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute() {
    return await this.postRepository.findAll();
  }
}
