import { Restaurant } from './restaurants/restaurants.model';
import { Review } from './reviews/reviews.model';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { reviewsRouter } from './reviews/reviews.router';
import { Server } from './server/server';
import { environment } from "./common/environment"
import { usersRouter } from './users/users.router';
import { User } from './users/users.model';
import * as jestCli from 'jest-cli'

let url: string
let server: Server
const beforeAllTestes = () => {

    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    url = `http://localhost:${environment.server.port}`
    server = new Server()

    return server.bootstrap([usersRouter, 
                             reviewsRouter,
                             restaurantsRouter]) //INICIAR O SERVIDOR COM AS ROTAS DE USER
                 .then(() => User.remove({}).exec()) //APAGA TODA A BASE DE USER
                 .then(() => Review.remove({}).exec()) //APAGA TODA A BASE DE REVIEWS
                 .then(() => Restaurant.remove({}).exec()) //APAGA TODA A BASE DE RESTAURANTS
                 .catch(console.error) //IMPRIME QUALQUER ERRO QUE OCORRA

}

const afterAllTests = () => {

    return server.shutdown() //DESLIGA O SERVIDOR

}

beforeAllTestes().then(() => jestCli.run())
                 .then(() => afterAllTests())
                 .catch(console.error)