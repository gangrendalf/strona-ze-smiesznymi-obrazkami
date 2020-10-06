import { User } from './user.interface';
import { IVote } from '../../../model/vote';

export interface Mem {
    title: string,
    author: User,
    creationDate: number,
    category: string,
    tags: string[],
    imageURL: string,
    votes: IVote[] 
}
