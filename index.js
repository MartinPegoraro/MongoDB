var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// Connection URL
const url = 'mongodb://192.168.1.20:27017';


app.use(express.static(__dirname + '/View'));
app.use(bodyParser.urlencoded({ extend: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



//Render consulta1.html
app.get('/consulta1', function (req, res) {
    res.sendFile(__dirname + '/View/consulta1.html');
});

//POST consulta1
app.post('/consulta1', function (req, res) {
    let colorbody = req.body.color;
    var aux = {
        parteID: [],
        proveedoresCompleto: [],
        catalogoCompleto: []
    }
    function cargar() {
        MongoClient.connect(url, function (err, client) {
           
                // Conectado
                console.log('Coneccion establecida con', url);
                const db = client.db('Integrador'); //DB en USO
                //Coleccion Partes
                var partes = db.collection('Partes');
                //Coleccion Proveedores                           
                var proveedores = db.collection('Proveedores');
                //Coleccion Catalogo                                                                                
                var catalogo = db.collection('Catalogo');

                partes.find({ color: colorbody }).toArray().then(e => {
                    aux.parteID = e;
                })

                proveedores.find({}).toArray().then(e => {
                    aux.proveedoresCompleto = e;
                })

                catalogo.find({}).toArray().then(e => {
                    aux.catalogoCompleto = e;
                })
            
        })
    }
    cargar()
    console.log('asd')
})

//Render consulta2.html
app.get('/consulta2', function (req, res) {
    res.sendFile(__dirname + '/View/consulta2.html');
});

//POST consulta2
app.post('/consulta2', function (req, res) {
    let bodycolor1 = req.body.color1;
    let bodycolor2 = req.body.color2;
    MongoClient.connect(url, function (err, client) {
        if (err) {
            console.log('No fue posible conectarde al servido', err);
        } else {
            // Conectado
            console.log('Coneccion establecida con', url);
            const db = client.db('Integrador'); //DB en USO
            //Coleccion Partes
            var partes = db.collection('Partes');
            //Coleccion Proveedores                           
            var proveedores = db.collection('Proveedores');
            //Coleccion Catalogo                                                                                
            var catalogo = db.collection('Catalogo');

            var aux = {
                c1: [],
                c2: []
            }

            aux.c1 = findIdpaConColor(db, bodycolor1, function () {
                client.close();
            });
            aux.c2 = findIdpaConColor(db, bodycolor2, function () {
                client.close();
            });

            aux1 = {
                i1: [],
                i2: []
            }
            var z = 0
            for (z = 1; z < 3; z++) {
                aux1.i1 = findIdpConIdpa(db, aux.c1[z], function () {
                    client.close();
                })
            }

            function findIdpaConColor(db, valor, callback) {
                // Get the documents collection
                const collection = db.collection('Partes');
                // Find some documents
                collection
                    .find({ color: valor })
                    .project({ _id: 1 })
                    .toArray(function (err, docs) {
                        console.log("Found the following records");
                        console.log(docs)
                        callback(docs);
                        aux.a = docs;
                    });
                return (aux.a)
            }

            function findIdpConIdpa(db, valor, callback) {
                // Get the documents collection
                const collection = db.collection('Catalogo');
                // Find some documents
                collection
                    .find({ idp: valor })
                    .project({ _id: 1 })
                    .toArray(function (err, docs) {
                        console.log("Found the following records");
                        console.log(docs)
                        callback(docs);
                        aux.a = docs;
                    });
                return (aux.a)
            }


        }
    })
})

//Render consulta3.html
app.get('/consulta3', function (req, res) {
    res.sendFile(__dirname + '/View/consulta3.html');

});

//Render consulta4.html
app.get('/consulta4', function (req, res) {
    res.sendFile(__dirname + '/View/consulta4.html');
});

//Render consulta5.html
app.get('/consulta5', function (req, res) {
    res.sendFile(__dirname + '/View/consulta5.html');
});

//Render consulta6.html
app.get('/consulta6', function (req, res) {
    res.sendFile(__dirname + '/View/consulta6.html');
});

//Render consulta7.html
app.get('/consulta7', function (req, res) {
    res.sendFile(__dirname + '/View/consulta7.html');
});

//Render consulta8.html
app.get('/consulta8', function (req, res) {
    res.sendFile(__dirname + '/View/consulta8.html');
});

//Render consulta9.html
app.get('/consulta9', function (req, res) {
    res.sendFile(__dirname + '/View/consulta9.html');
});

//Render consulta10.html
app.get('/consulta10', function (req, res) {
    res.sendFile(__dirname + '/View/consulta10.html');
});

app.post('/', function (req, res) {
    res.sendFile(__dirname + '/View/index.html');
});


// Connect to the MongoDB
MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log('No fue posible conectarde al servido', err);
    } else {
        // Conectado
        console.log('Coneccion establecida con', url);

        const db = client.db('Integrador'); //DB en USO
        var partes = db.collection('Partes'); //Coleccion Partes
        var proveedores = db.collection('Proveedores'); //Coleccion Proveedores
        var catalogo = db.collection('Catalogo'); //Coleccion Catalogo

        //Cargar datos a BD
        //partes.insertMany(partesJson);
        //proveedores.insertMany(proveedoresJson);
        //catalogo.insertMany(catalogoJson);




    }
});

