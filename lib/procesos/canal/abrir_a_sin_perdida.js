const ProcesoRabbitMQCanal = require("./base.js");

module.exports = class extends ProcesoRabbitMQCanal{

  parametrosNecesarios(){

    return [
      "exchange",
      "colas"
    ]
  }

  __r(){

    return [

      "__crearExchangeEntrada",
      "__crearExchangeInterno",
      "__asociarExchanges",
      "__crearColas",
      "__asociarColas",
      "__apuntarResultados"

    ]

  }

  __crearExchangeEntrada(){

    return this.__getExchange(
    
      this.arg("exchange"),

      "fanout",

      {
        
        durable: true,
        auto_delete: false
        
      }

    )
  }

  OK__crearExchangeEntrada(exchange_entrada){

    this.a("ex_entrada", exchange_entrada)
    
  }

  KO__crearExchangeEntrada(err){

    this.error(`ERROR_EN_CREACION_DE_EX_ENTRADA ${err}`)
  }

  __crearExchangeInterno(){

    this.a("nombre_ex_interno", this.__nombreAleatorio(15));

    return this.__getExchange(

      this.a("nombre_ex_interno"),

      "topic",

      {
          durable: true,
          auto_delete: false
      }

    )
  }

  OK__crearExchangeInterno(exchange_interno){

    this.a("ex_interno", exchange_interno)
  }

  KO__crearExchangeInterno(err){

    this.error(`ERROR_EN_CREACION_DE_EX_INTERNO ${err}`);
  }

  __asociarExchanges(){

    return this.__canal()

      .then((ch) => {

        return ch.bindExchange(

          this.a("nombre_ex_interno"),

          this.arg("exchange")

        )

      })
  }
  
  KO__asociarExchanges(err){

    this.error(`ERRO_EN_ASOCIACION_DE_EXCHANGES: ${err}`)
  }

  __crearColas(){

    const promesas = this.arg("colas").map((cola) => {

      return this.__getCola(

        cola.nombre,

        {
          durable: true
        }

      )

    });

    return Promise.all(promesas)
  }

  OK__crearColas(colas){

    this.a("colas_obj", colas);
    
  }

  __asociarColas(){

    const promesas = this.arg("colas").map((cola) => {

      return this.__canal()

        .then((ch) => {

          return ch.bindQueue(

            cola.nombre,

            this.a("nombre_ex_interno"),

            cola.routing_key

          )

      })
 
    });

    return Promise.all(promesas)   
  }
  
  __apuntarResultados(){

    this.resultado("canal", {

      tipo: "a_sin_perdida",

      exchange: this.arg("exchange"),

      colas: this.arg("colas"),

      exchange_interno: this.a("nombre_ex_interno")


    })

  }
  
}
