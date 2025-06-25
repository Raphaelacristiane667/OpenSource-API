// Caminho: C:\Users\MarcoErapha\backend\src\presentation\routes\post\posts.routes.js

import express from "express";
import { v4 as uuidv4 } from "uuid"; // Para gerar IDs únicos (UUID)
import slugify from "slugify"; // Para criar slugs amigáveis (npm install slugify)

// Importa os casos de uso de Posts
import CreatePost from "../../../application/usecases/CreatePost.js";
import ListPost from "../../../application/usecases/ListPost.js";
import GetPost from "../../../application/usecases/GetPost.js";
import UpdatePost from "../../../application/usecases/UpdatePost.js";
import PublishPost from "../../../application/usecases/PublishPost.js";
import DeletePost from "../../../application/usecases/DeletePost.js";

// Importa os casos de uso de Comentários
import ListCommentsByPost from "../../../application/usecases/ListCommentsByPost.js";
import CreateComment from "../../../application/usecases/CreateComment.js";
import DeleteComment from "../../../application/usecases/DeleteComment.js";

// Importa as implementações dos repositórios SQLite
import PostRepositorySQLite from "../../../infrastructure/database/PostRepositorySQLite.js"; // Importação default
import CommentRepositorySQLite from "../../../infrastructure/database/CommentRepositorySQLite.js"; // Importação default

// Importa o middleware de autenticação
import { authenticateToken } from "../../middlewares/authMiddleware.js"; // Importação nomeada

const router = express.Router();

// Instancia os repositórios (sem passar dbInstance e saveDB, pois eles se inicializam internamente)
const postRepository = new PostRepositorySQLite();
const commentRepository = new CommentRepositorySQLite();

// --- Rotas de Posts ---

// Criar um novo post (protegida para autores/admin)
router.post("/", authenticateToken, async (req, res) => {
  // Exemplo de verificação de permissão (descomente e ajuste)
  // if (req.user.role !== 'admin' && req.user.role !== 'autor') {
  //   return res.status(403).json({ error: "Acesso negado. Apenas autores e administradores podem criar posts." });
  // }
  try {
    const { title, content, tags, image, isPublished } = req.body;
    const userId = req.user.id; // ID do autor do token (userId como UUID)
    const id = uuidv4(); // Gera um ID único para o post (UUID)
    const slug = slugify(title, { lower: true, strict: true }); // Gera um slug a partir do título
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const createPost = new CreatePost(postRepository);
    const post = await createPost.execute({
      id,
      title,
      content,
      slug,
      userId, // Usando userId
      image,
      isPublished: isPublished || false, // Default para false se não fornecido
      createdAt,
      updatedAt,
    });
    res.status(201).json(post);
  } catch (error) {
    console.error("Erro ao criar post:", error);
    // Trata erro de slug duplicado
    if (error.message.includes("UNIQUE constraint failed: posts.slug")) {
      return res
        .status(409)
        .json({ error: "Já existe um post com este título (slug)." });
    }
    res.status(500).json({ error: error.message });
  }
});

// Listar todos os posts (pode ser público ou com filtro de publicados)
router.get("/", async (req, res) => {
  try {
    const listPosts = new ListPost(postRepository);
    const posts = await listPosts.execute();
    // Opcional: Filtrar apenas posts publicados se não houver autenticação
    // Dependendo da sua necessidade, você pode filtrar aqui ou no use case.
    // const publishedPosts = posts.filter(post => post.isPublished);
    // res.json(publishedPosts);
    res.json(posts);
  } catch (error) {
    console.error("Erro ao listar posts:", error);
    res.status(500).json({ error: error.message });
  }
});

