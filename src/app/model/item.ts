import { IUser } from './user';
import { IVote } from './vote';

export interface IItem {
    title: string,
    authorID: string,
    creationDate: number,
    category: string,
    tags: string[],
    imageURL: string,
    comments: string[],
    votes: IVote[] 
}
