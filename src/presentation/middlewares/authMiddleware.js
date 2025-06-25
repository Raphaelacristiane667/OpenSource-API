// Caminho: C:\Users\MarcoErapha\backend\src\presentation\middlewares\authMiddleware.js

import jwt from "jsonwebtoken";

// O segredo deve vir de uma variável de ambiente (ex: arquivo .env)
const secret = process.env.JWT_SECRET || "seusecretoseguro"; // Substitua por um segredo forte em produção!

// Função de middleware para autenticação de token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Exemplo: "Bearer TOKEN"
  const token = authHeader && authHeader.split(" ")[1]; // Pega só o token

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não fornecido." });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      // Se o token for inválido ou expirado
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }

    req.user = user; // Salva os dados decodificados do token no objeto de requisição
    next(); // Chama a próxima função de middleware ou rota
  });
}
