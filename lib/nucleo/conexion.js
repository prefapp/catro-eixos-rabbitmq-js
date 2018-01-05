const amqplib = require("amqplib");

module.exports = class {

  constructor(url = "amqp://localhost"){
  
    this.url = url;
    this.conexion = false;
    this.realizada = false;
    
  }

  iniciar(){

    return this.cerrar().then(() => {

      return amqplib.connect(this.url);


    }).then((conexion) =>{

        this.conexion = conexion;

        this.realizada = true;

        return this;

    }).catch((err) => {

      throw `Conexion INICIAR : ${err}`;

    })

  }

  cerrar(){

    if(this.realizada === false) return Promise.resolve();

      return new Promise((cumplida, falla) => {

        try{
           this.conexion.close(function(err){

            if(err) return falla(err);

            else    return cumplida();

          })
        }
        catch(e){
          falla(e);
        }
      
      })

  }

}
