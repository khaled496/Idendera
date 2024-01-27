import { Product } from "../Models/Product.js"; 
import { validationResult } from "express-validator";
import { getPrivateKeyByAccountId,getAccountByEmail } from './user.js';
import {
  AccountId,
  PrivateKey,
  Client,
  Hbar,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  TokenAssociateTransaction,
  AccountCreateTransaction,
  CustomRoyaltyFee,
  TokenInfoQuery,
  TokenUpdateTransaction,
  TokenFeeScheduleUpdateTransaction,
  FileCreateTransaction,
  TokenNftInfoQuery,
} from "@hashgraph/sdk";
async function CreateNFT(pvk,ac1)
{
  const myAccountId = AccountId.fromString("0.0.5902618");
  const myAccountKey = PrivateKey.fromString(
    "3030020100300706052b8104000a0422042047865a505bf0f0708f4291cf1a9620dd8a8fdc9cb3bf7482a468712a45db9c37"
  );
 
const account1pvk = PrivateKey.fromString(pvk);
const account1 = AccountId.fromString(ac1);
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myAccountKey);

///////////// createeeeee NFT
   
const royalityfees = new CustomRoyaltyFee()
.setNumerator(5)
.setDenominator(100)
.setFeeCollectorAccountId(myAccountId);
const customfees = [royalityfees] ;

const nftcreate= await new TokenCreateTransaction()
.setTokenName("Nft exercice")
.setTokenSymbol("NFE")
.setTokenMemo("collection NFT")
.setTreasuryAccountId(myAccountId)
.setAdminKey(myAccountKey)
.setCustomFees(customfees)
.setTokenType(TokenType.NonFungibleUnique)
.setSupplyKey(account1pvk)
.setSupplyType(TokenSupplyType.Finite)
.setMaxSupply(100)
.setFeeScheduleKey(account1pvk)
.setMaxTransactionFee(100000)
.freezeWith(client);
   
     const sing1 =await nftcreate.sign(myAccountKey);
     //const sign2 = await sing1.sign(account1pvk);
     //const sign3 = await sign2.sign(account2pvk);
    const tx =await sing1.execute(client);

   const receiptNft = await tx.getReceipt(client);
    const tokenid = receiptNft.tokenId;
    console.log(tokenid);

    const CID = [
      Buffer.from(
        "ipfs://QmVietVUvbzPgVQRXpC7hb9SgSQHrx3r5P3JXFZwLVDDdn"
      )];
    const mintNFT = await new TokenMintTransaction()
      .setTokenId(tokenid)
      .setMetadata(CID) 
      .freezeWith(client);

    const signm= await mintNFT.sign(account1pvk);
    const txm = await signm.execute(client);
    await txm.getReceipt(client);
  
    console.log("miiint");
    console.log(txm.transactionId);
    const associateaccount = await new TokenAssociateTransaction()
    .setAccountId(account1)
    .setTokenIds([tokenid])
    .freezeWith(client)

    const sign1ass = await associateaccount.sign(account1pvk);
    const txas = await sign1ass.execute(client);
    await txas.getReceipt(client);

//////////////////////////////////// transfer 

const nfttransfer = await new TransferTransaction()
.addNftTransfer(tokenid,1,myAccountId,account1)
.freezeWith(client);

