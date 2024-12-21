const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");
const { v4: uuidv4 } = require('uuid');
app.use(methodoverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "/views"))
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'nwsq1',
    password: "alcatraz@v11",
  });
  // let getrandomuser = ()=> {
  //   return [
  //     faker.string.uuid(),
  //     faker.internet.username(), // before version 9.1.0, use userName()
  //     faker.internet.email(),
  //     faker.internet.password(),
  //   ];
  // };
  // let q = "INSERT INTO user (id, username, email, password) VALUES ?";
  // let data = [];
  // for (let i = 1; i <=100; i++) {
  //    data.push(getrandomuser()); 
  // }
  //HOME ROUTE
  app.get("/",(req,res)=>{
    let  q= `SELECT count(*) FROM user`;
    try {
    connection.query(q,(err,result)=>{
       if (err)  throw err;
       let count = result[0]["count(*)"];
       res.render("home.ejs",{count})
      });
  } catch (err) {
    console.log(err);
    res.send("Some error in Db")
   }
 })
//SHOW ROUTE
 app.get("/user",(req,res)=>{
  let q = `SELECT * FROM user`;
  try {
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let data = result;
      res.render("show.ejs",{data});
    })
  } catch (error) {
    res.send("some error in bd")
  }
 })
 //Edit Route
 app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`
  try {
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs",{user});
    })
  } catch (error) {
    res.send("some error in bd")
  }

 })
 //PATCH OR UPDATE ROUTE
 app.patch("/user/:id",(req,res)=>{
   let {id} = req.params;
   let {password :formpssword,username : newuser} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let user = result[0];
      if (formpssword != user.password) {
        res.send("wrong password")
      }else{
        let q2 = `UPDATE user SET username='${newuser}' WHERE id='${id}'`;
        connection.query(q2,(err,res)=>{
          if (err) throw err;
          res.redirect("/user");
        });
      }
      res.send(user);
    })
  } catch (error) {
    res.send("some error in bd")
  }
 })
 app.get("/user/add",(req,res)=>{
  res.render("add.ejs");
 })
 app.post("/user/add",(req,res)=>{
  let {username,email,password} = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;
  try {
    connection.query(q,(err,result)=>{
      if (err) throw err;
      console.log("Added User");
      res.redirect("/user");
    })
  } catch (error) {
    res.send("some error in bd")
  }
 })
 app.get("/user/:id/delete",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q,(error,result)=>{
      if (error) throw error;
      let user = result[0];
      res.render("delete.ejs",{user});
  } );
}
catch (error) {
    res.send("some error in bd")
  }
 })
 app.delete("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q,(err,result)=>{
      if (err) throw err;
      let user = result[0];
      if (user.password!=password) {
        res.send("Wrong Password")
      }else{
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2,(err,result)=>{
        if(err) throw err;
        else{
          console.log(result);
          console.log("Deleted")
          res.redirect("/user");
        }
        });
      }
    })
  } catch (error) {
    res.send(err);
  }
 })
  app.listen(8080,()=>{
    console.log("Server is Listening");
  })

//connection.end();