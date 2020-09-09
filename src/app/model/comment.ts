import { IUserDetail, IUser } from './user';
import { IVote } from './vote';

export interface IComment {
    author: IUser,
    date: number,
    votes: IVote[]
    response: IComment[],
    text: string
}
