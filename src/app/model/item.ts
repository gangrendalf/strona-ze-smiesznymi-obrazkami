import { IUser } from './user';
import { IVote } from './vote';

export interface IItem {
    title: string,
    author: IUser,
    creationDate: number,
    category: string,
    tags: string[],
    imageURL: string,
    votes: IVote[] 
}
