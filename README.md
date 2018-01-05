# Comunicaciones a través de RabbitMQ

El módulo pretende simplificar las comunicaciones a través de RabbitMQ mediante la constitución de una serie de modelos "usuales" de transmisión de mensajes. 

## Modelos

### Simple

Este modelo básico, se basa en la creación de una named queue que tiene que ser conocida por consumidor y productor. 

Es muy limitado y generalmente empleado para comunicaciones unidireccionales. Se espera que el consumidor cree la cola y esté aguardando por el mensaje del publisher. 

Ejemplo del consumidor: 

```js

/*Consumidor*/

const {Cliente} = require("catro-eixos-rabbitmq-js");

const c = new Cliente()

c.iniciar('amqp://servidor_rabbit')

    .then(() => {

        //abrimos una queue nominal

        return c.abrirCanalSimple("mi_cola_mensajes")

    }).then(() => {

        //esperamos a un mensaje y lo sacamos
        //de la cola inmediatamente
        
        return c.recibirMensaje({

            pop: true,

            bloquear: true

        })

    }).then((mensaje) => {

        //procesamos el mensaje

    })

```

Y el código del publisher:

```js

const {Cliente} = require("catro-eixos-rabbitmq-js");

const c = new Cliente()

c.iniciar('amqp://servidor_rabbit')

    .then(() => {

        return c.enviarMensaje("MENSAJE_DE_MÍ_PARA_TÍ")

    })

    .then(() => {

        //cerramos
        return c.terminar();

    })

```


