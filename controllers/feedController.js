const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
const { count } = require("console");

exports.createPost = (req, res, next) => {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    //Criar um objeto do tipo Error
    const error = new Error("Verificação falhou! Algum dado está incorreto.");
    //Criar minha propriedade (o nome sou eu que escolho! - pode ser qualquer 1)
    error.statusCode = 422;
    //Lançar (throw) o erro
    throw error;
  }

  if (!req.file) {
    const error = new Error("Não enviou imagem...");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;

  //Criar post no Banco de Dados
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Samuel Santos" },
  });

  //Salvar o post
  post
    .save()
    .then((result) => {
      console.log(result);

      res.status(201).json({
        message: "Post criado com sucesso!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPosts = (req, res, next) => {
  //Pagination (simple form)
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        posts: posts,
        totalItems: totalItems
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postID = req.params.postID;

  Post.findById(postID)
    .then((post) => {
      if (!post) {
        const error = new Error("Post não encontrado...");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postID = req.params.postID;
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    const error = new Error("Verificação falhou! Algum dado está incorreto.");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("Imagem não enviada...");
    error.statusCode = 404;
    throw error;
  }

  //Chegando aqui, teremos dados válidos

  Post.findById(postID)
    .then((post) => {
      if (!post) {
        const error = new Error("Post não encontrado...");
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;

      return post.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Post atualizado com sucesso!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.deletePost = (req, res, next) => {
  const postID = req.params.postID;

  Post.findById(postID)
    .then((post) => {
      if (!post) {
        const error = new Error("Post não encontrado...");
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);

      return Post.findByIdAndDelete(postID);
    })
    .then((result) => {
      res.status(200).json({ message: "Post apagado com sucesso!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//Função utilitária para apagar a imagem anterior

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
