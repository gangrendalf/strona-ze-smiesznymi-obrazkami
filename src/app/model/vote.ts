export interface IVote{
    note: EVote,
    uid: string
}

export enum EVote{
    up = 1,
    none = 0,
    down = -1
}