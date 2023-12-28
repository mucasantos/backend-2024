const { validationResult } = require("express-validator");
const Post = require("../models/post");

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

  const title = req.body.title;
  const content = req.body.content;

  //Criar post no Banco de Dados
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/duck.png",
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
  res.status(200).json({
    posts: [{ title: "Primeiro Post", content: "Este é o primeiro post!" }],
  });
};
