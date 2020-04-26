import * as restify from 'restify'
import { User } from '../users/users.model'
import { NotAuthorizedError } from 'restify-errors'

export const autenticate: restify.RequestHandler = (req, res, next) => {

    const {email, password} = req.body

    User.findByEmail(email, '+password')
        .then(user => {

            if(user && user.matches(password)){
                //GERAR TOKEN
            } else {

                return next(new NotAuthorizedError('Invalid credentials'))

            }

        })
        .catch(next)

}