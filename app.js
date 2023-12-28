const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const feedRoutes = require("./routes/feedRoutes");

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;

  res.status(status).json({ message: message });
});

mongoose
  .connect("mongodb://localhost:27017/blog")
  .then((result) => {
    app.listen(8080, () => {
      console.log("Server online... :o)");
    });
  })
  .catch((error) => console.log(error));
