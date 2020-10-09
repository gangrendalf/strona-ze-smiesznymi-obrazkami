import { User } from './user.interface';
import { Vote } from './vote.interface';
import { Image } from './image.interface';

export interface Mem {
    id?: string,
    title: string,
    author: User,
    creationDate: number,
    category: string,
    tags: string[],
    image: Image,
    votes: Vote[],
    approved: boolean,
    approvalDate: number,
    approvedBy: string
}
