//useful express codes
require('dotenv').config();

const express=require('express');
const pg=require('pg');
const superagent=require('superagent');
const methodOverride=require('method-override');


const client=new pg.Client(process.env.DATABASE_URL);
const app=express();
const PORT=process.env.PORT;


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');

app.get('/',loadJokes);

function loadJokes(req,res) {
    let url =`https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(url)
    .then(data=>{
        res.json(data.body)
        // let creatCards=
    })
}

client.connect()
.then(app.listen(PORT,()=>{
    console.log(`listen on port ${PORT}`);
}))