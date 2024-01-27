import nodemailer from "nodemailer";





export async function  sendConfirmationEmail (email,activationCode)  {

  try {
    const transporter = nodemailer.createTransport({

      service: "Gmail",
      auth: { 
        user: "iheb.hamdi.1@esprit.tn",
        pass: "181JMT3411",
      },
    
    });

    await transporter.sendMail({

     from: "islem.naffeti@esprit.tn",
      to: email,
      subject: "Please confirm your account",
      text: "Email Confirmation " ,
       html: `<h1> This is your code </h1>
        <h3> ${activationCode}</h3>`,
    });
    
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

export default sendConfirmationEmail;