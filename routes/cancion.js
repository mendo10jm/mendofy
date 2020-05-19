import express from 'express';
const router = express.Router();

// importar el modelo nota
import Cancion from '../models/cancion';

// Agregar una canción
router.post('/nueva-cancion', async (req, res) => {
  const body = req.body;
  try {
    const cancionDB = await Cancion.create(body);
    res.status(200).json(cancionDB);

  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con todos los documentos
router.get('/cancion', async (req, res) => {

  var jsmediatags = require("jsmediatags"); //extractor de datos mp3
  var btoa = require('btoa'); //Codificador a base64 
  
  try {
    const cancionesDB = await Cancion.find(); // la base de datos nos devuelve todas las canciones,
                                            // en las culaes solo se indicca su url, el resto de datos esta vacío
                                     
    function getCAncion(c){
      return new Promise(function(resolve, reject){

          jsmediatags.read(c.src, {     //leo el archivo mp3 y si no hay errores en tag se encuentra toda la información y extraigo la que necesito
            onSuccess: async function (tag) {

              var title = tag.tags.title;
              var artist = tag.tags.artist;
      
              var image = tag.tags.picture;
              
              //image es un objeto con varios datos pero el que nos interesa es la matriz que la representa que se encuentra en image.data y el formato image.format
              if (image) {
                var base64String = "";
                for (var i = 0; i < image.data.length; i++) {
                  base64String += String.fromCharCode(image.data[i]); //paso los datos de la matriz a string
                }
                var base64 = 'data:' + image.format + ';base64,' + btoa(base64String); // btoa codifica string en base 64 
                                                                                      // y añado la informacion extra para que html pueda mostrar la img 
      
              } else {
                console.log("No hay imagen");
              }
              // actualizo los datos de la cancion que estaban en blanco en la base de datos
              c.titulo = title;
              c.artista = artist;
              c.imagen = base64;
              resolve(c); //almacena la cancion en la promesa
            },
            onError: function (error) {
              console.log(':(', error.type, error.info);
            }
          });
      });
    }
    
    //variable que almacena las promesas que vamos devolviendo desde la funcion getCAncion,
    // cancionesDB.map funciona como un foreach dode cogenmos una canción en cada llamada.
    var promises = cancionesDB.map(function(cancion){
      return getCAncion(cancion);
    });
    
    // el callback en la sección se ejecutará, todas las promesas se resolverán
    // y los datos de todas las promesas se pasarán al callback en forma de array.
    Promise.all(promises).then(function(data){
      res.json(data)
    });

  } catch (error) {
  return res.status(400).json({
    mensaje: 'Ocurrio un error',
    error
  })
}

});

// Delete eliminar una canción
router.delete('/cancion/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const cancionDB = await Cancion.findByIdAndDelete({ _id });
    if (!cancionDB) {
      return res.status(400).json({
        mensaje: 'No se encontró el id indicado',
        error
      })
    }
    res.json(cancionDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

/*
// recibe del front una peticion con el id de la canción y devuelve la imagen de dicha canción en base64
router.get('/cancion/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const cancionDB = await Cancion.findOne({ _id }); //Busco la canción en la base de datos

    if (typeof window === 'undefined') {
      global.window = {}
    }
    //Inspeccionar Cación
    var jsmediatags = require("jsmediatags");
    var btoa = require('btoa'); //Codificador a base64

    //paso la url de la cancion al modulo jsmediatags que detecta los metadatos mp3
    jsmediatags.read(cancionDB.src, {
      onSuccess: function (tag) {
        var title = tag.tags.title;
        var artist = tag.tags.artist;

        var image = tag.tags.picture;

        if (image) {
          var base64String = "";
          for (var i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
          }
          var base64 = 'data:' + image.format + ';base64,' + btoa(base64String); //añado la informacion para que html pueda mostrar la img 

        } else {
          console.log("No hay imagen");
        }
        var infoCancion = {
          title: title,
          artist: artist,
          imagen: base64
        };

        res.send(infoCancion); // envio la información al front
      },
      onError: function (error) {
        console.log(':(', error.type, error.info);
      }
    });


  } catch (error) {
    return res.status(400).json({
      mensaje: 'Mierda',
      error
    })
  }


});
*/

// Exportamos la configuración de express app
module.exports = router;