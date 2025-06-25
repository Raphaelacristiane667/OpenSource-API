// Caminho: C:\Users\MarcoErapha\backend\src\domain\entities\Post.js

// Exporta a classe Post como uma exportação padrão (default)
export default class Post {
  // Construtor da classe Post
  constructor(
    id,
    title,
    content,
    slug,
    authorId,
    tags = [],
    published = false,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.slug = slug;
    this.authorId = authorId;
    this.tags = tags;
    this.published = published;
    this.createdAt = createdAt || new Date().toISOString(); // Define createdAt se não for fornecido
    this.updatedAt = updatedAt || this.createdAt; // Define updatedAt (pode ser o mesmo que createdAt inicialmente)
  }

  // Método para publicar o post
  publish() {
    this.published = true;
    this.updatedAt = new Date().toISOString();
  }

  // Método para despublicar o post
  unpublish() {
    this.published = false;
    this.updatedAt = new Date().toISOString();
  }
}
