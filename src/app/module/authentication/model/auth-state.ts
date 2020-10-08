import { User } from '../../shared/model/user.interface';

export interface AuthState {
    isLogged: boolean,
    user?: User
}
