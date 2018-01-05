const {expect} = require("chai");

const init = require("../lib/init.js");

const {Tarea} = require("catro-eixos-js");

describe("Test de sin perdida", function(){

  let Procesador;
  let Terminar;
  let CanalA;

  before(function(){

    return init({

      conexiones: {

        defecto: "amqp://amqp.test"

      }

    }).then(({refProcesador, terminar}) => {

      Procesador = refProcesador;
      Terminar = terminar;

    })

  })

  it("Se pueden abrir comunicaciones", function(){

    return Procesador.ejecutar(

      new Tarea(
        "",
        {
          proceso: "Canal.abrir_simple",

          cola: "foo"
        }
      )

    ).then(({resultados}) => {

      CanalA = resultados.canal;

      expect(resultados.canal.tipo).to.equal("simple");

    })

  })

  it("Se puede enviar mensaje", function(){

    return Procesador.ejecutar(

      new Tarea(

        "oooo",

        {
          proceso: "Mensaje.enviar",

          canal: CanalA,

          mensaje: "Hola"
        }

      )

    ).then(() => {

      return new Promise((c, f) => {
        setTimeout(c, 500);
      })

    })

  })

  it("Se puede consumir un mensaje", function(){

    return Procesador.ejecutar(

      new Tarea(

        "",

        {
          proceso: "Mensaje.recibir",

          canal: CanalA
        }

      )
    
    ).then(({resultados}) => {

      expect(resultados.mensaje).to.equal("Hola");
      
    })

  })

  it("Se puede borrar el canal", function(){

    return Procesador.ejecutar(

      new Tarea(
        "",
        {
          proceso: "Canal.cerrar_simple",

          canal: CanalA
        }
      )

    )

  })

  it("Se controla la conexion a una cola cerrada", function(hecho){

    Procesador.ejecutar(

      new Tarea(

        "",

        {
          proceso: "Mensaje.recibir",

          canal: CanalA
        }

      )
  
    ).catch((err) => {
    
      hecho();

    })

  })

  after(function(){

    Terminar();

  })
})