// Obter um post por ID (pode ser público)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getPost = new GetPost(postRepository);
    const post = await getPost.execute(id);
    if (!post) {
      return res.status(404).json({ error: "Post não encontrado." });
    }
    res.json(post);
  } catch (error) {
    console.error("Erro ao obter post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um post (protegida para o autor do post ou admin)
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, image, isPublished } = req.body;
  const updatedAt = new Date().toISOString();

  try {
    const post = await postRepository.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ error: "Post não encontrado para atualização." });
    }
    // Exemplo de verificação de permissão (descomente e ajuste)
    // if (req.user.id !== post.userId && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Acesso negado. Você só pode editar seus próprios posts ou deve ser um administrador." });
    // }

    const updatePost = new UpdatePost(postRepository);
    const updatedPost = await updatePost.execute({
      id,
      title,
      content,
      tags,
      image,
      isPublished,
      updatedAt,
    });
    res.json(updatedPost);
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Publicar um post (protegida para o autor do post ou admin)
router.patch("/:id/publish", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postRepository.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ error: "Post não encontrado para publicação." });
    }
    // Exemplo de verificação de permissão (descomente e ajuste)
    // if (req.user.id !== post.userId && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Acesso negado. Você só pode publicar seus próprios posts ou deve ser um administrador." });
    // }

    const publishPost = new PublishPost(postRepository);
    const publishedPost = await publishPost.execute(id);
    res.json(publishedPost);
  } catch (error) {
    console.error("Erro ao publicar post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Excluir um post (protegida para o autor do post ou admin)
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postRepository.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ error: "Post não encontrado para exclusão." });
    }
    // Exemplo de verificação de permissão (descomente e ajuste)
    // if (req.user.id !== post.userId && req.user.role !== 'admin') {
    //   return res.status(403).json({ error: "Acesso negado. Você só pode excluir seus próprios posts ou deve ser um administrador." });
    // }

    const deletePost = new DeletePost(postRepository);
    const changes = await deletePost.execute(id);
    if (changes === 0) {
      return res
        .status(404)
        .json({ error: "Post não encontrado para exclusão." });
    }
    res.status(204).send(); // Status 204 No Content para exclusão bem-sucedida
  } catch (error) {
    console.error("Erro ao excluir post:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Rotas de Comentários para Posts ---

// Listar comentários de um post específico
router.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const listCommentsByPost = new ListCommentsByPost(commentRepository);
    const comments = await listCommentsByPost.execute(postId);
    res.json(comments);
  } catch (error) {
    console.error("Erro ao listar comentários:", error);
    res.status(500).json({ error: error.message });
  }
});

// Adicionar um comentário a um post (protegida, exige autenticação para saber o autor)
router.post("/:postId/comments", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const id = uuidv4(); // Gera um ID único para o comentário (UUID)
    const userId = req.user.id; // ID do usuário do token (UUID)
    const createdAt = new Date().toISOString();

    if (!content) {
      return res
        .status(400)
        .json({ error: "Conteúdo do comentário é obrigatório." });
    }

    const createComment = new CreateComment(commentRepository);
    const comment = await createComment.execute({
      id,
      postId,
      userId, // Usando userId
      content,
      createdAt,
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    res.status(500).json({ error: error.message });
  }
});

// Excluir um comentário (protegida para o autor do comentário ou admin)
router.delete(
  "/:postId/comments/:commentId",
  authenticateToken,
  async (req, res) => {
    const { commentId } = req.params;

    try {
      const comment = await commentRepository.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comentário não encontrado." });
      }

      // Exemplo: Verifique se o usuário logado é o autor do comentário ou um admin
      // if (req.user.id !== comment.userId && req.user.role !== 'admin') {
      //     return res.status(403).json({ error: "Acesso negado. Você só pode excluir seus próprios comentários ou deve ser um administrador." });
      // }

      const deleteComment = new DeleteComment(commentRepository);
      const changes = await deleteComment.execute(commentId);

      if (changes === 0) {
        return res
          .status(404)
          .json({ error: "Comentário não encontrado para exclusão." });
      }
      res.status(204).send(); // Sem conteúdo
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Exporta o router para ser usado em index.js
export default router;
