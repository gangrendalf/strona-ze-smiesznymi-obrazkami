import { IUser } from './user';

export interface IAuthState {
    isLogged: boolean,
    user?: IUser
}
