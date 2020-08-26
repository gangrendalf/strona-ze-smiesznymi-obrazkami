import { User } from './user';

export interface Comment {
    author: User,
    date: number,
    upvote: number,
    downvote: number,
    response: Comment[]
}
