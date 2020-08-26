export interface User {
    nick: string,
    birthdate: number,
    email: string,
    summaryUpvotes: number,
    summaryDownvotes: number,
    addedComments: number,
    addedMems: number,
    watchedUsers: number,
    watchedTags: string[]
}

export const testUser: User = {
        nick: "test user",
        addedComments: 0,
        addedMems: 0,
        birthdate: new Date().getTime(),
        email: 'testemail@domain.com',
        summaryDownvotes: 0,
        summaryUpvotes: 0,
        watchedTags: [''],
        watchedUsers: 0
}
