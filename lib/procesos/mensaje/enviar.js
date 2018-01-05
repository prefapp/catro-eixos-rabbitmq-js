const ProcesoRabbitMQMensaje = require("./base.js");

module.exports = class extends ProcesoRabbitMQMensaje{

  parametrosNecesarios(){

    return [
      "canal",
      "mensaje"
    ]
  }

  __r(){

    return [
      "__crearProcesoEnvio",
      "__enviarMensaje"
    ]
  }

  __crearProcesoEnvio(){

    let proceso;

    switch(this.arg("canal").tipo){

      case "simple":
        proceso = "Mensaje.enviar_simple";
        break;

      default:
        throw `TIPO CANAL DESCONOCIDO: ${this.arg("canal").tipo}`
    }

    this.a("proceso_envio", proceso);
  }

  KO__crearProcesoEnvio(err){

    this.error(`ENVIAR_DETECTAR_PROCESO_ENVIO ${err}`);
  }

  __enviarMensaje(){

    return this.subProceso(

      this.a("proceso_envio"),

      this.tarea.args

    )

  }

}
