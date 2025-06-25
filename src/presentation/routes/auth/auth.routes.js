// Caminho: C:\Users\MarcoErapha\backend\src\presentation\routes\auth\auth.routes.js

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos (UUID)

// Importa a classe do repositório SQLite para usuários
import UserRepositorySQLite from "../../../infrastructure/database/UserRepositorySQLite.js"; // Importação default

const router = express.Router();

// Instancia o repositório de usuários
const userRepository = new UserRepositorySQLite();

// O segredo JWT deve vir de uma variável de ambiente
const secret = process.env.JWT_SECRET || "seusecretoseguro"; // Substitua por um segredo forte em produção!

// Rota de Registro
router.post("/register", async (req, res) => {
  // Desestrutura os campos esperados: username, email, password, role
  const { username, email, password, role } = req.body;

  // Validação básica dos campos obrigatórios
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        error:
          "Nome de usuário, email e senha são obrigatórios para o registro.",
      });
  }

  try {
    // Verifica se já existe um usuário com o email fornecido
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }

    // Gera um ID único para o novo usuário (UUID, armazenado como TEXT no DB)
    const id = uuidv4();
    const createdAt = new Date().toISOString(); // Timestamp de criação

    // Cria o novo usuário através do caso de uso (o repositório fará o hash da senha)
    const newUser = await userRepository.create({
      id,
      username,
      email,
      password, // Passa a senha em texto claro; o repositório se encarrega do hash
      role: role || "user", // Define 'user' como função padrão se não for fornecido
      createdAt,
    });

    // Retorna uma resposta de sucesso com os dados do usuário (sem a senha)
    res.status(201).json({
      message: "Usuário registrado com sucesso.",
      user: {
        id: newUser.id,
        username: newUser.username, // Usa 'username' na resposta
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    // Trata erro de email duplicado específico do SQLite (se a validação acima não pegar)
    if (error.message.includes("UNIQUE constraint failed: users.email")) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }
    res
      .status(500)
      .json({ error: "Erro interno do servidor ao registrar usuário." });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validação básica dos campos obrigatórios
  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios." });

  try {
    // Busca o usuário pelo email
    const user = await userRepository.findByEmail(email);

    // Se o usuário não for encontrado ou a senha for inválida, retorna erro genérico por segurança
    if (!user) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }

    // Compara a senha fornecida com o hash da senha armazenado no banco de dados (user.password)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Usuário ou senha inválidos." });
    }

    // Gera um token JWT com informações do usuário (ID, email, função)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      {
        expiresIn: "1d", // Token expira em 1 dia
      }
    );

    // Retorna os dados do usuário (sem o hash da senha) e o token
    res.json({
      user: {
        id: user.id,
        username: user.username, // Usa 'username' na resposta
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno do servidor ao fazer login." });
  }
});

// Exporta o router como uma exportação padrão (default)
export default router;
