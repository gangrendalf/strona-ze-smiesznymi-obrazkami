export interface Vote{
    note: Note,
    uid: string
}

export enum Note{
    up = 1,
    none = 0,
    down = -1
}