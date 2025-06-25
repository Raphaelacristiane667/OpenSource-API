// Caminho: C:\Users\MarcoErapha\backend\src\application\usecases\GetUser.js

export default class GetUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(id) {
    return await this.userRepository.findById(id);
  }
}
