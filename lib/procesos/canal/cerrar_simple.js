const ProcesoRabbitMQCanal = require("./base.js");

module.exports = class extends ProcesoRabbitMQCanal{

  parametrosNecesarios(){

    return [    
      "canal"
    ]
  }

  __r(){


    return [

      "__borrarCola",

    ]

  }

  __borrarCola(){

     return this.__canal()

       .then((ch) => {

         return ch.deleteQueue(this.arg("canal").cola);

       })

  }

}
