import * as restify from 'restify'
import { EventEmitter } from 'events'
import { NotFoundError } from 'restify-errors'

export abstract class Router extends EventEmitter{ //A classe EventEmitter permite emitir eventos para os ouvintes, classes que herdam desta, por exemplo. Olhar o construtor

    abstract applyRoutes(application: restify.Server)

    render(response: restify.Response, next: restify.Next) {

        return (document) => {
            if(document){

                this.emit('beforeRender', document)

                response.json(document)

            } else {

                throw new NotFoundError('Documento não encontrado')
            }

            return next()
        }

    }

    renderAll(response: restify.Response, next: restify.Next) {

        return (documents: any[]) => {


            if(documents) {

                documents.forEach(document => {
                    this.emit('beforeRender', document)
                })

                response.json(documents)

            } else {

                response.json([])

            }
        }

    }

}