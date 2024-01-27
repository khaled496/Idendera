import express from "express";
import {
  getAll,
  getById,
  updateOnce,
  addOnce,
  deleteOnce,
  getAllS,
} from "../Controllers/PanierController.js";
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";

const Panier = express.Router();
//addAbonnee
Panier.route("/").get(getAll);
Panier.route("/addPanier")
  .post(
     multer,
    // body("Year").isNumeric(),
    addOnce
  );

  Panier.route("/:id").get(getById).delete(deleteOnce);
  Panier.route("/Seller/:iduser").get(getAllS);
  Panier.route("/update/:id").put(updateOnce);

export default Panier;
