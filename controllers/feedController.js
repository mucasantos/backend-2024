exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "Primeiro Post", content: "Este é o primeiro post!" }],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
    
  //Criar post no Banco de Dados

  if (!title || !content){
    return res.status(400).json({ error: true, message: "Você precisa enviar o body correto!"})
  }

  res.status(201).json({
    message: "Post criado com sucesso!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
