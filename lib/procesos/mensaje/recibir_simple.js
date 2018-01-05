const ProcesoRabbitMQMensaje = require("./base.js");

module.exports = class extends ProcesoRabbitMQMensaje{

  DEPURAR(){
 //   return true;
  }

  parametrosNecesarios(){

    return [
      "canal",
    ]
  }

  __v(){
    return [
      "__validarCola"
    ]
  } 

  __validarCola(){
    return this.__existeCola(this.arg("canal").cola);
  }

  KO__validarCola(err){

    this.error(`RECIBIR_SIMPLE:COLA_NO_EXISTE: ${err}`);
  }

  __r(){

    return [
      "__bloquear",
      "__recibirMensaje",
      "__apuntarResultados"
    ]
  }

  
  __bloquear(){

    if(!this.arg("bloquear")) return;

    return this.__esperarPorMensajes(

      this.arg("canal").cola, 

      this.arg("timeout") || -1

    )

  }

  __recibirMensaje(){

    let mensaje = false;
    let Canal;

    return this.__canal().

      then((ch) => {

        Canal = ch;

        return ch.get(this.arg("canal").cola, {

          noAck: false
        })

      })

      .then((r) => {

        if(r){

          mensaje = r.content.toString();

          if(this.arg("pop") === true){
            return Canal.ack(r);
          }
          else{
            return Canal.nack(r);
          }

        }

      }).then(() => {

        return mensaje;

      })

  }

  OK__recibirMensaje(mensaje){

    this.a("mensaje", mensaje);

    return this.__esperar(0.01); 
   
  }

  __apuntarResultados(){

    this.resultado("mensaje", this.a("mensaje"));

  }

}
