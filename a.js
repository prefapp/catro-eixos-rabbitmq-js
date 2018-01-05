//const a = require("./lib/nucleo/conexion.js");
const a = require("./lib/nucleo/conexiones.js");

//new a('amqp://amqp.test').iniciar()
//.then((c) => {
//
//  console.log(c)
//
//  return c.cerrar();
//})


new a().registrarConexionYAbrir(

    "defecto", 

    "amqp://amqp.test"

).then((c) => {

    console.log(c)
  
    return c.cerrar();
})
