import { User } from './user.interface';
import { Vote } from './vote.interface';

export interface Comment {
    author: User,
    date: number,
    votes: Vote[]
    text: string,
    id?: string,
    parentCommentID: string 
}
