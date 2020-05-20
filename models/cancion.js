import mongoose from 'mongoose'; //Mongoose es un marco de JavaScript usado en aplicación Node.js con una base de datos MongoDB.
const Schema = mongoose.Schema;

//creo el esquema que tendra canción an la base de datos MongoDB
const cancionSchema = new Schema({
  src: {type: String, required: [true, 'Nombre obligatorio']},
  titulo: String,
  artista: String,
  imagen: String,

});

// Convertir a modelo
const Cancion = mongoose.model('Cancion', cancionSchema);

export default Cancion; 