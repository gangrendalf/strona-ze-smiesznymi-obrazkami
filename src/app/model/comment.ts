import { IUser } from './user';

export interface IComment {
    author: IUser,
    date: number,
    upvote: number,
    downvote: number,
    response: IComment[]
}
