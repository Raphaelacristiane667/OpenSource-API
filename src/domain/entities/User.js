// Caminho: C:\Users\MarcoErapha\backend\src\domain\entities\User.js

// Exporta a classe User como uma exportação padrão (default)
export default class User {
  // Construtor da classe User
  // Ajustado para 'username' e 'password' (que é o hash)
  constructor(id, username, email, password, role = "user", createdAt) {
    this.id = id;
    this.username = username; /* CAMPO 'username' */
    this.email = email;
    this.password = password; /* O hash da senha será armazenado aqui */
    this.role = role; // Ex: 'admin', 'autor', 'user' (default)
    this.createdAt = createdAt || new Date().toISOString(); // Define createdAt se não for fornecido
  }

  // Método para alterar a função (role) do usuário
  changeRole(newRole) {
    const validRoles = ["admin", "autor", "user"];
    if (!validRoles.includes(newRole)) {
      throw new Error(
        `Função inválida: ${newRole}. Funções permitidas: ${validRoles.join(
          ", "
        )}.`
      );
    }
    this.role = newRole;
  }
}
