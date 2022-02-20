const dependencies = require('../dependencies')
const config = require('../config')
const transporter = dependencies.use.nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: config.mailSenderEmail, pass: config.mailSenderPassword }
})

async function forgotPassword(receiverEmail, receiverName, accessToken, callback) {
    const mailOptions = {
        from: 'skillsTestMail',
        to: receiverEmail,
        subject: 'Recover your password',
        text: `Hi ${receiverName}, apparently you forgot your password, go to this link to recover it. - <password recovery interface url>?token=${accessToken}`
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            callback({ error: error })
        } else {
            callback({ success: true })
        }
    })
}

module.exports = {
    forgotPassword
}