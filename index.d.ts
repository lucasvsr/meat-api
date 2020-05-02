//ESTE ARQUIVO SERVE PARA EVITAR O FALSO ERRO AO USAR A PROPRIEDADE 'authenticated'
import { User } from './users/users.model';

declare module 'restify' {

    export interface Request {

        authenticated: User

    }

}