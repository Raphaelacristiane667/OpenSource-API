// Caminho: C:\Users\MarcoErapha\backend\src\infrastructure\database\PostRepositorySQLite.js

// Importa o repositório base e a entidade Post
import PostRepository from "../../domain/repositories/PostRepository.js";
import Post from "../../domain/entities/Post.js";
import { getDb, saveDB } from "./sqlite.js";

// Exporta a classe PostRepositorySQLite como uma exportação PADRÃO (DEFAULT)
export default class PostRepositorySQLite extends PostRepository {
  constructor() {
    super();
    this.db = null;
  }

  async init() {
    if (!this.db) {
      this.db = await getDb();
    }
  }

  async create(post) {
    await this.init();
    const result = await this.db.run(
      "INSERT INTO posts (id, title, content, userId, image, isPublished, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        post.id,
        post.title,
        post.content,
        post.userId,
        post.image,
        post.isPublished ? 1 : 0,
        post.createdAt,
        post.updatedAt,
      ]
    );
    // post.id = result.lastID; // Não use, pois já geramos o UUID
    return post;
  }

  async findById(id) {
    await this.init();
    const row = await this.db.get("SELECT * FROM posts WHERE id = ?", [id]);
    return row
      ? new Post(
          row.id,
          row.title,
          row.content,
          row.userId,
          row.image,
          row.isPublished === 1,
          row.createdAt,
          row.updatedAt
        )
      : null;
  }

  async findAll() {
    await this.init();
    const rows = await this.db.all(
      "SELECT * FROM posts ORDER BY createdAt DESC"
    );
    return rows.map(
      (row) =>
        new Post(
          row.id,
          row.title,
          row.content,
          row.userId,
          row.image,
          row.isPublished === 1,
          row.createdAt,
          row.updatedAt
        )
    );
  }

  async findByUserId(userId) {
    await this.init();
    const rows = await this.db.all(
      "SELECT * FROM posts WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );
    return rows.map(
      (row) =>
        new Post(
          row.id,
          row.title,
          row.content,
          row.userId,
          row.image,
          row.isPublished === 1,
          row.createdAt,
          row.updatedAt
        )
    );
  }

  async update(post) {
    await this.init();
    const result = await this.db.run(
      "UPDATE posts SET title = ?, content = ?, image = ?, isPublished = ?, updatedAt = ? WHERE id = ?",
      [
        post.title,
        post.content,
        post.image,
        post.isPublished ? 1 : 0,
        new Date().toISOString(),
        post.id,
      ]
    );
    return result.changes;
  }

  async delete(id) {
    await this.init();
    const result = await this.db.run("DELETE FROM posts WHERE id = ?", [id]);
    return result.changes;
  }
}
