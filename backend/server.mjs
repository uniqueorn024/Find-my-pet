import express from 'express';
import bodyParser from 'body-parser';
import { db } from './connect.mjs';
import { hash, compare } from 'bcrypt';

const port = process.env.PORT ?? 8000;
const saltRounds = 10;

const app = express();

app.use(express.static('../frontend/'));

app.use(bodyParser.json())

function getUser(req, res, next) {
  console.log('asd');
  // db.get();
  // req.user = await db.get();
  req.user = 3;
  next();
}
app.use(getUser);


app.get('/', (req, res) => {
  res.sendFile('../frontend/index.html');
});

{ '/', [express.static, bodyParser, getUser, ]}

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

  // if(!req.user) {
  //   ....
  // } else {
  //   req.user.email
  // }


  await db.run('INSERT INTO users (fullname, email, password, phone_number) VALUES (?, ?, ?, ?)', [
    data.full_name,
    data.email,
    await hash(data.password, saltRounds),
    data.phone_number,
  ]);

  console.log('User inserted successfully.');
  res.json({ status: 'OK' });
});


app.post('/login', async (req, res) => {
  let data = req.body;
  let sql = 'SELECT fullname, password FROM users WHERE email = ?';
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
  
  res.json({
    status: "OK",
    user: row.fullname,
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
