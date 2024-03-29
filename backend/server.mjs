import express from 'express';
import bodyParser from 'body-parser';
import { db } from './connect.mjs';
import { hash, compare } from 'bcrypt';
import cookieParser from 'cookie-parser';
import {randomBytes} from 'crypto';

const port = process.env.PORT ?? 8000;
const saltRounds = 10;

const app = express();

app.use(express.static('../frontend/'));
app.use(cookieParser());

app.use(bodyParser.json())
app.use(cookieParser())

function setCookie(req, res, next) {
  //console.log("neshosi");
  if (!req.cookies['sid']){
    res.cookie('sid', randomBytes(64).toString('hex'));
    }
  next();
  //return randomString
}
app.use(setCookie);

app.get('/auth_user', async (req, res) => {
  console.log(req.cookies["sid"]);
  let sql = 'SELECT uid, users.fullname FROM cookies JOIN users ON users.user_id = uid WHERE cookie = ?';
  let row = await db.get(sql, [req.cookies["sid"]]);
  if(!row) {
      return res.json({
        status: "error",
        message: "Not logged in!",
      });
  }
  res.json({
    status: "OK",
    user: row.fullname,
    user_id: row.uid
  });
});

app.get('/get_all_posts', async (req, res) => {
  
  let sql = 'SELECT * FROM pets_data';
  let data = await db.all(sql);
  if(!data) {
      return res.json({
        status: "error",
        message: "No posts",
      });
  }
  res.json({
    status: "OK",
    posts: data
  });
});

app.post('/get_post', async (req, res) => {
  let data = req.body;
  console.log(data.id)
  let sql = 'SELECT * FROM pets_data WHERE id = ?';
  let row_data = await db.get(sql, [data.id]);
  if(!row_data) {
      return res.json({
        status: "error",
        message: "No such post",
      });
  }
  res.json({
    status: "OK",
    post: row_data
  });
});
// { '/', [express.static, bodyParser, getUser, ]}

  //Database.openSync('test.db') //
  
  // await Promise.all([
  //   fetch('af')
  // fetch('asd')
  // ]);
  // for()
  // Database.open('test.db', fn)

  // let x = await Database.open('test.db')
  // //let y = await x


app.post('/register', async (req, res) => {
  let data = req.body;

  let sql = 'INSERT INTO users (fullname, email, password, phone_number) VALUES (?, ?, ?, ?)';
  let row = await db.run(sql, [
    data.full_name,
    data.email,
    await hash(data.password, saltRounds),
    data.phone_number,
  ]);

  console.log('User inserted successfully.');

  if(!row) {
      return res.json({
        status: "error",
        message: "Name not found!",
      });
  }

  await db.run('INSERT INTO cookies (uid, cookie) VALUES (?, ?)', [
    row.lastID,
    req.cookies['sid']
  ]);

  res.json({ 
    status: 'OK', 
    name: data.full_name
    });
});


app.post('/login', async (req, res) => {
  let data = req.body;
  let sql = 'SELECT fullname, password, user_id FROM users WHERE email = ?';
  let row = await db.get(sql, [data.email]);

  if(!row) {
      return res.json({
        status: "error",
        message: "User not found",
      });
  }

  if(!compare(data.password,row.password)){
    return res.json({
      status: "error",
      message: "Wrong password",
    });
  }
  await db.run('INSERT INTO cookies (uid, cookie) VALUES (?, ?)', [
    row.user_id,
    req.cookies['sid']
  ]);
  res.json({
    status: "OK",
    user: row.fullname,
  });
});


app.post('/addPost',async (req, res) => {
  let data = req.body;
  let insert = await db.run('INSERT INTO pets_data (status, author_id, pet_name, description, age, phone_num, notes, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
    data.status,
    data.uid,
    data.name,
    data.description,
    data.age,
    data.phone_num,
    data.notes,
    data.date
  ]);
  res.json({
    status: "OK",
    post_id: insert.lastID
  });




});


// function handleErrors(err, req, res, next) {
//   console.log('Im here', err);
//   return res.json({ status: 'error', message: 'Unknown error' });
// }
// app.use(handleErrors)

app.listen(port, () => {
  console.log('Server started on port ' + port);
});
