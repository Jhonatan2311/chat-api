const nodemailer = require("nodemailer");

const sendMail = mailOptions => {
    return new Promise((resolve, reject) =>{		
		nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: '',
                pass: ''
            }
        }).sendMail(mailOptions, function(err, info) {
			if (err) return reject(err);
			resolve(mailOptions);
		});
	})
};

const sendPassword = async data => {
    try {
        const mailOptions = {
            from: `Chat <>`,
            to: data.email,
            subject: `Chat - Nova Senha`,
            html: `Sua nova senha de acesso é: <b>${data.senha}</b>`
        }
        return await sendMail(mailOptions);        
    } catch (error) {
        throw new Error(error);
    } 
};

module.exports = {
    sendPassword,
};