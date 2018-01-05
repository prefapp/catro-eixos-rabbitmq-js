const {init} = require("catro-eixos-js");

const Conexiones = require("./nucleo/conexiones.js");

const ProcesoRabbitMQ = require("./procesos/base.js");

module.exports = function(datos = {}){

  let Conexiones;

  return gestionarConexiones(datos)

    .then((conexiones) =>{

      Conexiones = conexiones;

      return init({

        "Canal": __dirname + "/procesos/canal",
        "Mensaje": __dirname + "/procesos/mensaje",

      })

    }).then((refProcesador) => {

      return {

        refProcesador,

        terminar: () => {

          if(Conexiones) return Conexiones.terminar();
          else            return Promise.resolve(false);

        }

      }

    })
}

function gestionarConexiones({conexiones}){

  if(!conexiones) return Promise.resolve(false);

  const ConexionesObj = new Conexiones();

  ProcesoRabbitMQ.SET_CONEXIONES(ConexionesObj);

  const proms = Object.keys(conexiones).map((conexion) => {

    return ConexionesObj.registrarConexionYAbrir(

      conexion,

      conexiones[conexion]
    )

  })
  
  return Promise.all(proms).then(() => {

      return ConexionesObj;
  })
  
}
