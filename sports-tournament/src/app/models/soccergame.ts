export class SoccerGame {
    constructor(
        public _id: string,
        public dateMatch: string,
        public timeMatch: string,
        public teamOne: [],
        public goalsTeamOne: Number,
        public teamTwo: [],
        public goalsTeamTwo: Number
    ){}
}
