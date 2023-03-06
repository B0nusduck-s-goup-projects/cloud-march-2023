const express = require('express');
const bodyParser= require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://admin:admin@cluster0.oswenid.mongodb.net/?retryWrites=true&w=majority';

MongoClient.connect(connectionString,{useUnifiedTopology: true})
    .then(client=>{
        console.log('Database connected!'); 

        const db = client.db('asm2-dtb');
        const reportsCollector = db.collection('reports');

        app.set('view engine', 'ejs');

        app.use(bodyParser.urlencoded({ extended: true }));

        //gain access to resources file
        app.use(express.static('views'));

        app.use(bodyParser.json());
        
        //get data to print to screen
        app.get('/', (req, res) => {
            db.collection('reports').find().toArray()
                .then(results => {

                    console.log(results)
                    res.render('index.ejs', { reports: results })
                })
                .catch(/* ... */)
        })

        //post data to dtb
        app.post('/reports', (req, res) => {
            reportsCollector.insertOne(req.body)
            .then(result => {
                
                console.log(result)

                res.redirect('/')
             })
            .catch(error => console.error(error))
        })
        
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })

