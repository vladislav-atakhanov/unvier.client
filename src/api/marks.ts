import type { Mark } from "../@types"

export const isExam = (index: number, count: number) => index == count - 1

export const getWeight = <T>(index: number, count: number) =>
    isExam(length, index) ? 4 : 6 / (length - 1)

export const _get = (values: number[], wish: number) => {
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

export const getTotal = (marks: number[]) =>
    Math.floor(
        marks.reduce(
            (t, mark, index) => t + mark * getWeight(index, marks.length),
            0
        ) / 10
    )
