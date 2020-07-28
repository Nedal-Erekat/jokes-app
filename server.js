//useful express codes
require('dotenv').config();

const express=require('express');
const pg=require('pg');
const superagent=require('superagent');
const methodOverride=require('method-override');


const client=new pg.Client(process.env.DATABASE_URL);
const app=express();
const PORT=process.env.PORT;



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');

app.get('/',loadJokes);
app.post('/add',addToDB);
app.get('/loadfav',loadFav);
app.post('/detailes/:id', editinfo);

function editinfo(req,res) {
    let sql=`select * from favjokes where id=${req.params.id}; `;
    client.query(sql)
    .then(data=>{
        res.render('form',{joke:data.rows})
    })
}

function loadFav(req,res) {
    let sql=`select * from favjokes;`;
    client.query(sql)
    .then(result=>{
        res.render('fav',{myJokes:result.rows})
    })
}

function addToDB(req,res) {
    let {type, setup, punchline}=req.body;
    let sql =`INSERT INTO favjokes (type, setup, punchline) VALUES ($1, $2, $3);`;
    let values=[type, setup, punchline];
    client.query(sql,values)
    .then(()=>{
        res.redirect('/loadfav')
    })
}

function loadJokes(req,res) {
    let url =`https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url)
    .then(data=>{
        
        let creatCards=data.body.map(ele=>{
            return new Joke(ele);
        })
        res.render('index',{allJokes:creatCards});
    })
}
function Joke(obj) {
    this.type=obj.type;
    this.setup=obj.setup;
    this.punchline=obj.punchline;
}

client.connect()
.then(app.listen(PORT,()=>{
    console.log(`listen on port ${PORT}`);
}))