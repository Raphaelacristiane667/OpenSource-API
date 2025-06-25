// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\DeleteComment.js

export default class DeleteComment {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(id) {
    await this.commentRepository.delete(id);
  }
}
