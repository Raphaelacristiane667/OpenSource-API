// Caminho: C:\Users\MarcoErapha\backend\src\presentation\routes\users\users.js

import express from "express";
import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos (UUID)
import bcrypt from "bcryptjs"; // Para hash de senhas (necessário aqui se algum caso de uso espera hash externo)

// Importa os casos de uso
import CreateUser from "../../../application/usecases/CreateUser.js";
import ListUsers from "../../../application/usecases/ListUsers.js";
import GetUser from "../../../application/usecases/GetUser.js";
import UpdateUser from "../../../application/usecases/UpdateUser.js";
import DeleteUser from "../../../application/usecases/DeleteUser.js";

// Importa a implementação do repositório SQLite.
import UserRepositorySQLite from "../../../infrastructure/database/UserRepositorySQLite.js"; // Importação default

// Importa o middleware de autenticação
import { authenticateToken } from "../../middlewares/authMiddleware.js"; // Importação nomeada

const router = express.Router();

// Instancia o repositório de usuários
const userRepository = new UserRepositorySQLite();

// Criar um novo usuário (geralmente não autenticada para o registro inicial)
// Esta rota pode ser usada por um admin para criar outros usuários, por exemplo.
router.post("/", async (req, res) => {
  try {
    // Desestrutura os campos esperados: username, email, password, role
    const { username, email, password, role } = req.body;

    // Gera um ID único para o novo usuário (UUID)
    const id = uuidv4();
    // O hash da senha será feito DENTRO do UserRepositorySQLite.create

    // Cria o usuário usando o caso de uso
    const createUser = new CreateUser(userRepository);
    const user = await createUser.execute({
      id,
      username, // Passa 'username'
      email,
      password, // Passa a senha em texto claro, o repositório fará o hash
      role,
    });
    // Remove a senha antes de enviar a resposta para segurança
    const { password: userPassword, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    // Trata erros como email duplicado (se seu repositório ou DB lançar um erro específico)
    if (error.message.includes("UNIQUE constraint failed: users.email")) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: error.message });
  }
});

// Listar todos os usuários (rota protegida, geralmente apenas admin pode ver todos)
router.get("/", authenticateToken, async (req, res) => {
  // Exemplo de verificação de permissão (descomente e ajuste se precisar restringir)
  // if (req.user.role !== 'admin') {
  //   return res.status(403).json({ error: "Acesso negado. Apenas administradores podem listar usuários." });
  // }
  try {
    const listUsers = new ListUsers(userRepository);
    const users = await listUsers.execute();
    // Remove as senhas antes de enviar para segurança
    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user; // 'password' é o campo do hash na entidade
      return rest;
    });
    res.json(usersWithoutPassword);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obter um usuário por ID (rota protegida, usuário só pode ver o próprio perfil ou admin qualquer um)
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  // Exemplo de verificação de permissão (descomente e ajuste)
  // if (req.user.id !== id && req.user.role !== 'admin') {
  //   return res.status(403).json({ error: "Acesso negado. Você só pode ver seu próprio perfil ou deve ser um administrador." });
  // }
  try {
    const getUser = new GetUser(userRepository);
    const user = await getUser.execute(id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    // Remove a senha antes de enviar
    const { password, ...userWithoutPassword } = user; // 'password' é o campo do hash
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um usuário (rota protegida, usuário só pode editar o próprio perfil ou admin qualquer um)
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  // Exemplo de verificação de permissão (descomente e ajuste)
  // if (req.user.id !== id && req.user.role !== 'admin') {
  //   return res.status(403).json({ error: "Acesso negado. Você só pode editar seu próprio perfil ou deve ser um administrador." });
  // }
  try {
    const { username, email, password, role } = req.body; // 'username' é o campo aqui
    let newPassword = password; // A senha será hashada dentro do repositório, se fornecida

    const updateUser = new UpdateUser(userRepository);
    const updatedUser = await updateUser.execute({
      id, // O ID é necessário para saber qual usuário atualizar
      username, // Passa 'username'
      email,
      password: newPassword, // Passa a nova senha (texto claro) ou null/undefined
      role,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado para atualização." });
    }
    // Remove a senha antes de enviar
    const { password: updatedUserPassword, ...userWithoutPassword } =
      updatedUser; // 'password' é o campo do hash
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: error.message });
  }
});

// Excluir um usuário (rota protegida, admin pode excluir qualquer um, usuário pode excluir o próprio perfil)
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  // Exemplo de verificação de permissão (descomente e ajuste)
  // if (req.user.id !== id && req.user.role !== 'admin') {
  //   return res.status(403).json({ error: "Acesso negado. Você só pode excluir seu próprio perfil ou deve ser um administrador." });
  // }
  try {
    const deleteUser = new DeleteUser(userRepository);
    const changes = await deleteUser.execute(id);
    if (changes === 0) {
      return res
        .status(404)
        .json({ error: "Usuário não encontrado para exclusão." });
    }
    res.status(204).send(); // Status 204 No Content para exclusão bem-sucedida
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: error.message });
  }
});

// Exporta o router para ser usado em index.js
export default router;
