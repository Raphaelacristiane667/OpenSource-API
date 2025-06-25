// Caminho: C:\Users\MarcoErapha\backend\src\infrastructure\database\UserRepositorySQLite.js

// Importa o repositório base e a entidade User
import UserRepository from "../../domain/repositories/UserRepository.js";
import User from "../../domain/entities/User.js";
import { getDb, saveDB } from "./sqlite.js";
import bcrypt from "bcryptjs";

// Exporta a classe UserRepositorySQLite como uma exportação PADRÃO (DEFAULT)
export default class UserRepositorySQLite extends UserRepository {
  constructor() {
    super();
    this.db = null;
    this.saltRounds = 10;
  }

  // Método para inicializar a conexão com o DB, se ainda não estiver inicializada
  async init() {
    if (!this.db) {
      this.db = await getDb();
    }
  }

  async create(user) {
    await this.init();
    const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);
    const result = await this.db.run(
      "INSERT INTO users (id, username, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.username,
        user.email,
        hashedPassword,
        user.role || "user",
        user.createdAt || new Date().toISOString(),
      ]
    );
    return user;
  }

  async findById(id) {
    await this.init();
    const row = await this.db.get("SELECT * FROM users WHERE id = ?", [id]);
    return row
      ? new User(
          row.id,
          row.username,
          row.email,
          row.password,
          row.role,
          row.createdAt
        )
      : null;
  }

  async findByEmail(email) {
    await this.init();
    const row = await this.db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return row
      ? new User(
          row.id,
          row.username,
          row.email,
          row.password,
          row.role,
          row.createdAt
        )
      : null;
  }

  async findAll() {
    await this.init();
    const rows = await this.db.all("SELECT * FROM users");
    return rows.map(
      (row) =>
        new User(
          row.id,
          row.username,
          row.email,
          row.password,
          row.role,
          row.createdAt
        )
    );
  }

  async update(user) {
    await this.init();
    let query = "UPDATE users SET username = ?, email = ?";
    const params = [user.username, user.email];

    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    if (user.role) {
      query += ", role = ?";
      params.push(user.role);
    }

    query += " WHERE id = ?";
    params.push(user.id);

    const result = await this.db.run(query, params);
    return result.changes;
  }

  async delete(id) {
    await this.init();
    const result = await this.db.run("DELETE FROM users WHERE id = ?", [id]);
    return result.changes;
  }
}
