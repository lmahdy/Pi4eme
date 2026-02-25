const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "ttttfarah@gmail.com",
        pass: "ozgpbrxwugzhcwgi",
    },
});

async function main() {
    try {
        const info = await transporter.sendMail({
            from: "ttttfarah@gmail.com",
            to: "ttttfarah@gmail.com",
            subject: "Test Email from Node scripts",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

main();
