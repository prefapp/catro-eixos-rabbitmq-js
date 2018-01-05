const {expect} = require("chai");

const init = require("../../lib/init.js");

const {Tarea} = require("catro-eixos-js");

const Emisor = require("../fixtures/emisor.js");

describe("Test de canal simple", function(){

  let Procesador;
  let Terminar;
  let CanalA;
  const E = new Emisor();

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

  before(function(){

    return E.iniciar("amqp://amqp.test")

  })

  it("Se pueden abrir comunicaciones", function(){

    return E.abrirCanalSimple("foo")

  })

  it("No hay mensajes", function(){

    return E.recibirMensaje().then((m) => {

      expect(m).to.equal(false);

    })

  })

  it("Se puede enviar un mensaje", function(){

    return E.enviarMensaje("HOLA_1")
  }) 

  it("Tenemos un mensaje en bandejaa", function(){

    return E.hayMensajes()

      .then((hay) => {

        expect(hay).to.equal(true);
      })

  }) 

  it("Se puede recoger un mensaje (con pop)", function(){

    return E.recibirMensaje({pop: true}).then((m) => {

      expect(m).to.equal("HOLA_1")
    })

  })

  it("No hay mensajes", function(){

    return E.hayMensajes().then((hay) => {

      expect(hay).to.equal(false);

    })

  })

  it("Se puede enviar un mensaje", function(){

    return E.enviarMensaje("HOLA_2")

  })

  it("Se puede recoger un mensaje (sin pop)", function(){

    return E.recibirMensaje().then((m) => {

      expect(m).to.equal("HOLA_2")
    })

  })

  it("Hay mensajes", function(){

    return E.hayMensajes().then((hay) => {

      expect(hay).to.equal(true);

    }).then(() =>{

      return E.recibirMensaje({pop: true});

    })
  })

  it("Bloquea hasta que haya un mensaje", function(){

    this.timeout(2000);

    setTimeout(() => {

      E.enviarMensaje("FOO");

    }, 1000)

    return E.recibirMensaje({bloquear: true, pop: true})

      .then((m) => {

        expect(m).to.equal("FOO");
      })

  })
  

  after(function(){

    return E.borrarCanal();

  })  

  after(function(){

    Terminar()

    E.terminar();


  })
})
