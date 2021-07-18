export interface UserInterface{
    _id?: string,
    username?: string,
    password?: string,
    name?: string,
    lastname?: string,
    img?: File,
    leagues?: [],
    history?: [],
    role?: []
}

export interface UpdateUserPasswordInterface{
    _id?: string,
    current?: string,
    new?: string,
    confirmNew?: string
    // cNew?: string,
}