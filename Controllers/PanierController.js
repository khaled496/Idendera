import { Panier } from "../Models/Panier.js"; // add validate
import { validationResult } from "express-validator";
export function getAllS(req, res) {
  Panier.find({}).where('iduser').equals(req.params.iduser).exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getAll(req, res) {
  Panier.find({}).sort('-poids').exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getById(req, res) {
  Panier.findById(req.params.id)
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
    
    Panier.create({
      iduser: req.body.iduser,
      idproduit: req.body.idproduit,
      somme: req.body.somme,
      nbproduits: req.body.nbproduits,
      
  
      
     }).then(newGame =>{
      res.status(200).json(newGame)
     })
     .catch(err =>{
      res.status(500).json( err)
     })
  }
  }

export async function updateOnce(req, res) {
  Panier.findOneAndUpdate(
    { _id: req.params.id },{...req.body}
    // {
    //   nom: req.body.nom,
    //   prenom: req.body.prenom,
  
    // }
  )
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteOnce(req, res) {
  Panier.findOneAndRemove(req.id, req.body)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
