const {Proceso} = require("catro-eixos-js");

const uuid = require("uuid/v4");

let CONEXIONES;

class ProcesoRabbitMQ extends Proceso{

  static SET_CONEXIONES (conexiones){

    CONEXIONES = conexiones;
  }

  static GET_CONEXION(nombre){

    return CONEXIONES.getConexion(nombre).conexion;
  }

  __nombreAleatorio(n = 63){

    return uuid().slice(0, 63);
  }

  __canal(conexion, auxiliar = false){
    
    if(!auxiliar && this.a("ch")){
       return Promise.resolve(this.a("ch"))
    }
    else{
      return this.__getConexion(conexion).createChannel()

        .then((ch) => {

          if(!auxiliar)
            this.a("ch", ch);

          return ch;
        })
    }
  }

  __canalAuxiliar(conexion){

    return this.__canal(conexion, true)

  }

  __getConexion(nombre = "defecto"){

    return ProcesoRabbitMQ.GET_CONEXION(nombre)

  }

  __getExchange(nombre, tipo, opciones = {}){

    return this.__canal(this.arg("conexion"))

      .then((ch) => {

        return ch.assertExchange(nombre, tipo, opciones)

      })
  }

  __getCola(nombre, opciones){

    return this.__canal(this.arg("conexion"))

      .then((ch) => {

        return ch.assertQueue(nombre, opciones)

      })
  }

  __existeCola(nombre){

    let existe = true;
    let canal;

    return this.__canalAuxiliar()

      .then((ch) => {

        canal = ch;

        ch.on("error", function(err){

          existe = false;

        })

        return ch.checkQueue(nombre)

      })

      .then(() => {

        if(existe){
          canal.close();
        }

        return existe;
      })
  }

  __esperarPorMensajes(cola, timeout){

    let tiempo = 0;

    const hayMensajes = async (cumplida, falla) => {

      const m = await this.__comprobarNMensajes(cola);      
      if(m > 0){
         cumplida();
      }
      else{
          tiempo += 5;
          if(timeout !== -1 && tiempo >= timeout){
            falla();
          }
          else{
            hayMensajes(cumplida, falla);
          }
      }

    }

    return new Promise((cumplida, falla) => {

      hayMensajes(cumplida, falla);

    })

  }

  __comprobarNMensajes(cola){

    return this.__getCola(cola)

      .then((colaObj) => {

        return colaObj.messageCount

      })
    
  }
}

module.exports = ProcesoRabbitMQ;
