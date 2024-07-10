import express from 'express';
import exphbs from 'express-handlebars'
import { MercadoPagoConfig, Preference } from 'mercadopago';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN
});

const preference = new Preference(client);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

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
    const payment_data = req.body;
    console.log(payment_data);
    res.status(200).json({result: payment_data});
});

app.post('/detail', async function (req, res) {
    const { title, price, unit, img } = req.body;
    await preference.create({
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
                    title: title,
                    description: "Dispositivo móvil de Tienda e-commerce",
                    picture_url: img,
                    quantity: Number(unit),
                    unit_price: Number(price),
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
                "success": "http://localhost:3000/success",
                "failure": "http://localhost:3000/failure",
                "pending": "http://localhost:3000/pending"
            },
            auto_return: "approved",
            notification_url: "http://localhost:3000/notifications",
            external_reference: process.env.EMAIL,
        },
        requestOptions: {
            integratorId: 'dev_24c65fb163bf11ea96500242ac130004',
        }
    })
    .then((response) => {
        console.log(response);
        response.json({id: response.id});
    })
    .catch(error => {
        console.log(error);
    });
});

app.listen(port);