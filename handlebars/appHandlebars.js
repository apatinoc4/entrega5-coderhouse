const express = require("express");
const handlebars = require("express-handlebars");
const classContenedor = require("../classContenedor");

const file1 = new classContenedor("../productos.txt");

const app = express();

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));

app.get("/", (req, res) => {
  res.render("createProduct");
});

app.get("/productos", async (req, res) => {
  const arrayProductos = await file1.getAll();

  if (arrayProductos && arrayProductos.length > 0) {
    res.render("productList", {
      productList: arrayProductos,
      listExists: true,
    });
  } else {
    res.render("noProduct");
  }
});

app.post("/productos", async (req, res) => {
  const newProduct = req.body;

  await file1.save(newProduct);

  const arrayProductos = await file1.getAll();

  res.render("productList", { productList: arrayProductos, listExists: true });
});
