const ProcesoRabbitMQMensaje = require("./base.js");

module.exports = class extends ProcesoRabbitMQMensaje{

  parametrosNecesarios(){

    return [
      "mensaje",
      "canal"
    ]
  }

  __v(){
    return [
      "__validarCola"
    ]
  }

  __r(){
    return [
      "__enviar"
    ]
  }

  
  __validarCola(){

    return this.__existeCola(this.arg("canal").cola)

  }  


  KO__validarCola(err){

    this.error(`LA COLA NO EXISTE ${err}`)

  }

  __enviar(){

    return this.__canal()

      .then((ch) => {

        return ch.sendToQueue(

          this.arg("canal").cola,

          Buffer.from(this.arg("mensaje")),

          {deliveryMode: 2}

        )

      })

  }

  OK__enviar(c){

    //truco para evitar que no le de tiempo a enviar
    return this.__esperar(0.01);
  }

  KO__enviar(err){

    this.arg(`ERROR_ENVIO_SIMPLE: ${err}`)
  }
}
