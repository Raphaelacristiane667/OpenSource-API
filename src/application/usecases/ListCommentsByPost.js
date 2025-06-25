// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\ListCommentsByPost.js

export default class ListCommentsByPost {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute(postId) {
    return await this.commentRepository.findByPostId(postId);
  }
}
