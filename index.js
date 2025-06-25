// Caminho: C:\Users\MarcoErapha\backend\index.js

// Carrega variáveis de ambiente do arquivo .env
import "dotenv/config"; // Usando 'dotenv/config' para carregar no início

import express from "express";
import { fileURLToPath } from "url";
import path from "path";

// Importa a instância do banco de dados SQLite e a função saveDB
// Essas são exportações NOMEADAS de sqlite.js
import {
  initDatabase,
  getDb,
  saveDB,
} from "./src/infrastructure/database/sqlite.js";

// Importa as rotas
import authRoutes from "./src/presentation/routes/auth/auth.routes.js";
import usersRoutes from "./src/presentation/routes/users/users.js";
// CORREÇÃO FINAL: Caminho para 'posts' no PLURAL, conforme sua estrutura de pastas
import postsRoutes from "./src/presentation/routes/posts/posts.routes.js";

// Para resolver __dirname em módulos ES (equivalente ao __dirname do CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // Porta do servidor, padrão 3000

// Middlewares
app.use(express.json()); // Para parsear o corpo das requisições JSON

// Servir arquivos estáticos da pasta 'public'
// Assumindo que 'public' está dentro de 'src' (C:\Users\MarcoErapha\backend\src\public)
app.use(express.static(path.join(__dirname, "src", "public")));

// Servir arquivos estáticos da pasta 'uploads' (se você tiver)
// Certifique-se de que a pasta 'uploads' existe na raiz do projeto (C:\Users\MarcoErapha\backend\uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);

// Função assíncrona para iniciar o banco de dados e o servidor Express
async function startServer() {
  try {
    await initDatabase(); // Inicializa o banco de dados e cria as tabelas
    console.log("Banco de dados conectado e tabelas verificadas.");

    // Inicia o servidor Express na porta definida
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Falha ao iniciar o servidor ou conectar ao banco de dados:",
      error
    );
    process.exit(1); // Encerra o processo com erro em caso de falha crítica
  }
}

// Inicia o servidor
startServer();

// Em caso de encerramento do processo (Ctrl+C), fechar o banco de dados
process.on("SIGINT", async () => {
  try {
    const db = await getDb(); // Obtém a instância do banco de dados
    if (db) {
      // Verifica se a instância do banco de dados existe antes de tentar fechar
      await db.close(); // Fecha a conexão com o banco de dados SQLite
      console.log("Banco de dados SQLite fechado.");
    }
    process.exit(0); // Encerra o processo com sucesso
  } catch (error) {
    console.error("Erro ao fechar o banco de dados:", error);
    process.exit(1); // Encerra o processo com erro
  }
});
