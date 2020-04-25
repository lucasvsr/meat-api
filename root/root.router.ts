import { Router } from '../common/router';
import * as restify from 'restify'


class RootRouter extends Router {

    applyRoutes(application: restify.Server) {
        
        application.get('/', (req, res, next) => {

            res.json({

                users: '/user',
                restaurants: '/restaurants',
                reviews: '/reviews'
                
            })

        })

    }

}

export const rootRouter = new RootRouter()
