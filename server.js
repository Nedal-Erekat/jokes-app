//useful express codes
require('dotenv').config();

const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');


const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
const PORT = process.env.PORT;



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', loadJokes);
app.post('/add', addToDB);
app.get('/loadfav', loadFav);
app.post('/detailes/:id', editinfo);
app.delete('/delet/:id', deletfromDB);
app.put('/updatejoke/:id', updateDataJokes);
app.get('/random',getrandomJoke);

function getrandomJoke(req,res) {
    let url = `https://official-joke-api.appspot.com/jokes/programming/random`;
    superagent.get(url)
        .then(data => {
            let creatCards = data.body.map(ele => {
                return new Joke(ele);
            })
            res.render('random', { allJokes: creatCards });
        })
    
}

function updateDataJokes(req, res) {
    let { type, setup, punchline } = req.body;
    let sql = `UPDATE favjokes SET type=$1, setup=$2, punchline=$3 WHERE id=${req.params.id};`;
    let values = [type, setup, punchline];
    client.query(sql,values)
    .then(()=>{
        res.redirect('/loadfav');
    })
}

function deletfromDB(req, res) {

    let sql = `DELETE FROM favjokes WHERE id=${req.params.id};`;
    client.query(sql)
        .then(() => {
            res.redirect('/loadfav');
        })
}

function editinfo(req, res) {
    let sql = `select * from favjokes where id=${req.params.id}; `;
    client.query(sql)
        .then(data => {
            res.render('form', { joke: data.rows })
        })
}

function loadFav(req, res) {
    let sql = `select * from favjokes;`;
    client.query(sql)
        .then(result => {
            res.render('fav', { myJokes: result.rows })
        })
}

function addToDB(req, res) {
    let { type, setup, punchline } = req.body;
    let sql = `INSERT INTO favjokes (type, setup, punchline) VALUES ($1, $2, $3);`;
    let values = [type, setup, punchline];
    client.query(sql, values)
        .then(() => {
            res.redirect('/loadfav')
        })
}

function loadJokes(req, res) {
    let url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url)
        .then(data => {
            let creatCards = data.body.map(ele => {
                return new Joke(ele);
            })
            res.render('index', { allJokes: creatCards });
        })
}
function Joke(obj) {
    this.type = obj.type;
    this.setup = obj.setup;
    this.punchline = obj.punchline;
}

client.connect()
    .then(app.listen(PORT, () => {
        console.log(`listen on port ${PORT}`);
    }))