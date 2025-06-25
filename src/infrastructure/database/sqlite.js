// Caminho: C:\Users\MarcoErapha\backend\src\infrastructure\database\sqlite.js

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

// Para resolver __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define o caminho para o arquivo do banco de dados SQLite
// *** MUDANÇA CRUCIAL: USANDO UM CAMINHO ABSOLUTO E INQUESTIONÁVEL ***
// Isso elimina qualquer problema com cálculos de caminhos relativos ou permissões no __dirname.
// O banco de dados será criado diretamente em C:\Users\MarcoErapha\backend\database.sqlite
const DB_PATH = "C:\\Users\\MarcoErapha\\backend\\database.sqlite";

// Declaração da variável do banco de dados fora da função para ser acessível globalmente neste módulo
let db = null; // Inicializa como null

// Função assíncrona para inicializar o banco de dados e as tabelas
export async function initDatabase() {
  if (db) return db; // Retorna a instância existente se já estiver aberta

  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database, // Usa o driver do sqlite3
  });

  // Executa as queries para criar as tabelas com 'username' e IDs como TEXT
  // COMO DELETAMOS O ARQUIVO database.sqlite, ESTA TABELA SERÁ CRIADA DO ZERO.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, /* ID AGORA É TEXT para UUID, consistente com uuidv4() */
      username TEXT NOT NULL UNIQUE, /* ESTA COLUNA É ESSENCIAL */
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL, /* O HASH DA SENHA É SALVO AQUI */
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY, /* ID agora é TEXT para UUID */
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      userId TEXT NOT NULL, /* userId agora é TEXT para UUID */
      image TEXT,
      isPublished BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY, /* ID agora é TEXT para UUID */
      postId TEXT NOT NULL, /* postId agora é TEXT para UUID */
      userId TEXT NOT NULL, /* userId agora é TEXT para UUID */
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  console.log("Banco de dados conectado e tabelas inicializadas/verificadas.");
  return db;
}

// Função para obter a instância do banco de dados
export function getDb() {
  return db;
}

// A função saveDB não é estritamente necessária com 'sqlite' porque as operações são persistidas imediatamente.
export const saveDB = () => {};
