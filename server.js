const express = require('express');
const bodyParser =require('body-parser');
var knex = require('knex');
var port=process.env.PORT||3000;
const db=knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'super',
    database : 'newdb'
  }
});
// const namei='ishan'
// db.select('*').from('users').where('username','=',namei).then(data=>{
//   console.log(data);
// })

// db('users').insert(
// {username: 'ishan',
// email: 'ish@gmail.com',
// phone:'455'
// }).then();
const app = express();
app.use(bodyParser.json());
app.post('/signin',(req,res)=> {
    //const { name,mail,phoneno } = req.body;
    //console.log(req.body.username);
    db('users').insert(
    {username: req.body.username,
    email:req.body.email,
    phone:req.body.phone
    }).then();
    res.json("hello mis");
});
app.get('/',(req,res)=> {
    res.send("hiiii");
})
app.post('/createteam',(req,res)=> {
  db('allteamname').where('teamname', '=', req.body.teamname)
  .then(data =>{
    if (data.length===0){
      db('allteamname').insert(
      {teamname: req.body.teamname
      }).then();

        db.schema.createTable(req.body.teamname, function (table) {
        table.string('username');
        table.string('location');
        table.string('phone');
      }).then(data=>{
            if (data.command=='CREATE') {
              db(req.body.teamname).insert(
              {username: req.body.username,
              location:req.body.location,
              phone:req.body.phone
              }).then();
            }
      });
      res.json("team created");
    }
    else {
      res.json("team already exist");
    }
  });
});




app.post('/jointeam',(req,res)=> {
  db('allteamname').where('teamname', '=', req.body.teamname)
  .then(data =>{
    if (data.length!=0){
      db(req.body.teamname).insert(
      {username: req.body.username,
      location:req.body.location,
      phone:req.body.phone
      }).then();
      res.json("joined successfully");
    }
    else {
      res.json("enter valid team name");
    }
  })
});
app.listen(port);
