import { User } from './user.interface';
import { Vote } from './vote.interface';
import { ImageMetadata } from './image-metadata.interface';

export interface Mem {
    id?: string,
    title: string,
    author: User,
    creationDate: number,
    category: string,
    tags: string[],
    imageMetadata: ImageMetadata,
    votes: Vote[],
    approved: boolean,
    approvalDate: number,
    approvedBy: string
}