const signt = await nfttransfer.sign(myAccountKey);
const txs = await signt.execute(client);
await txs.getReceipt(client);
return tokenid.toString();
///////////// get NFT infooooooooooooooo

}
export async function sendNFT(req, res)
{  const myAccountId = AccountId.fromString("0.0.5902618");
const myAccountKey = PrivateKey.fromString(
  "3030020100300706052b8104000a0422042047865a505bf0f0708f4291cf1a9620dd8a8fdc9cb3bf7482a468712a45db9c37"
);

const client = Client.forTestnet();
client.setOperator(myAccountId, myAccountKey);
  try {
    const accountInfo = await getAccountByEmail(req.params.email);

    if (!accountInfo) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Destructure the values from the result
    const { privatekey, accid } = accountInfo;

    // Now you can use privatekey and accid in your logic
    console.log(privatekey);
    console.log(accid);

   const sellerpvk=PrivateKey.fromString(await getPrivateKeyByAccountId(req.params.sellerId.toString()));
const sellerId = AccountId.fromString(req.params.sellerId.toString());
const buyerpvk = PrivateKey.fromString(privatekey);
const buyeraccid = AccountId.fromString(accid);
const balance11 = await new AccountBalanceQuery()
.setAccountId(sellerId)
.execute(client);
console.log(balance11.tokens.toString());
const balance12 = await new AccountBalanceQuery()
.setAccountId(buyeraccid)
.execute(client);

const tokens = balance12.tokens;
const tokenIdToCheck = req.params.tokenId;
const tokensString =balance11.tokens.toString()
// Check if the tokenIdToCheck is present in the tokens array
//const isTokenPresent = tokens.find(token => token.tokenId.toString() === tokenIdToCheck);
const isTokenPresent = tokensString.includes(tokenIdToCheck);
if (isTokenPresent) {
    console.log(`The account ${buyeraccid} contains the token ${tokenIdToCheck}.`);
} else {
    console.log(`The account ${buyeraccid} does not contain the token ${tokenIdToCheck}.`);
}
//   const isAssociated = await isNFTAssociatedWithAccount(client, req.params.tokenId, buyeraccid);


    // Proceed with token association
    const associateaccount2 = await new TokenAssociateTransaction()
        .setAccountId(buyeraccid)
        .setTokenIds([req.params.tokenId])
        .freezeWith(client);

    const sign2ass = await associateaccount2.sign(buyerpvk);
    const txas2 = await sign2ass.execute(client);
    await txas2.getReceipt(client);

   const nfttransfer2 = await new TransferTransaction()
   .addNftTransfer(req.params.tokenId.toString(),1,sellerId, buyeraccid)
   .freezeWith(client);
   
   const signt2 = await nfttransfer2.sign(sellerpvk);
   const txs2 = await signt2.execute(client);
   await txs2.getReceipt(client);
    // Send a success response
    const balance21 = await new AccountBalanceQuery()
.setAccountId(sellerId)
.execute(client);
console.log(balance21.tokens.toString());


const balance22 = await new AccountBalanceQuery()
.setAccountId(buyeraccid)
.execute(client);
console.log(balance22.tokens.toString());
await updateOnceS(req.params.tokenId.toString(),buyeraccid);
    res.status(200).json({ message: 'NFT sent successfully' });
  } catch (err) {
    // Handle any errors that occur during the process
    console.error('Error sending NFT:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
}
export function getAllS(req, res) {
  Product.find({}).where('Seller').equals(req.params.Seller).exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function getAllCat(req, res) {
  Product.find({}).where('category').equals(req.params.category).exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function getAll(req, res) {
  Product.find({})
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function getById(req, res) {
  Product.findById(req.params.id)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
async function isNFTAssociatedWithAccount(client, tokenId, accountId) {
    try {
        const tokenNftInfo = await new TokenNftInfoQuery()
            .setTokenId(tokenId)
            .execute(client);

        const accounts = tokenNftInfo.accounts;
        return accounts.includes(accountId);
    } catch (error) {
        console.error("Error checking NFT association:", error);
        return false;
    }
}




export async function addOnce(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    const tokenid=await CreateNFT(await getPrivateKeyByAccountId(req.body.Seller),req.body.Seller) ;
    Product.create({
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      ratings: req.body.ratings,
      category: tokenid,
      AR: req.body.AR,
      Seller: req.body.Seller,
     // Image:  req.body.Image
      Image: `/media/${req.file.filename}`
      
     }) 
   
     .then(newGame =>{
        res.status(200).json(newGame)
       })
       .catch(err =>{
        res.status(500).json( err)
       })
    }
    }
   
export async function updateOnceS(tokenid, sellerid) {
  try {
      const updatedProduct = await Product.findOneAndUpdate(
          { category: tokenid },
          { Seller: sellerid },
          { new: true } // To return the updated document
      );

      if (updatedProduct) {
          console.log(`Product with category ${tokenid} updated successfully with Seller ${sellerid}`);
      } else {
          console.log(`Product with category ${tokenid} not found.`);
      }
  } catch (error) {
      console.error('Error updating product:', error);
      throw error; // Rethrow the error to be handled by the caller
  }
}
export async function updateOnce(req, res) {
  Product.findOneAndUpdate (
    { _id: req.params.id },
     {
       $inc: { quantity: -1 } ,
       
  
     }
  )
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteOnce(req, res) {
  Product.findOneAndRemove(req.id, req.body)
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
