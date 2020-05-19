import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const cancionSchema = new Schema({
  src: {type: String, required: [true, 'Nombre obligatorio']},
  titulo: String,
  artista: String,
  imagen: String,

});

// Convertir a modelo
const Cancion = mongoose.model('Cancion', cancionSchema);

export default Cancion; 