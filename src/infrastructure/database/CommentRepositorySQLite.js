// Caminho: C:\Users\MarcoErapha\backend\src\infrastructure\database\CommentRepositorySQLite.js

// Importa o repositório base e a entidade Comment
import CommentRepository from "../../domain/repositories/CommentRepository.js";
import Comment from "../../domain/entities/Comment.js";
import { getDb, saveDB } from "./sqlite.js";

// Exporta a classe CommentRepositorySQLite como uma exportação PADRÃO (DEFAULT)
export default class CommentRepositorySQLite extends CommentRepository {
  constructor() {
    super();
    this.db = null;
  }

  async init() {
    if (!this.db) {
      this.db = await getDb();
    }
  }

  async create(comment) {
    await this.init();
    const result = await this.db.run(
      "INSERT INTO comments (id, postId, userId, content, createdAt) VALUES (?, ?, ?, ?, ?)",
      [
        comment.id,
        comment.postId,
        comment.userId,
        comment.content,
        comment.createdAt || new Date().toISOString(),
      ]
    );
    // comment.id = result.lastID; // Não use, pois já geramos o UUID
    return comment;
  }

  async findById(id) {
    await this.init();
    const row = await this.db.get("SELECT * FROM comments WHERE id = ?", [id]);
    return row
      ? new Comment(row.id, row.postId, row.userId, row.content, row.createdAt)
      : null;
  }

  async findByPostId(postId) {
    await this.init();
    const rows = await this.db.all(
      "SELECT * FROM comments WHERE postId = ? ORDER BY createdAt DESC",
      [postId]
    );
    return rows.map(
      (row) =>
        new Comment(row.id, row.postId, row.userId, row.content, row.createdAt)
    );
  }

  async update(comment) {
    await this.init();
    const result = await this.db.run(
      "UPDATE comments SET content = ? WHERE id = ?",
      [comment.content, comment.id]
    );
    return result.changes;
  }

  async delete(id) {
    await this.init();
    const result = await this.db.run("DELETE FROM comments WHERE id = ?", [id]);
    return result.changes;
  }
}
