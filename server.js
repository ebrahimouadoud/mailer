const express = require('express')
const app = express();
const mailer = require("./mailer")
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;
require("dotenv").config();

const psw = process.env.psw;
var _hash = null
app.use(express.json());    
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
bcrypt.genSalt(saltRounds, function(err, salt) {
    if(err) 
        console.log('err::',err)
    console.log("salt, ", salt)
    bcrypt.hash(psw, salt, function(err, hash) {
        // Store hash in your password DB.
        console.log(' HASH :', hash)
        _hash = hash
    });
});
app.listen(3000, () => { 
    //logger.info( 'Server listening' )
    console.log(' SERVER LESTENING ')
} )
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});
app.get('/:id', (req,res) => {
    console.log(' _hash ', _hash)
    console.log(' Res . p : ', req.params)
    bcrypt.compare(req.params.id, _hash, function(err, result) {
        console.log(' REs:', result)
    });
    res.json( "i'm running." );
})
app.post('/send', function(req,res) {
    if (req.body.email === 'undefined' || !req.body.email) {
        res.status(400).send({
            message: "e is required!"
        });
        return;
    }
    if (req.body.event === 'undefined' || !req.body.event) {
        res.status(400).send({
            message: "v is required!"
        });
        return;
    }
    if (req.body.pwd === 'undefined' || !req.body.pwd) {
        res.status(400).send({
            message: "required!"
        });
        return;
    }
    
    bcrypt.compare(req.body.pwd, _hash, function(err, result) {
        if(result === true ){
            mailer.sendEvent(req.body.email,req.body.event)
            res.json( "i'm sending." );
        }else{
            return res.status(403).send({
                message: "FBDN"
              });
        }
    });
    
   
})