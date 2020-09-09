import { IUserDetail, IUser } from './user';
import { IVote } from './vote';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { IComment } from './comment';

export interface IItem {
    title: string,
    author: IUser,
    creationDate: number,
    category: string,
    tags: string[],
    imageURL: string,
    votes: IVote[] 
}
