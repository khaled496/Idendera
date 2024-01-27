import express from "express";
import {
  getAll,
  getById,
  addOnce,
  deleteOnce,
  getAllS,
} from "../Controllers/CommandeController.js";
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";

const Commande = express.Router();
//addAbonnee
Commande.route("/").get(getAll);
Commande.route("/addCommande")
  .post(
     multer,
    // body("Year").isNumeric(),
    addOnce
  );

  Commande.route("/:id").get(getById).delete(deleteOnce);
  Commande.route("/iduser/:iduser").get(getAllS);

export default Commande;
