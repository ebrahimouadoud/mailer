const nodemailer = require("nodemailer");
require("dotenv").config();

const user = process.env.user;
const pass = process.env.pass;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass,
    },
});

module.exports.sendEvent = (email, event) => {
    transport.sendMail({
        from: '<TRACK EVENT>',
        to: email,
        subject: 'Événement enregistré le : ' + event.created_at,
        html: `<div class="card border-dark">
                <div class="card-header bg-dark">
                    <h4 class="m-b-0 text-white">Événement: ${event.event_type}</h4></div>
                <div class="card-body">
                    <h3 class="card-title">Nom de l'agent: ${event.agentFullName}</h3>
                    <a href="javascript:void(0)" class="btn btn-primary">Observation: ${event.observation}</a>
                </div>
            </div>`
        }).catch(err => console.log(err));

}
