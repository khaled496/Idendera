import User, { loginValidate, userValidate } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import { Error } from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from 'ejs';
import sendConfirmationEmail from "../middlewares/mailer.js";
import {
    Client,
    Hbar,
    AccountCreateTransaction,
    PrivateKey,
    AccountId
  } from '@hashgraph/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  
  // Task 1
  export async function createAccount() {
    const myAccountId = AccountId.fromString("0.0.5902618");
    const myAccountKey = PrivateKey.fromString("3030020100300706052b8104000a0422042047865a505bf0f0708f4291cf1a9620dd8a8fdc9cb3bf7482a468712a45db9c37");
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myAccountKey);
  
    const account1pvk = await PrivateKey.generate();
    const accountpbk = account1pvk.publicKey;
  
    const account1T = await new AccountCreateTransaction()
      .setKey(accountpbk)
      .setInitialBalance(new Hbar(10))
      .execute(client);
  
    const rec = await account1T.getReceipt(client);
    const account1 = rec.accountId;
  
    return {
      account1: account1.toString(),
      accountpbk: accountpbk.toString(),
      account1pvk: account1pvk.toString()
    };
  }
  
  
export async function getAll(req, res) {
    try {
        const users = await User
            .find({}).lean();
        console.log(users);
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function profile(req, res) {
    try {
        const { _id } = req.user;
        const connectedUser = await User.findById(_id).lean();
        res.status(200).json(connectedUser);
    } catch (err) {
        res.status(401).json({ "message": "authentication problem" })
    }

}


// register
export async function register(req, res) {
    const { error } = userValidate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email })

    if (user) {
        return res.status(404).send('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const { username, email } = req.body
    const accountInfo = await createAccount();

  // Destructure the values from the result
  const { account1, accountpbk, account1pvk } = accountInfo;

  // Use the captured values to create the user
  await User.create({
    username,
    email,
    password: hashedPassword,
    role: "user",
    otpCode: Math.floor(1000 + Math.random() * 9000),
    publick: accountpbk, // Use the captured public key
    privatekey: account1pvk, // Use the captured private key
    accountid: account1 // Use the captured account ID
  })

        .then(docs => {
            res.status(200).json({ message: 'User Added Successfully!', docs });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    await sendRegistrationMail(email);
}
export async function sendMail(req, res) {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "iheb.hamdi.1@esprit.tn",
                pass: "181JMT3411"
            },
        });
        let info = transporter.sendMail({
            from: "iheb.hamdi.1@esprit.tn",
            to: "islem.naffeti@esprit.tn",
            subject: "Message",
            text: "I hope this message gets through!",
        });
        res.json(info);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}

export async function sendRegistrationMail(email) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "iheb.hamdi.1@esprit.tn",
            pass: "181JMT3411"
        },
    });
    transporter.sendMail({
        from: "iheb.hamdi.1@esprit.tn",
        to: email,
        subject: "welcome",
        text: "welcome to our application",
    });
}


//login 

export async function login(req, res) {
    const { error } = loginValidate(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send('Invalid email or password')
    }

    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) {
        return res.status(404).send('Invalid email or password');
    }
  // const  confirmCode = Math.floor(1000 + Math.random() * 9000);
    const token = jwt.sign({ _id: user._id }, 'privateKey')
    res.header('x-auth-token', token).status(200).send({ token: token, user: user ,});


}
//Recherche d’un seul document
export async function getOnce(req, res) {

    await User
        .findById(req.params.id)
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

export async function getPrivateKeyByAccountId(accountid) {
    try {
      const user = await User.findOne({ accountid }).exec();
  
      if (!user) {
        // User with the given accountid not found
        return null;
      }
  
      // Assuming the field containing the private key is named 'privatekey'
      return user.privatekey;
    } catch (err) {
      // Handle any errors that occur during the database query
      console.error('Error fetching private key:', err);
      throw err; // You might want to handle or log the error differently based on your application's needs
    }
  }
  export async function getAccountByEmail(email) {
    try {
      const user = await User.findOne({ email }).exec();
  
      if (!user) {
        // User with the given email not found
        return null;
      }
  
      // Assuming the field containing the private key is named 'privatekey'
      return {
        privatekey: user.privatekey.toString(),
        accid: user.accountid.toString(),
      };
    } catch (err) {
      // Handle any errors that occur during the database query
      console.error('Error fetching private key:', err);
      throw err;
    }
  }
  
  
  
export async function patchOnce(req, res) {

    await User
        //findByIdAndUpdate si vous voulez modifier un document à l’aide de son ID.
        .findByIdAndUpdate(req.params.id, req.body)
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

}

export async function deleteOnce(req, res) {
    try {
        let checkIfUserExists = await User.findById(req.params.id);
        if (!checkIfUserExists) throw new Error();
        const user = await User
            .findByIdAndRemove(req.params.id)
        res.status(200).json({ "message": user });
    } catch (err) {
        res.status(404).json({ message: "user not found" });
    }

}






//forgot password





export  async function forgetPassword (req, res, next) {

        const { email } = req.body;

        const renderedUser = await User.findOne({ email });

        if (!renderedUser) {

            throw new Error("user not found");
        }
       // sendRegistrationMail(email)
       sendMail()
        res.status(200).json({ code: renderedUser.otpCode });

     /**
      * 
      * let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "iheb.hamdi.1@esprit.tn",
                pass: "181JMT3411"
            },
        });

        transporter.sendMail({
            from: "iheb.hamdi.1@esprit.tn",
            to: email,
            subject: "forget password",
            text: `here your reset password code ${renderedUser.otpCode}`,
        });
      * 
      * 
      *  */   


    
};

export const changePassword = async (req, res, next) => {
    try {
        const { code, newPassword, email } = req.body;
        const renderedUser = await User.findOne({ email });
        if (!renderedUser) {
            throw new Error("wrong email");
        }
        if (renderedUser.otpCode != code) {
            throw new Error("wrong code");
        }

        const updatedUser = await User.findOneAndUpdate({ _id: renderedUser._id || renderedUser.id }, {
            $set: {
                password: await bcrypt.hash(newPassword, 10),
                otpCode: Math.floor(1000 + Math.random() * 9000),
            }
        }
            , { returnOriginal: false });
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
}

export const changePasswordInProfile = async (req, res, next) => {
    try {
        const {id} = req.params;
        const { password, newPassword } = req.body;
        const renderedUser = await User.findOne({ _id: id });
        if (!renderedUser) {
            throw new Error("wrong email");
        }
        const checkIfPasswordIsOkay = await bcrypt.compare(password, renderedUser.password);
        if (!checkIfPasswordIsOkay) {
            throw new Error("wrong password");
        }

        const updatedUser = await User.findOneAndUpdate({ _id: renderedUser._id || renderedUser.id }, {
            $set: {
                password: await bcrypt.hash(newPassword, 10),
            }
        }
            , { returnOriginal: false });
        res.status(200).json({ user: updatedUser });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
}


//  reset Password email

export  function resetPass(req,res){

    User.findOne({
        email: req.body.email,
      })
        .then((User) => {
          if (!User) {
          return res.status(404).send({ message: "User Not found." });
          }
          const newCode = Math.floor(1000 + Math.random() * 9000)
          User.otpCode = newCode;
          sendConfirmationEmail (req.body.email,newCode);
          User.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
          });
          res.status(200).send( {newCode}  );
        })
        .catch((e) => console.log("error", e));
        
      
    }
   