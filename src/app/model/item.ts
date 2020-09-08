import { IUser } from './user';

export interface IItem {
    title: string,
    author: IUser,
    category: string,
    tags: string[],
    upvotes: number,
    downvotes: number,
    imageURL: string,
    comments: string[],
    creationDate: number
}
