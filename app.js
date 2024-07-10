var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
const mercadopago = require('mercadopago');

const client = new mercadopago.MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
    options: {
        // from docs
        integratorId: 'dev_24c65fb163bf11ea96500242ac130004',
    
    }
});
const preference = new mercadopago.Preference({client});


var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});


app.get('/success', function (req, res) {
    res.render('success', req.query);
});
app.get('/failure', function (req, res) {
    res.render('failure', req.query);
});
app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});
app.get('/checkout', function (req, res) {
    res.render('checkout', req.query);
});
app.post('/notifications', function (req, res) {
    res.status(200).send('OK');
});

app.post('/new_preference', function (req, res) {
    preference.create({
        body: {
            payment_methods: {
                excluded_payment_methods: [
                    {
                        id: "visa"
                    }
                ],
                excluded_payment_types: [
                    {
                        id: "ticket"
                    }
                ],
                installments: 6
            },
            items: [
                {
                    id: Number(1111),
                    title: req.body.title,
                    description: "Dispositivo móvil de Tienda e-commerce",
                    picture_url: req.body.img,
                    quantity: Number(req.body.unit),
                    unit_price: Number(req.body.price),
                }
            ],
            payer: {
                name: "Lalo",
                surname: "Landa",
                email: "test_user_36961754@testuser.com",
                phone: {
                    area_code: "+598",
                    number: 21996,
                },
                identification: {
                    type: "CI",
                    //auto generated from: https://picandocodigo.github.io/ci_js/
                    number: "91533399",
                },
                address: {
                    street_name: "Calle Falsa",
                    street_number: Number(123),
                    zip_code: "90000",
                }
            },
            back_urls: {
                "success": "https://www.success.com",
                "failure": "http://www.failure.com",
                "pending": "http://www.pending.com"
            },
            auto_return: "approved",
            notification_url: "https://webhook.site/",
            external_reference: process.env.EMAIL,
        }
    })
    .then(console.log)
    .catch(console.error);
});

app.listen(port);