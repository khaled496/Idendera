
import Promo from "../models/Promo.js"

import User from "../models/user.js";


export async function addPromo(req , res){
 
 try {
    
    var code  = req.body.code;
    var discount= req.body.discount
    var expirationDate = req.body.expirationDate
    const user = await User.findOne({ _id: req.body.idUser })


    

    
    var c = await Promo.create({
        code,
        discount,
      expirationDate,
      user: [user._id],
      users:[],
    });
    
      res.status(200).json({message : "ajout avec succeés",c});
      

    
  } catch (err) {
    console.log(err);
  }
  
};

export async function CheckPromo(req, res) {
  try {
    const code = req.body.code;
    const user = await User.findOne({ _id: req.body.idUser });

    if (user != null) {
      const CodePromo = await Promo.findOne({ code: code });

      if (CodePromo != null) {
        const existe = CodePromo.users.some((element) => element.equals(user._id));

        if (existe) {
          return res.status(400).send({ message: "User already exists in the promo" });
        } else {
          CodePromo.users.push(user._id);
          CodePromo.quantity++;
          await CodePromo.save();

          return res.status(200).send(CodePromo);
        }
      } else {
        return res.status(400).send({ message: "Invalid promo code" });
      }
    } else {
      return res.status(400).send({ message: "Invalid user ID" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal server error" });
  }
}

 
export const getBestSellingPromos = async (req, res) => {
  try {
    const promo = await Promo.find({ user: req.body.user}).sort('-quantity').limit(10);
    res.status(200).json(promo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
export async function UpdatePromo(req,res){

  const  { code,description,expirationDate } = req.body;
  
  var c = await Promo.findOne({ _id: req.params.id });
  c.code=code;
  c.description= description;
  c.expirationDate= expirationDate;
 
  c.save()
    
  
  res.status(200).json({message : "update avec succeés",c});
   
   // res.status(404).json("Not found ")
    
    
}
export async function disablePromo(req,res){

  var c = await Promo.findOne({ _id: req.params.id });
  if(c.active)
  {
    c.active = false;
  }
  else
  {
    c.active = true;
  }
  
 
  c.save()
    
  
  res.status(200).json({message : "update avec succeés",c});
   
   // res.status(404).json("Not found ")
    
    
}

export async function deletePromo(req,res){
  
    
      try {
        var  id=req.params.id;
  
        var c = await Promo.findOne({_id:id})
        if(!c)
        res.status(404).json("promo not found")

        c.remove();
        res.status(200).json("promo Supprime")
      } catch (error) {
        console.log(error);
      }
  
}
export async function GetPromo(req,res){
  
  
    try {

      var  id=req.params.id;

      var c = await Promo.findOne({_id:id})
      if(c)
      {
       
        res.status(200).json(c)
      }else
      res.status(404).json("user not found")
    } catch (error) {
      console.log(error);
    }

}
export async function GetALLPromo(req,res){
  
  
    try {


      var c = await Promo.find({})
      if(c)
      {
        
        res.status(200).json(c)
      }else
      res.status(404).json("promo not found")
    } catch (error) {
      console.log(error);
    }

}





