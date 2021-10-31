import { CSP, backtracking, AC3 } from "./csp"

function variables(n: number): number[] {
    return make_interval(n, 0);
}

function make_interval(n: number, offset: number = 0): number[] {
    return [...Array(n).keys()].map(v => v + offset);
}

function make_inequality(x: number, y: number) {
    return {
        x: x,
        y: y,
        constraint: (X: number, x: number, Y: number, y: number) => x !== y
    }
}

function make_equality(x: number, y: number) {
    return {
        x: x,
        y: y,
        constraint: (X: number, x: number, Y: number, y: number) => x === y
    }
}

const MapColoring = () => {

    var csp = new CSP(
        variables(7),
        [
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2],
            [0, 1, 2]
        ],
        [
            make_inequality(0, 1),
            make_inequality(0, 2),
            make_inequality(1, 2),
            make_inequality(1, 3),
            make_inequality(2, 3),
            make_inequality(2, 5),
            make_inequality(3, 4),
            make_inequality(4, 5)
        ]
    );

    const names = new Map([
        [0, "WA"],
        [1, "NT"],
        [2, "SA"],
        [3, "Q"],
        [4, "NS"],
        [5, "V"],
        [6, "T"]
    ])

    const domains = new Map([
        [0, "Blue"],
        [1, "Red"],
        [2, "Green"]
    ])

    const [result, n_assigments] = backtracking(csp)
    console.log(result)
    console.log("Number of assigments: ", n_assigments);
    for (let [key, val] of result) {
        console.log(names.get(key as number), domains.get(val as number))
    }
}

const ZebraPuzzle = () => {

    enum Variables {
        Red,
        Green,
        Ivory,
        Yellow,
        Blue,

        English,
        Spanish,
        Irish,
        Nigerian,
        Japanese,

        Coffee,
        Tea,
        Milk,
        OrangeJuice,
        Water,

        OldGold,
        Kools,
        Chesterfields,
        LuckyStrike,
        Parliament,

        Dog,
        Snail,
        Fox,
        Horse,
        Zebra
    }

    var csp = new CSP(
        variables(25),
        [
            //** Colors */
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            //** Nationality */
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            //** Drink */
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            //** Smoke */
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            //** Pet */
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
            make_interval(5),
        ],
        [
            //** Colors */
            make_inequality(0, 1),
            make_inequality(0, 2),
            make_inequality(0, 3),
            make_inequality(0, 4),
            make_inequality(1, 2),
            make_inequality(1, 3),
            make_inequality(1, 4),
            make_inequality(2, 3),
            make_inequality(2, 4),
            make_inequality(3, 4),
            //** Nationality */
            make_inequality(5, 6),
            make_inequality(5, 7),
            make_inequality(5, 8),
            make_inequality(5, 9),
            make_inequality(6, 7),
            make_inequality(6, 8),
            make_inequality(6, 9),
            make_inequality(7, 8),
            make_inequality(7, 9),
            make_inequality(8, 9),
            //** Drink */
            make_inequality(10, 11),
            make_inequality(10, 12),
            make_inequality(10, 13),
            make_inequality(10, 14),
            make_inequality(11, 12),
            make_inequality(11, 13),
            make_inequality(11, 14),
            make_inequality(12, 13),
            make_inequality(12, 14),
            make_inequality(13, 14),
            //** Smoke */
            make_inequality(15, 16),
            make_inequality(15, 17),
            make_inequality(15, 18),
            make_inequality(15, 19),
            make_inequality(16, 17),
            make_inequality(16, 18),
            make_inequality(16, 19),
            make_inequality(17, 18),
            make_inequality(17, 19),
            make_inequality(18, 19),
            //** Pet */
            make_inequality(20, 21),
            make_inequality(20, 22),
            make_inequality(20, 23),
            make_inequality(20, 24),
            make_inequality(21, 22),
            make_inequality(21, 23),
            make_inequality(21, 24),
            make_inequality(22, 23),
            make_inequality(22, 24),
            make_inequality(23, 24),

            make_equality(Variables.English, Variables.Red),
            make_equality(Variables.Spanish, Variables.Dog),
            make_equality(Variables.Green, Variables.Coffee),
            make_equality(Variables.Irish, Variables.Tea),
            make_equality(Variables.OldGold, Variables.Snail),
            make_equality(Variables.Yellow, Variables.Kools),
            make_equality(Variables.LuckyStrike, Variables.OrangeJuice),
            make_equality(Variables.Japanese, Variables.Parliament),

            {
                x: Variables.Green,
                y: Variables.Ivory,
                constraint: (X: number, x: number, Y: number, y: number) => { //non simmetrical constraint
                    if (X === Variables.Green && Y === Variables.Ivory) {
                        return x - y === 1;
                    }

                    return y - x === 1;
                }
            },

            {
                x: Variables.Chesterfields,
                y: Variables.Fox,
                constraint: (X: number, x: number, Y: number, y: number) => Math.abs(x - y) === 1
            },

            {
                x: Variables.Kools,
                y: Variables.Horse,
                constraint: (X: number, x: number, Y: number, y: number) => Math.abs(x - y) === 1
            },

            {
                x: Variables.Nigerian,
                y: Variables.Blue,
                constraint: (X: number, x: number, Y: number, y: number) => Math.abs(x - y) === 1
            },
        ],
        [
            {
                x: Variables.Milk,
                constraint: x => x === 2 //middle house
            },
            {
                x: Variables.Nigerian,
                constraint: x => x === 0 //first house
            }
        ]
    );

    if (AC3(csp)) {
        const [result, n_assigments] = backtracking(csp);

        let houses = [[], [], [], [], []];

        for (let [key, val] of result) {
            houses[val].push(key)
        }

        console.log(houses.map(house => house.map(v => Variables[v])))
        console.log("Number of assigments: ", n_assigments);
    } else {
        console.log("No solution")
    }
}

ZebraPuzzle();
//MapColoring();
