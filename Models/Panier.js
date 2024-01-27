
import mongoose from 'mongoose';
//Panier:iduser,idproduit,somme,nbproduits
const PanierSchema = mongoose.Schema({
  iduser: {
    type: String,
    required: true,
  },
  idproduit: {
    type: String,
    required: true,
  },
  somme: {
    type: Number,
    required: true,
  },
  nbproduits: {
    type: Number,
    required: true,
  }
  
});

const Panier = mongoose.model('Panier', PanierSchema);

export { Panier, PanierSchema };
