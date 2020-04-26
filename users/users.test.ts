import { User } from './users.model';
import { usersRouter } from './users.router';
import { environment } from './../common/environment';
import { Server } from './../server/server';
import 'jest'
import * as request from 'supertest'

let url: string
let server: Server

beforeAll(() => {

    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    url = `http://localhost:${environment.server.port}`
    server = new Server()

    return server.bootstrap([usersRouter]) //INICIAR O SERVIDOR COM AS ROTAS DE USER
                 .then(() => User.remove({}).exec()) //APAGA TODA A BASE
                 .catch(console.error) //IMPRIME QUALQUER ERRO QUE OCORRA

})

test('get /users', () => {

   return request(url).get('/users')
                      .then(response => {

                         expect(response.status).toBe(200)
                         expect(response.body.items).toBeInstanceOf(Array)
                         
                      }).catch(fail)

})

test('post /users', () => {

    return request(url).post('/users')
                       .send({

                            name:"Melisenda Magnay",
                            email:"mmagnay0@boston.com",
                            password:"tY9MSY",
                            gender:"Female",
                            cpf:"227.686.630-69"

                       })
                       .then(response => {
 
                          expect(response.status).toBe(200)
                          expect(response.body._id).toBeDefined()
                          expect(response.body.name).toBe('Melisenda Magnay')
                          expect(response.body.email).toBe('mmagnay0@boston.com')
                          expect(response.body.cpf).toBe('227.686.630-69')
                          expect(response.body.password).toBeUndefined()

                       })
                       .catch(fail)
 
 })

test('get /users/[ID QUE NAO EXISTE]', () => {

    return request(url).get('/users/aaaaa')
                      .then(response => {

                         expect(response.status).toBe(404)
                         
                      }).catch(fail)


})

test('patch /users/:id', () => {

    return request(url).post('/users')
                       .send({

                            name:"Melisenda Ribeiro",
                            email:"mribeiro@boston.com",
                            password:"tY9MSY",
                            gender:"Female",
                            cpf:"227.686.630-69"

                       })
                       .then(response => request(url).patch(`/users/${response.body._id}`)
                                                     .send({

                                                        name:"Melisenda Magnay R"

                                                     }))
                       .then(response => {

                            expect(response.status).toBe(200)
                            expect(response.body._id).toBeDefined()
                            expect(response.body.name).toBe('Melisenda Magnay R')
                            expect(response.body.email).toBe('mribeiro@boston.com')

                       })
                       .catch(fail)

})

 afterAll(() => {

    return server.shutdown() //DESLIGA O SERVIDOR

 })