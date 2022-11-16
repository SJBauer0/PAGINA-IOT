const express = require('express');
const Swal = require('sweetalert2')
const app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static('/public'))
app.use('/resources', express.static(__dirname + './views'))
app.use(express.static('public'))


app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session')
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}))

const connection = require('./database/db');

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.get('/info', (req, res)=>{
    res.render('info')
})

app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass,8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name ,pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('index')
        }
    })
})

app.post('/auth', async (req,res)=>{
    const user = req.body.user
    const pass = req.body.pass
    let passwordHaash = await bcryptjs.hash(pass, 8)
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('index')
            }else{
                res.render('login')
            }
        })
    }
})

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})

