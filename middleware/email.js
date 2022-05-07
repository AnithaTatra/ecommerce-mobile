const nodemailer = require("nodemailer")
const ejs = require("ejs")
const{join} = require("path")


const transporter = nodemailer.createTransport({
    service:"gmail",
    port:465,
    auth:{
        user:"pinkyangelqueen123@gmail.com",
        pass:"pinky@123"
    }
});

async function mailSending(compose){
    console.log("ok....")
    try{
        
        const data= await ejs.renderFile(join(__dirname,'../templates/',compose.fileName),compose,compose.details)
        console.log(__dirname)
        const mailData= {
            to:compose.to,
            from:compose.from,
             html:data
        }
        transporter.sendMail(mailData,(err,data)=>{
           
            if(err){ 
                console.log("err",err.message)
             }else{
                console.log("Mail sent successfully")
                return 1
             }
        })
    }catch(error){
        console.log(error.message)
        process.exit(1);
    }
}
module.exports={
    mailSending:mailSending
}