const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    return res.status(422).json({
      message: "Verificação falhou! Algum dado está incorreto.",
      erros: erros.array(),
    });
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
    .catch((err) => console.log(err));
};

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "Primeiro Post", content: "Este é o primeiro post!" }],
  });
};
