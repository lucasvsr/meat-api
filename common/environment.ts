import * as fs from 'fs'

export const environment = {

    server: {

        port: process.env.SERVER_PORT || 3000, /*PORTA DE ACESSO PARA O SERVIÇO REST*/

    },

    db: {

        url: process.env.DB_URL || 'mongodb://localhost/meat-api'
        
    },

    security: {

        saltRounds: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || 'meat-api-secret',
        enableHTTPS: process.env.ENABLE_HTTPS || false,
        certificate: process.env.CERTIFICATE || fs.readFileSync('./security/keys/cert.pem'),
        key: process.env.CERTIFICATE || fs.readFileSync('./security/keys/key.pem')


    }

}