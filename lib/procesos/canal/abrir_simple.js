const ProcesoRabbitMQCanal = require("./base.js");

module.exports = class extends ProcesoRabbitMQCanal{

  parametrosNecesarios(){

    return [
      "cola"
    ]
  }

  __r(){

    return [

      "__abrirCola",
      "__apuntarResultados"

    ]

  }

  __abrirCola(){

    return this.__getCola(

      this.arg("cola"),

      {
        durable: true,
      }
    )
  }

  OK__abrirCola(cola){

    this.a("colas_obj", cola);
  }

  __apuntarResultados(){

    this.resultado(

      "canal",

      {
        tipo: "simple",

        cola: this.arg("cola"),

        colaObj: this.a("colas_obj")
      }

    )

  }

}
