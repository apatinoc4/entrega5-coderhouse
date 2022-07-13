const express = require("express");
const classContenedor = require("./classContenedor");
const { Router } = express;

const file1 = new classContenedor("productos.txt");

const app = express();
const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const PORT = 8080;

const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));

app.get("/", (req, res) => {
  res.send("Ingresa a /productos o /productoRandom !");
});

router.get("/", async (req, res) => {
  const arrayProductos = await file1.getAll();

  return res.send(arrayProductos);
});

router.get("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const foundProduct = await file1.getById(productId);

  if (foundProduct) {
    return res.send(foundProduct);
  } else {
    return res.send({ error: "producto no encontrado" });
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;

  await file1.save(newProduct);

  const arrayProductos = await file1.getAll();

  return res.send(arrayProductos[arrayProductos.length - 1]);
});

router.delete("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  await file1.deleteById(productId);

  return res.sendStatus(200);
});

router.put("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  await file1.updateById(productId, req.body);

  return res.sendStatus(200);
});

app.use("/api/productos", router);
