import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app = express();

// Conexión base de datos Local
const mongoose = require('mongoose');
//const uri = 'mongodb://localhost:27017/mendofydb';

// Conexión base de datos nube
const uri = 'mongodb+srv://mendo:75LzxKK7aL61cZ4z@mendofydb-xmlh4.mongodb.net/mendofydb?retryWrites=true&w=majority';

const options = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true};

// Or using promises
mongoose.connect(uri, options).then(
  /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
  () => { console.log('Conectado a DB') },
  /** handle initial connection error */
  err => { console.log(err) }
);

// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas
//app.get('/', (req, res) => {
  //res.send('Hello World!');
//});


app.use('/api',require('./routes/cancion'));

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), () => {
  console.log('Example app listening on port'+ app.get('puerto'));
});

