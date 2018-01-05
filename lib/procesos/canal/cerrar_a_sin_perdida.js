const ProcesoRabbitMQCanal = require("./base.js");

module.exports = class extends ProcesoRabbitMQCanal{


  parametrosNecesarios(){

    return [
      "exchange",
      "exchange_interno",
      "colas"
    ]
  }

  __r(){


    return [

      "__borrarExchangeEntrada",
      "__borrarExchangeInterno",
      "__borrarColas",

    ]

  }

  __borrarExchangeEntrada(){

    return this.__canal()

      .then((ch) => {

        return ch.deleteExchange(this.arg("exchange"))
      })

  }

  __borrarExchangeInterno(){

    return this.__canal()

      .then((ch) => {

        return ch.deleteExchange(this.arg("exchange_interno"))
      })

  }

  __borrarColas(){

    const promesas = this.arg("colas").map((cola) => {

      return this.__canal()

        .then((ch) => {

          return ch.deleteQueue(cola.nombre);
        })

    })

    return Promise.all(promesas);
  }

}
