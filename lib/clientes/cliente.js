const init = require("../init.js");

const {Tarea} = require("catro-eixos-js");

module.exports = class {

  constructor(){

    this.refProcesador = false;
    this._terminar = false;

  }

  terminar(){
    this._terminar && this._terminar();
  }

  iniciar(conexion){

    return init({

      conexiones: {
        "defecto": conexion
      }

    }).then(({refProcesador, terminar}) => {

      this.refProcesador = refProcesador;
      this._terminar = terminar;
  
      return this;
    })

  }

  abrirCanalSimple(cola){

    return this.ejecutar(

      "Canal.abrir_simple",

      {cola}
    
    ).then(({resultados}) => {

      this.canal = resultados.canal;

      return this;
    })

  }

  borrarCanal(){

    return this.ejecutar(

      "Canal.cerrar",

      {canal: this.canal}

    )
  }

  hayMensajes(){

    return this.ejecutar(

      "Mensaje.hay_mensajes",

      {cola: this.canal.cola}

    )

      .then(({resultados}) => {

        const m = resultados.n_mensajes;

        return m > 0;

      })

  }

  enviarMensaje(mensaje){

      return this.ejecutar(

        "Mensaje.enviar",

        {canal: this.canal, mensaje: mensaje}

      )
  } 

  recibirMensaje(datos = {}){

    return this.ejecutar(

      "Mensaje.recibir",

      {canal: this.canal, ...datos}

    ).then(({resultados}) => {

      return resultados.mensaje;
    })

  }

  ejecutar(proceso, datos = {}){

    datos.proceso = proceso;

    return this.refProcesador.ejecutar(

      new Tarea(

        "",

        datos

      )

    )


  } 

}
