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
                id: "",
                title: "",
                description: "Dispositivo móvil de Tienda e-commerce",
                picture_url: "",
                quantity: 1,
                unit_price: 100,

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
                street_name: "Street street",
                street_number: 1602,
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


var app = express();
 
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

app.listen(port);