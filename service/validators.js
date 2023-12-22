const { body } = require("express-validator");

module.exports = {
  validTitle: body("title")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Valor inválido!"),
  validContent: body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Valor inválido!"),
};
