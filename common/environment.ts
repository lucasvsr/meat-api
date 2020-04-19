export const environment = {

    server: {

        port: process.env.SERVER_PORT || 3000, /*PORTA DE ACESSO PARA O SERVIÇO REST*/

    },

    db: {

        url: process.env.DB_URL || 'mongodb://localhost/meat-api'
        
    }

}