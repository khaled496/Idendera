import express from 'express';
import { register, deleteOnce, getAll, getOnce, patchOnce, login, profile, sendMail, sendRegistrationMail, forgetPassword, changePassword, changePasswordInProfile, resetPass } from '../controllers/user.js';
//import sendRegistrationMail from '../controllers/user.js'
import { checkToken } from '../middlewares/auth.js';

const router = express.Router();

// create account
router
    .route('/register')
    .post(register);


// login

router
    .route('/login')
    .post(login);


   
    
    /*router
    .post("/forgetPassword", forgetPassword);
*/
    router
    .route('/reset' ).post(resetPass);


    router.post("/changePassword", changePassword);
    
router.post("/changePasswordProfile/:id", changePasswordInProfile);

router
    .route('/mail')
    .post(sendMail);

/**
 * router
    .route('/')
    .get(checkToken, getAll)
    .post(register);


     

    
    router
    .route('/register')
    .post(sendRegistrationMail);

router
    .route('/:id')
    .patch(checkToken, patchOnce)
    .delete(checkToken, deleteOnce);
router.get("/profile", checkToken, profile)
router.post("/login", login);




 */
export default router;