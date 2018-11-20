var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var express_graphql = require('express-graphql'); //GraphQL
var { buildSchema } = require('graphql'); //GraphQL

// Connection URL
const url = 'mongodb://192.168.1.20:27017';

app.use(bodyParser.json())
app.use(express.static(__dirname + '/View'));
app.use(bodyParser.urlencoded({ extend: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//GraphQL
const schema = buildSchema(`
  type Query {
    coleccion: [Coleccion]
    partes : [Partes]
    parte(_id:Int) : [Partes]
    parteColor(color:String):[Partes]
    catalogos : [Catalogos]
    catalogo(_id:Int) : [Catalogos]
    proveedores : [Proveedores]
    proveedor(_id:Int) : [Proveedores]
  },
  type Coleccion{
    collectionName:String
  },
  type Partes{
    _id: Int
    nombrepa: String
    color: String
  },
  type Catalogos{
    _id : Int
    idp : Int
    idpa : Int
    precio : Float
  },
  type Proveedores{
    _id : Int
    nombrep : String
    direccionp : String
  }
`)
auxGraph = {
    parte: [],
    parteColor: [],
    partes: [],
    catalogo: [],
    catalogos: [],
    proveedor: [],
    proveedores: [],
    coleccion: []
}
const rootValue = {
    parte: (arg) => {
        return new Promise((res, rej) => {
            auxGraph.parte = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collection('Partes').find({}).forEach((datos) => {
                    if (datos._id == arg._id) {
                        auxGraph.parte.push(datos)
                    }
                }).then(() => { res(auxGraph.parte) })
            })
        })
    },
    parteColor: (arg) => {
        return new Promise((res, rej) => {
            auxGraph.parteColor = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collection('Partes').find({}).forEach((datos) => {
                    if (datos.color == arg.color) {
                        auxGraph.parteColor.push(datos)
                    }
                }).then(() => { res(auxGraph.parteColor) })
            })
        })
    },
    partes: () => {
        return new Promise((res, rej) => {
            auxGraph.partes = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collection('Partes').find({}).forEach((datos) => {
                    auxGraph.partes.push(datos)
                }).then(() => { res(auxGraph.partes) })
            })
        })
    },
    catalogo: (arg) => {
        return new Promise((res, rej) => {
            auxGraph.catalogo = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collection('Catalogo').find({}).forEach((datos) => {
                    if (datos._id == arg._id) {
                        auxGraph.catalogo.push(datos)
                    }
                }).then(() => { res(auxGraph.catalogo) })
            })
        })
    },
    catalogos: () => {
        return new Promise((res, rej) => {
            auxGraph.catalogos = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collection('Catalogo').find({}).forEach((datos) => {
                    auxGraph.catalogos.push(datos)
                }).then(() => { res(auxGraph.catalogos) })
            })
        })
    },
    proveedor: (arg) => {
        return new Promise((res, rej) => {
            auxGraph.proveedor = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collection('Proveedores').find({}).forEach((datos) => {
                    if (datos._id == arg._id) {
                        auxGraph.proveedor.push(datos)
                    }
                }).then(() => { res(auxGraph.proveedor) })
            })
        })
    },
    proveedores: () => {
        return new Promise((res, rej) => {
            auxGraph.proveedores = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collection('Proveedores').find({}).forEach((datos) => {
                    auxGraph.proveedores.push(datos)
                }).then(() => { res(auxGraph.proveedores) })
            })
        })
    },
    coleccion: () => {
        return new Promise((res, rej) => {
            auxGraph.coleccion = []
            MongoClient.connect(url, function (err, client) {
                client.db('Integrador').collections().then((datos) => {
                    auxGraph.coleccion = datos
                }).then(() => { res(auxGraph.coleccion) })
            })
        })
    },
}





app.use('/graphql', express_graphql({
    schema,
    rootValue,
    graphiql: true
}))

//Render consulta1.html
app.get('/consulta1', function (req, res) {
    res.sendFile(__dirname + '/View/consulta1.html');
});

