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
          proceso: "Canal.abrir_a_sin_perdida",

          exchange: "test_sin_perdida",

          colas: [
            {nombre: "a", routing_key: "*"}
          ]
        }
      )

    ).then(({resultados}) => {

      CanalA = resultados.canal;
    })

  })

  it("Se pueden cerrar las comunicaciones", function(){

    return Procesador.ejecutar(

      new Tarea(

        "",

        {
          proceso: "Canal.cerrar_a_sin_perdida",

          exchange: "test_sin_perdida",

          exchange_interno: CanalA.exchange_interno,

          colas: [
            {nombre: "a", routing_key: "*"}
          ]

        }

      )

    )

  })

  after(function(){

    Terminar();

  })
})
