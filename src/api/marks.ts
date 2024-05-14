import type { Mark } from "../@types"

export const isExam = (index: number, count: number) => index === count - 1

export const getWeight = (index: number, count: number) =>
    isExam(index, count) ? 4 : 6 / (count - 1)

const _get = (values: number[], wish: number) => {
    const sum = values.reduce(
        (acc, v, index) => acc + v * getWeight(index, values.length),
        0
    )
    if (sum === 0) return values.map((_) => wish)

    const zerosCount = values.filter((v) => v === 0).length

    const c = zerosCount > 1 ? 6 / (values.length - 1) : 0
    const x = Math.round((10 * wish - sum) / (c + 4))

    return values.map((v) => (v > 0 ? v : x))
}

export const getMissing = (marks: Mark[], wish: number) => {
    const activeValues = marks.filter(([t, v, active]) => active).length

    const values = marks.map(([_, value, active]) => (active ? 0 : value))
    if (activeValues === 0) values[values.length - 1] = 0
    return _get(values, wish).map((v, index) =>
        Math.max(v - marks[index][1], 0)
    )
}

export const getTotal = (marks: number[], sum: number) => {
    const fullSum = marks.reduce((acc, i) => acc + i)
    const examValue = marks[marks.length - 1]
    if (examValue !== 0 && examValue === sum) return sum
    const sumWithoutExam = fullSum - examValue
    if (sumWithoutExam === 0) return sum
    return Math.floor(
        marks.reduce(
            (t, mark, index) => t + mark * getWeight(index, marks.length),
            0
        ) / 10
    )
}
