
import mongoose from 'mongoose';
//Panier:iduser,idproduit,somme,nbproduits
const CommandeSchema = mongoose.Schema({
  iduser: {
    type: String,
    required: true,
  },
  idproduit: {
    type: String,
    required: true,
  }
  
});

const Commande = mongoose.model('Commande', CommandeSchema);

export { Commande, CommandeSchema };
