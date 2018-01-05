const ProcesoRabbitMQCanal = require("./base.js");

module.exports = class extends ProcesoRabbitMQCanal{

  parametrosNecesarios(){

    return [    
      "canal"
    ]
  }

  __r(){


    return [

      "__prepararBorrado",
      "__realizarBorrado"

    ]

  }

  __prepararBorrado(){

    let proceso;

    switch(this.arg("canal").tipo){

      case "simple":
        proceso = "Canal.cerrar_simple";
        break;

      default:
        throw `[TIPO_DESCONOCIDO][${this.arg("canal").tipo}]`
    }

    return proceso;
  }

  KO__prepararBorrado(err){

    this.error(`[CERRAR_CANAL]${err}`);
  }

 
  OK__prepararBorrado(proceso){

    this.a("proceso_borrado", proceso)
  } 

  __realizarBorrado(){

    return this.subProceso(

      this.a("proceso_borrado"),

      this.tarea.args
    )
    
  }


}
