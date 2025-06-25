// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\CreateUser.js

// Importa a entidade User
import User from "../../domain/entities/User.js";

export default class CreateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ id, name, email, passwordHash, role = "autor" }) {
    const createdAt = new Date().toISOString(); // Garante o formato ISO para o banco de dados

    const user = new User(id, name, email, passwordHash, createdAt, role);
    await this.userRepository.create(user); // Usa o método create, não save
    return user;
  }
}
