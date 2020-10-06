import { UserDetail } from '../module/shared/model/user.interface';

export interface IAuthState {
    isLogged: boolean,
    user?: UserDetail
}
