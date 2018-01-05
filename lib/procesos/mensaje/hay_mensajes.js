const ProcesoRabbitMQMensaje = require("./base.js");

module.exports = class extends ProcesoRabbitMQMensaje{

  DEPURAR(){
 //   return true;
  }

  parametrosNecesarios(){

    return [
      "cola",
    ]
  }

  __v(){
    return [
      "__validarCola"
    ]
  } 

  __validarCola(){
    return this.__existeCola(this.arg("cola"));
  }

  KO__validarCola(err){

    this.error(`HAY_MENSAJES:COLA_NO_EXISTE: ${err}`);
  }

  __r(){

    return [
      "__mensajesComprobar",
      "__apuntarResultados"
    ]
  }

  __mensajesComprobar(){

    return this.__getCola(this.arg("cola")).then((q) => {

      return q.messageCount;

    })

  }

  __apuntarResultados(n){

    this.resultado("n_mensajes", n);

  }

}
