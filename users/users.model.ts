import * as mongoose from 'mongoose'

import { validateCPF } from '../common/validators'

export interface User extends mongoose.Document {

    name: string,
    email: string,
    password: string

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

    }

})

export const User = mongoose.model<User>('User', userSchema)