import express from "express";
import {
  getAll,
  getById,
  updateOnce,
  addOnce,
  deleteOnce,
  getAllS,
  getAllCat,
  sendNFT
} from "../Controllers/ProductController.js";
import { body } from "express-validator";
import multer from "../middlewares/multer-config.js";

const routerp = express.Router();
//addAbonnee
routerp.route("/").get(getAll);
routerp.route("/addProduct")
  .post(
     multer,
     body("name").isLength({ min: 5 }),
    // body("Year").isNumeric(),
    addOnce
  );
  routerp.route("/Category/:category").get(getAllCat);
  routerp.route("/Sell/:sellerId/:tokenId/:email").post(sendNFT);
  routerp.route("/Seller/:Seller").get(getAllS);
  routerp.route("/:id").get(getById).delete(deleteOnce).patch(updateOnce);

routerp.route("/update/:id").patch(updateOnce);

export default routerp;
