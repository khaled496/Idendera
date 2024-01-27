import express from'express' ;
import { checkSchema } from 'express-validator';

import  {GetPromo,GetALLPromo,addPromo,UpdatePromo,deletePromo,disablePromo,CheckPromo,getBestSellingPromos} from"../controllers/PromoController.js" ;





const router = express.Router();



/**
 * @swagger
 * components:
 *   schemas:
 *     Promo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The Auto-generated id of a categorie
 *         code:
 *           type: string
 *           description: code of a Promo
 *         discount:
 *           type: Number
 *           description: discount of a Promo
 *         expirationDate:
 *           type: date
 *           description: last name  of a user
 *         idUser:
 *           type: string
 *           description: name of a user
 *        
 *         
 *          
 *       example:
 *         code: 258789
 *         discount:  10
 *         expirationDate: 10/10/2020
 *         idUser : 642a92165ef8add530718fb1
 *         
 * 
 *         
 *
 */
/**
 * @swagger
 *  tags:
 *    name: Promo
 *    description: Promo
 */
/**
 * @swagger
 * /Promo/add:
 *   post:
 *     summary: Create a new Promo
 *     tags: [Promo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promo'
 *     responses:
 *       200:
 *         description: The Promo was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *       500:
 *         description: Some server error
 */
router.post('/add',addPromo)

router.route("/getBestSellingPromos")
.post(
    getBestSellingPromos
);
/**
 * @swagger
 * /Promo/update/{id}:
 *   post:
 *     summary: updates Promo by id
 *     tags: [Promo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promo'
 *     responses:
 *       200:
 *         decsription: The Promo was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *       404:
 *         description: Promo was not found.
 *       500:
 *         description: Some errors happend.
 *
 */
router.post('/update/:id',UpdatePromo);
router.post('/check/',CheckPromo);
/**
 * @swagger
 * /Promo/disable/{id}:
 *   post:
 *     summary: disable Promo by id
 *     tags: [Promo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promo'
 *     responses:
 *       200:
 *         decsription: The Promo was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *       404:
 *         description: Promo was not found.
 *       500:
 *         description: Some errors happend.
 *
 */
 router.post('/disable/:id',disablePromo);
 




/**
 * @swagger
 *  /Promo/delete/{id}:
 *    delete:
 *      summary: removes a Promo
 *      tags: [Promo]
 *      parameters:
 *        - in: path
 *          name: id
 *          description:  id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The Promo was deleted
 *        404:
 *          description: The Promo was not found
 *
 */
router.delete('/delete/:id',deletePromo)
/**
 * @swagger
 *  /Promo/{id}:
 *    get:
 *      summary: Get a Promo
 *      tags: [Promo]
 *      parameters:
 *        - in: path
 *          name: id
 *          description:  id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Promo by its id
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *        404:
 *          description: The Promo was not found
 *
 */
router.get('/:id',GetPromo)

/**
 * @swagger
 *  /Promo:
 *    get:
 *      summary: Get a Promo
 *      tags: [Promo]
 *     
 *      responses:
 *        200:
 *          description: Promo 
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *        404:
 *          description: The Promo was not found
 *
 */
 router.get('/',GetALLPromo)

 /**
 * @swagger
 * /Promo/update/{id}:
 *   post:
 *     summary: updates Promo by id
 *     tags: [Promo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promo'
 *     responses:
 *       200:
 *         decsription: The Promo was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promo'
 *       404:
 *         description: Promo was not found.
 *       500:
 *         description: Some errors happend.
 *
 */
router.post('/update/:id',UpdatePromo);


export default router;