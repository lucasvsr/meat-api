import { restaurantsRouter } from './restaurants/restaurants.router';
import { usersRouter } from './users/users.router';
import { Server } from './server/server';


const server = new Server()

server.bootstrap([usersRouter, restaurantsRouter]).then(server => {

    console.log('Server is listening on: ', server.application.address());
    
}).catch( err => {
    console.log('Server failed to start')
    console.error(err)
    process.exit(1)
    
    
})


