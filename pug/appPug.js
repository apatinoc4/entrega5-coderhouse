const express = require("express");
const classContenedor = require("../classContenedor");

const file1 = new classContenedor("../productos.txt");

const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));

app.get("/", (req, res) => {
  res.render("createProduct.pug");
});

app.get("/productos", async (req, res) => {
  const arrayProductos = await file1.getAll();

  res.render("productList.pug", { results: arrayProductos });
});

app.post("/productos", async (req, res) => {
  const newProduct = req.body;

  await file1.save(newProduct);

  const arrayProductos = await file1.getAll();

  return res.send(arrayProductos[arrayProductos.length - 1]);
});
