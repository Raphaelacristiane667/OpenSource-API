// Caminho: C:\Users\MarcoErapha\backend\src\presentation\middlewares\validateUpload.js

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // Necessário para __dirname em ES Modules

// Para resolver __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tipos de arquivo permitidos (extensão)
const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

// MIME types permitidos
const allowedMimeTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
];

// Configuração do armazenamento dos arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define a pasta de destino para os uploads
    // Certifique-se de que a pasta 'uploads/' existe na raiz do seu projeto
    cb(null, path.join(__dirname, "..", "..", "..", "uploads/"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Pega a extensão original do arquivo
    const filename = `${Date.now()}-${file.fieldname}${ext}`; // Gera um nome de arquivo único
    cb(null, filename);
  },
});

// Filtro de validação de arquivo
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase(); // Extensão em minúsculas
  const mime = file.mimetype; // MIME type do arquivo

  if (!allowedExtensions.includes(ext)) {
    // Erro se a extensão não for permitida
    return cb(new Error("Tipo de arquivo não permitido: extensão inválida!"));
  }
  if (!allowedMimeTypes.includes(mime)) {
    // Erro se o MIME type não for permitido
    return cb(new Error("Tipo de arquivo não permitido: MIME inválido!"));
  }
  cb(null, true); // Aceita o arquivo
}

// Configuração final do Multer
const upload = multer({
  storage, // Usa a configuração de armazenamento
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de tamanho do arquivo: 5MB
  },
  fileFilter, // Aplica o filtro de validação
});

// Exporta a instância do Multer configurada como padrão
export default upload;
