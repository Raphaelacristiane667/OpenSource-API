// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\DeleteUser.js

export default class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    await this.userRepository.delete(id);
  }
}
