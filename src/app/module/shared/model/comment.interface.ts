import { User } from './user.interface';
import { IVote } from '../../../model/vote';

export interface Comment {
    author: User,
    date: number,
    votes: IVote[]
    text: string,
    parentID: string 
}
