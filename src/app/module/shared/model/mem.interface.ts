import { User } from './user.interface';
import { IVote } from '../../../model/vote';
import { Image } from './image.interface';

export interface Mem {
    id?: string,
    title: string,
    author: User,
    creationDate: number,
    category: string,
    tags: string[],
    image: Image,
    votes: IVote[] 
}
