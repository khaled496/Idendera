import express from "express";
import mongoose from "mongoose"
import { notFoundError,errorHandler} from "./middlewares/error-handler.js";
import morgan from "morgan";
import Panier from "./Routes/PanierRoutes.js";
import routerp from "./Routes/ProductRoutes.js";
import cors from 'cors';
import userRoutes from './Routes/user.js';
import Commande from './Routes/CommandeRoutes.js';
import PromoRoute from './routes/PromoRoute.js';

const app = express();
const dataBaseName= "Shoparify";

  

app.use(cors());// cors cross platform nav
mongoose.set('debug',true);//morgan info route 
mongoose.Promise=global.Promise;//morgan info route 
app.use(morgan("dev"));//morgan info route 

app.use(express.urlencoded({extended : true}));//analyse form
app.use("/media", express.static("media"));//charger image http://localhost:9090/img/a.png
app.use(express.json());
app.use((req,res,next) => //Middelwer perso 1 err
{
    console.log("Middelware just run ")
    next();
});

app.use("/gse",(req,res,next) =>
{
    console.log("Middelware just run ") //Middelwer perso 2 err
    next();
});
app.use('/Promo',PromoRoute);
app.use('/Commande',Commande);
app.use("/produit", routerp);
app.use("/panier", Panier);
app.use('/user',userRoutes);
// route introuvable 
//app.use(notFoundError);
// gestion erreur
//app.use(errorHandler);

const hostname = "0.0.0.0"
const port = 9090
mongoose
.connect(`mongodb://127.0.0.1:27017/${dataBaseName}`)
.then(()=>{
    console.log("connected to the database ")
})
.catch((err)=>{
    console.log(err)
})
app.listen(port,hostname,()=>{
    console.log("server running on port 9090")})
    