//Parts DB Json
partesJson = [{
    _id: 1, nombrepa: 'Left Handed Bacan', color: 'Red'
}, {
    _id: 2, nombrepa: 'Smoke Shifter', color: 'Black'
},
{
    _id: 3, nombrepa: 'Acme Widget Washer', color: 'Red'
},
{
    _id: 4, nombrepa: 'Acme Widget Washer', color: 'Silver'
},
{
    _id: 5, nombrepa: 'I Brake for Crop Circles Stricker', color: 'Translucent'
},
{
    _id: 6, nombrepa: 'Anti Gravity Turbine Generator', color: 'Cyan'
},
{
    _id: 7, nombrepa: 'Anti Gravity Turbine Generator', color: 'Magenta'
},
{
    _id: 8, nombrepa: 'Fire Hydrant Cap', color: 'Red'
},
{
    _id: 9, nombrepa: '7 Segment Display', color: 'Green'
}];

//Catalog DB Json
catalogoJson = [{
    _id: 1, idp: 1, idpa: 3, precio: 0.50
},
{
    _id: 2, idp: 1, idpa: 4, precio: 0.50
},
{
    _id: 3, idp: 1, idpa: 8, precio: 11.70
},
{
    _id: 4, idp: 2, idpa: 3, precio: 0.55
},
{
    _id: 5, idp: 2, idpa: 8, precio: 7.95
},
{
    _id: 6, idp: 2, idpa: 1, precio: 16.50
},
{
    _id: 7, idp: 3, idpa: 8, precio: 12.50
},
{
    _id: 8, idp: 3, idpa: 9, precio: 1
},
{
    _id: 9, idp: 4, idpa: 5, precio: 2.20
},
{
    _id: 10, idp: 4, idpa: 6, precio: 1247548.23
},
{
    _id: 11, idp: 4, idpa: 7, precio: 1247548.23
}];

//Suppliers DB Json
proveedoresJson = [{
    _id: 1, nombrep: 'Acme Widget Suppliers', direccionp: '1 Grub St., Potemkin Village, IL 61801'
},
{
    _id: 2, nombrep: 'Big Red Tool and Die', direccionp: '4 My Way, Bermuda Shorts, OR 90305'
},
{
    _id: 3, nombrep: 'Perfunctory Parts', direccionp: '99999 Short Pier, Terra Del Fuego, TX 41299'
},
{
    _id: 4, nombrep: 'Alien Aircaft Inc.', direccionp: '2 Groom Lake, Rachel, NV 51902'
}]


app.listen(3010);

console.log("Corriendo en localhost:3010");