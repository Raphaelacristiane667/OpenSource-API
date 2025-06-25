// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\ListUsers.js

export default class ListUsers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    return await this.userRepository.findAll();
  }
}
