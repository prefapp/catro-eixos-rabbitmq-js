const ProcesoRabbitMQMensaje = require("./base.js");

module.exports = class extends ProcesoRabbitMQMensaje{

  parametrosNecesarios(){

    return [
      "canal",
    ]
  }

  __r(){

    return [
      "__crearProcesoRecibir",
      "__recibirMensaje",
      "__apuntarResultados"
    ]
  }

  __crearProcesoRecibir(){

    let proceso;

    switch(this.arg("canal").tipo){

      case "simple":
        proceso = "Mensaje.recibir_simple";
        break;

      default:
        throw `TIPO CANAL DESCONOCIDO: ${this.arg("canal").tipo}`
    }

    this.a("proceso_recepcion", proceso);
  }

  KO__crearProcesoRecibir(err){

    this.error(`RECIBIR_DETECTAR_PROCESO_RECIBIR ${err}`);
  }

  __recibirMensaje(){

    return this.subProceso(

      this.a("proceso_recepcion"),

      this.tarea.args

    )

  }

  OK__recibirMensaje({mensaje}){

    this.a("mensaje", mensaje);
    
  }

  __apuntarResultados(){

    return this.resultado("mensaje", this.a("mensaje"));

  }

}
