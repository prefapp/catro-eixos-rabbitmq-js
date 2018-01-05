const Conexion = require("./conexion.js");

module.exports = class{

  constructor(){

      this.conexiones = {};
  }

  registrarConexionYAbrir(nombre, ...datos){

    return this.registrarConexion(nombre, ...datos).iniciar()

  }

  registrarConexion(nombre, ...datos){

    this.conexiones[nombre] = new Conexion(...datos);

    return this.conexiones[nombre];
  }


  getConexion(nombre){

    return this.conexiones[nombre];

  }

  terminar(){

    return Promise.all(

      Object.values(this.conexiones).map((cn) => {

        return cn.cerrar().catch((err) => {

          console.warn(err);

        })

      })

    ).catch((err) => {
      
      console.warn(err);

    } )

  }

}
