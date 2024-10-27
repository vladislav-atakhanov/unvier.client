const parse = parseFloat

export class Calculator {
    marks = $state<string[]>([])
    frozen = $state<boolean[]>([])
    total = $state("70")
    disabled = $derived(this.frozen.every(Boolean))
    constructor(
        private count: number,
        private onInfo?: (
            type: "inadmissibility" | "clear",
            value?: number
        ) => unknown
    ) {
        for (let index = 0; index < this.count; index++) {
            this.marks[index] = "70"
            this.frozen[index] = false
        }
        $effect(() => {
            this.#clear()
            if (this.disabled) this.total = this.#getFrozenSum().toString()
        })
        $effect(() => {
            this.#clear()

            const partsSum = this.marks.reduce(
                (sum, mark, index) =>
                    this.#isExam(index) ? sum : sum + parse(mark),
                0
            )
            const partsCount = this.count - 1
            if (partsSum / partsCount < 50)
                this.onInfo?.("inadmissibility", partsCount * 50)
        })
    }
    recalculate(value?: number) {
        this.#clear()
        if (this.disabled) return
        const frozenSum = this.#getFrozenSum()

        if (frozenSum == 0) {
            const val = value?.toString() ?? this.total
            this.marks = new Array(this.count).fill(val)
            this.total = val
            return
        }
        value = value ?? parse(this.total)

        const coefficient = this.frozen.reduce((coefficient, frozen, index) => {
            if (frozen) return coefficient
            return coefficient + this.#getWeight(index)
        }, 0)

        const x = Math.ceil(((value - frozenSum) / coefficient) * 10)
        this.marks = this.marks.map((mark, index) => {
            if (this.frozen[index]) return mark
            if (this.#isExam(index)) return Math.max(50, x).toString()
            return x.toString()
        })
        this.total = this.#getTotal().toString()
    }
    credits() {
        this.#clear()

        const partFrozenCount = this.frozen.reduce((count, frozen, index) => {
            return this.#isExam(index) ? count : count + (frozen ? 1 : 0)
        }, 0)

        if (partFrozenCount == 0) {
            // Ни один РК не заморожен
            this.marks = this.marks.map((_) => "50")
            this.total = "50"
            return
        }

        const marks = this.marks.map(parse)

        const partsCount = this.count - 1
        if (partFrozenCount === partsCount) {
            this.marks[partsCount] = this.#mark(partsCount, "50")
            this.total = this.#getTotal().toString()
            return
        }

        // Сумма замороженных рк
        const frozenPartsSum = marks.reduce((sum, mark, index) => {
            if (this.#isExam(index)) return sum
            if (!this.frozen[index]) return sum
            return sum + mark
        }, 0)

        const x = (
            (50 * partsCount - frozenPartsSum) /
            (partsCount - partFrozenCount)
        ).toString()

        this.marks = this.marks.map((_, index) =>
            this.#mark(index, this.#isExam(index) ? "50" : x)
        )
        this.total = this.#getTotal().toString()
    }
    #mark(index: number, value: string) {
        if (this.frozen[index]) return this.marks[index]
        return value
    }
    #isExam(index: number) {
        return index === this.count - 1
    }
    #clear() {
        this.onInfo?.("clear")
    }
    #getWeight(index: number) {
        return this.#isExam(index) ? 4 : 6 / (this.count - 1)
    }
    #getFrozenSum() {
        return Math.floor(
            this.marks.reduce((sum, mark, index) => {
                if (!this.frozen[index]) return sum
                const weight = this.#getWeight(index)
                return sum + parse(mark) * weight
            }, 0) / 10
        )
    }
    #getTotal() {
        return Math.floor(
            this.marks.reduce(
                (total, mark, index) =>
                    total + parse(mark) * this.#getWeight(index),
                0
            ) / 10
        )
    }
    *[Symbol.iterator]() {
        const self = this
        for (let index = 0; index < this.count; index++) {
            yield {
                get value() {
                    return self.marks[index]
                },
                set value(value: string) {
                    self.marks[index] = value
                },
                get freeze() {
                    return self.frozen[index]
                },
                set freeze(value: boolean) {
                    self.frozen[index] = value
                },
                isExam: self.#isExam(index),
            }
        }
    }
}
