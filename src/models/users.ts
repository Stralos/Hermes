
export class User {
    public readonly name: string;
    public readonly date: Date;

    constructor(name: string, date: Date) {
        this.name = name;
        this.date = date;
    }
}

export interface Users {
    userByDate(date: Date): User
}

// Local users
export class UsersLocal implements Users {
    public userByDate(date: Date): User {
        return new User("Marius", new Date())
    }
}
