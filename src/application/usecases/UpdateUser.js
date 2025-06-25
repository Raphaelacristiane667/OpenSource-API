// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\UpdateUser.js

import User from "../../domain/entities/User.js"; // Importa a entidade User para usar seus métodos ou propriedades

export default class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ id, name, email, passwordHash, role }) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error("Usuário não encontrado.");

    if (name) user.name = name;
    if (email) user.email = email;
    if (passwordHash) user.passwordHash = passwordHash;
    if (role) user.changeRole(role); // usa método da entidade User

    await this.userRepository.update(id, user); // Usa o método update
    return user;
  }
}
