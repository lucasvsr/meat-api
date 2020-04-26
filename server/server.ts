import { handleError } from './error.handler';
import * as restify from 'restify'
import * as mongoose from 'mongoose'

import { environment } from '../common/environment'
import { Router } from '../common/router'
import { mergePatchBodyParser } from './merge-patch.parser'

export class Server {

    application: restify.Server

    bootstrap(routers: Router[] = []): Promise<Server> {

        return  this.initializeDb()
                    .then(() => this.initRoutes(routers)
                                    .then(() => this)) 
        
    }

    initializeDb() {

        (<any>mongoose).Promise = global.Promise
        
        return mongoose.connect(environment.db.url, {

            useMongoClient: true

        })

    }



    initRoutes(routers: Router[]): Promise<any> {
    
        return new Promise((resolve, reject) =>{

            try {

                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                
                this.application.use(restify.plugins.queryParser()) //AQUI INSTALAMOS OS PLUGINS, ALGUNS JÁ VEM NO PACOTE DO RESTIFY
                this.application.use(restify.plugins.bodyParser()) // CONVERTE O CORPO DA REQ EM JSON
                this.application.use(mergePatchBodyParser) // CONVERTE O CORPO DA REQ EM JSON

                for (let router of routers){

                    router.applyRoutes(this.application)

                }

                this.application.listen(environment.server.port, () => {

                    resolve(this.application)
                    
                })

                this.application.on('restifyError', handleError)

            } catch (error) {

                reject(error)
                
            }

        })
    
    }

    shutdown() {

        return mongoose.disconnect()
                       .then(() => this.application.close())

    }

}