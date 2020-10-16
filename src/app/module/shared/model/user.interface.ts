export interface UserDetail {
    uid: string,
    nick: string,
    birthdate: number,
    email: string,
    summaryUpvotes: number,
    summaryDownvotes: number,
    addedComments: number,
    addedMems: number,
    watchedUsers: number,
    watchedTags: string[],
    isModerator: boolean,
    isAdmin: boolean,
    hasProfileImage: boolean,
    hasProfileBackgrundImage: boolean
}

export interface User{
    uid: string,
    nick: string,
    isModerator: boolean,
    isAdmin: boolean
}

export const testUser: UserDetail = {
        uid: "123",
        nick: "Anonymus",
        addedComments: 0,
        addedMems: 0,
        birthdate: new Date().getTime(),
        email: 'anonymus@domain.com',
        summaryDownvotes: 0,
        summaryUpvotes: 0,
        watchedTags: [''],
        watchedUsers: 0,
        isModerator: false,
        isAdmin: false,
        hasProfileImage: false,
        hasProfileBackgrundImage: false
}