//POST consulta1----------Resuelto-----------------
app.post('/consulta1', function (req, res) {
    let colorbody = req.body.color;


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

            aux = {
                partesRojas: [],
                catalogoPaRojas: [],
                proveedores: []
            }

            partes.find({ color: colorbody }).forEach(function (myDoc) {
                //console.log( "user: " + myDoc._id ); 
                aux.partesRojas.push(myDoc._id)
            }).then(function () {
                catalogo.find({ idpa: { $in: aux.partesRojas } }).forEach(function (e) {
                    //console.log(e)
                    aux.catalogoPaRojas.push(e.idp)
                }).then(function () {
                    proveedores.find({ _id: { $in: aux.catalogoPaRojas } }).forEach(function (proveedor) {
                        aux.proveedores.push(proveedor.nombrep)
                    }).then(function () {
                        res.json('Nombre de proveedores que proveen Partes ' + colorbody + ' : ' + aux.proveedores)
                    })
                })
            })
        }
    })
})

//Render consulta2.html
app.get('/consulta2', function (req, res) {
    res.sendFile(__dirname + '/View/consulta2.html');
});

//POST consulta2---------Resuelto-----------------
app.post('/consulta2', function (req, res) {
    let colorbody1 = req.body.color1;
    let colorbody2 = req.body.color2;
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

            aux = {
                partesRojas2: [],
                catalogoPaRojas2: [],
                proveedores2: []
            }

            partes.find({ color: { $in: [colorbody1, colorbody2] } }).forEach(function (myDoc) {
                //console.log( "user: " + myDoc._id ); 
                aux.partesRojas2.push(myDoc._id)
            }).then(function () {
                catalogo.find({ idpa: { $in: aux.partesRojas2 } }).forEach(function (e) {
                    //console.log(e)
                    aux.catalogoPaRojas2.push(e.idp)
                }).then(function () {
                    proveedores.find({ _id: { $in: aux.catalogoPaRojas2 } }).forEach(function (proveedor) {
                        aux.proveedores2.push(proveedor._id)
                    }).then(function () {
                        res.json('Id de proveedores que proveen Partes ' + colorbody1 + ' o Partes ' + colorbody2 + ' : ' + aux.proveedores)
                    })
                })
            })
        }
    })
})

//Render consulta3.html
app.get('/consulta3', function (req, res) {
    res.sendFile(__dirname + '/View/consulta3.html');

});

//POST consulta3--------------------Resuelto---------------
app.post('/consulta3', function (req, res) {
    let colorbody1 = req.body.color;

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

            aux = {
                partesRojas3: [],
                catalogoPaRojas3: [],
                proveedores3: []
            }

            partes.find({ color: colorbody1 }).forEach(function (myDoc) {
                aux.partesRojas3.push(myDoc._id)

            }).then(function () {

                catalogo.find({ idpa: { $in: aux.partesRojas3 } }).forEach(function (e) {
                    aux.catalogoPaRojas3.push(e.idp)

                }).then(function () {
                    proveedores.find({ $or: [{ _id: { $in: aux.catalogoPaRojas3 } }, { direccionp: '99999 Short Pier, Terra Del Fuego, TX 41299' }] }).forEach(function (proveedor) {
                        aux.proveedores3.push(proveedor._id)

                    }).then(function () {
                        res.json('Id de Proveedores que provean alguna parte ' + colorbody1 + ' o vivan en 99999 Short Pier, Terra Del Fuego, TX 41299: ' + aux.proveedores)
                    })
                })
            })
        }
    })
})
//Render consulta4.html
app.get('/consulta4', function (req, res) {
    res.sendFile(__dirname + '/View/consulta4.html');
});

//POST consulta4---------------------Resuelto------------------
app.post('/consulta4', function (req, res) {
    let colorbody1 = req.body.color1;
    let colorbody2 = req.body.color2;

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

            aux4 = {
                partesRojas: [],
                partesVerdes: [],
                catalogoPaRojas: [],
                catalogoPaVerde: [],
                proveedores: [],
                proveedoresV: []
            }

            partes.find({ color: colorbody1 }).forEach(function (myDoc) {
                //console.log( "user: " + myDoc._id ); 
                aux4.partesRojas.push(myDoc._id)
            }).then(function () {
                catalogo.find({ idpa: { $in: aux4.partesRojas } }).forEach(function (e) {
                    //console.log(e)
                    aux4.catalogoPaRojas.push(e.idp)
                }).then(function () {
                    partes.find({ color: colorbody2 }).forEach(function (myDocu) {
                        aux4.partesVerdes.push(myDocu._id)
                    }).then(function () {
                        catalogo.find({ idpa: { $in: aux4.partesVerdes } }).forEach(function (e1) {
                            aux4.catalogoPaVerde.push(e1.idp)
                        }).then(function () {
                            proveedores.find({ $and: [{ _id: { $in: aux4.catalogoPaRojas } }, { _id: { $in: aux4.catalogoPaVerde } }] }).forEach(function (proveedor) {
                                aux4.proveedores.push(proveedor._id)
                            }).then(function () {
                                res.json('id de proveedores que venden partes ' + colorbody1 + ' y partes ' + colorbody2 + ' : ' + aux4.proveedores)
                            })
                        })
                    })
                })
            })

        }
    })
})

