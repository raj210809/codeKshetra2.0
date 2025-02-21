export const timeToCancelationPeriod: { [key: number]: number } = {
    1: 0.25,
    3: 0.5,
    5: 1,
    7: 2,
    14: 3,
    30: 5,
}

export const timeToCancelationPeriodInSeconds: { [key: number]: number } = {
    1: 0.25 * 60 * 60,
    3: 0.5 * 60 * 60,
    5: 1 * 60 * 60,
    7: 2 * 60 * 60,
    14: 3 * 60 * 60,
    30: 5 * 60 * 60,
}

