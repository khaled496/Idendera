import { Commande } from "../Models/Commandes.js"; 
import { validationResult } from "express-validator";

export function getAllS(req, res) {
  Commande.find({}).where('iduser').equals(req.params.iduser).exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function getAll(req, res) {
  Commande.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function getById(req, res) {
  Commande.findById(req.params.id)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}



export async function addOnce(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    
    Commande.create({
      iduser: req.body.iduser,
      idproduit: req.body.idproduit
      
     }) 
   
     .then(newGame =>{
        res.status(200).json(newGame)
       })
       .catch(err =>{
        res.status(500).json( err)
       })
    }
    }

export function deleteOnce(req, res) {
  Commande.findOneAndRemove(req.id, req.body)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
