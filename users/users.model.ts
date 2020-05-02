import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

import { validateCPF } from '../common/validators'
import { environment } from '../common/environment'

export interface User extends mongoose.Document { //Define os atributos

    name: string,
    email: string,
    password: string,
    cpf: string,
    gender: string,
    profiles: string[]
    matches(password: string): boolean
    hasAny(...profiles: string[]): boolean

}

export interface UserModel extends mongoose.Model<User> { //Define os métodos

    findByEmail(email: string, projection?: string): Promise<User>

}

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },

    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },

    password: {
        type: String,
        select: false, //INDICA AO MONGOOSE QUE NÃO DEVE TRAZER ESTE CAMPO POR PADRÃO
        require: true
    },

    gender: {

        type: String,
        required: false,
        enum: ['Male', 'Female']

    },

    cpf: {

        type: String,
        required: false,
        validate: {

            validator: validateCPF, //O VALIDATE DEVE SER USADO QUANDO QUISERMOS CRIAR UMA VALIDAÇÃO PERSONALIZADA
            message: '{PATH}: Invalid CPF ({VALUE})' //PATH indica o campo que gerou o erro. VALUE indica o valor que passamos na requisição

        }

    },

    profiles: {

        type: [String],
        required: false

    }

})

userSchema.statics.findByEmail = function(email: string, projection: string) {

    return this.findOne({email}, projection) //{email: email}

}

userSchema.methods.matches = function(password: string): boolean {

    return bcrypt.compareSync(password, this.password)

}

userSchema.methods.hasAny = function(...profiles: string[]): boolean {

    return profiles.some(profile => this.profiles.indexOf(profile) !== -1)

}

const hashPassword = (obj, next) => {

    bcrypt.hash(obj.password, environment.security.saltRounds)
          .then(hash => {

                obj.password = hash
                next()

        }).catch(next)

}

const saveMiddleware = function(next) { // COMO VAMOS PEGAR UM OBJETO, É NECESSÁRIO USAR UMA FUNÇÃO TRADICIONAL, NADA DE ARROWFUNCTION

    const user: User = <User> this

    if(!user.isModified('password')){

        next()

    } else {

        hashPassword(user, next)

    }

}

const updateMiddleware = function(next) { // COMO VAMOS PEGAR UM OBJETO, É NECESSÁRIO USAR UMA FUNÇÃO TRADICIONAL, NADA DE ARROWFUNCTION

    if(!this.getUpdate().password){

        next()

    } else {

        hashPassword(this.getUpdate(), next)

    }

}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User, UserModel>('User', userSchema)