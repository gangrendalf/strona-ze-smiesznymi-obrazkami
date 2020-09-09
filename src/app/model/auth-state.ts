import { IUserDetail } from './user';

export interface IAuthState {
    isLogged: boolean,
    user?: IUserDetail
}