//Render consulta5.html
app.get('/consulta5', function (req, res) {
    res.sendFile(__dirname + '/View/consulta5.html');
});

//POST consulta5-------------------------Resuelto----------------
app.post('/consulta5', function (req, res) {

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

            //encuentre los sid de los proveedores que proveen cada parte
            var aux = {
                prov: []
            }

            catalogo.find({}).toArray( e => {
                console.log(e)
            })
            catalogo.aggregate([
                {
                    $group: {
                        _id: "$idp",
                        count: { $sum: 1 }
                    }
                },
                {
                    $match: { count: {$gt:8} }     
                }
            ])
                .forEach(function (doc) {
                    aux.prov.push(doc)
                }).then(() =>{
                    res.json(aux.prov)
                })
        }
    })
})

//Render consulta6.html
app.get('/consulta6', function (req, res) {
    res.sendFile(__dirname + '/View/consulta6.html');
});

//POST consulta6
app.post('/consulta6', function (req, res) {
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




    }
})



//Render consulta7.html
app.get('/consulta7', function (req, res) {
    res.sendFile(__dirname + '/View/consulta7.html');
});


//POST consulta7
app.post('/consulta7', function (req, res) {

})
//Render consulta8.html
app.get('/consulta8', function (req, res) {
    res.sendFile(__dirname + '/View/consulta8.html');
});

//POST consulta8
app.post('/consulta8', function (req, res) {

})

//Render consulta9.html
app.get('/consulta9', function (req, res) {
    res.sendFile(__dirname + '/View/consulta9.html');
});

//POST consulta9-----------------------Resuelto-----------------------
app.post('/consulta9', function (req, res) {

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
                prov: []
            }

            catalogo.aggregate([
                {
                    $project: {
                        _id: "$idpa",
                        precio: "$precio",
                    }
                }]).forEach(function (doc) {
                    aux.prov.push(doc._id + ": " + doc.precio)
                }).then(function () {
                    res.json(aux.prov)
            })
        }
    })
});

//Render consulta10.html
app.get('/consulta10', function (req, res) {
    res.sendFile(__dirname + '/View/consulta10.html');
});

//POST consulta10-----------------------Resuelto-------------------------
app.post('/consulta10', function (req, res) {

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

            //encuentre los pids de partes que sea provistas por al menos 2 proveedores
            var aux = {
                prov: []
            }
            catalogo.aggregate([
                {
                    $group: {
                        _id: "$idpa",
                        count: { $sum: 1 }
                    }
                },
                {
                    $match: { count: { $gt: 1 } }
                }
            ])
                .forEach(function (doc) {
                    aux.prov.push(doc)

                }).then(function () {
                    res.json(aux.prov)
                })
        }
    })
})

app.post('/', function (req, res) {
    res.sendFile(__dirname + '/View/index.html');
});


// --------------------------Connect to the MongoDB
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

//----------------------------Parts DB Json
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

//---------------------------Catalog DB Json
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
},
{
    _id: 12, idp: 1, idpa: 9, precio: 10.50
},
{
    _id: 13, idp: 1, idpa: 5, precio: 10.50
},
{
    _id: 14, idp: 1, idpa: 7, precio: 12.50
},
{
    _id: 15, idp: 1, idpa: 2, precio: 12.50
},
{
    _id: 16, idp: 1, idpa: 6, precio: 12.50
},
{
    _id: 17, idp: 1, idpa: 1, precio: 12.50
},
];

//---------------------------Suppliers DB Json
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