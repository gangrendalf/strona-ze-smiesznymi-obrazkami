import { User } from './user';

export interface Mem {
    title: string,
    author: User,
    category: string,
    tags: string[],
    upvotes: number,
    downvotes: number,
    image: Blob,
    comments: string[],
    creationDate: number
}
