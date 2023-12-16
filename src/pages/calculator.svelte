<script lang="ts">
    import {
        Scaffold,
        AppBar,
        TextField,
        Switch,
        FilledButton,
    } from "material/components"
    import Navigation from "../components/navigation.svelte"
    export let count = 3
    let wish = 70
    const blockeds = new Array(count).fill(false)
    let marks = new Array(count).fill(wish)

    let total = wish
    const getBlockedSum = (marks: number[]) =>
        Math.floor(
            marks.reduce((sum, mark, index) => {
                if (!blockeds[index]) return sum
                const weight = getWeight(index)
                return sum + (mark * weight) / 10
            }, 0),
        )

    const checkAllBlocked = (blockeds: boolean[], count: number) =>
        blockeds.filter(Boolean).length === count

    const isExam = (index: number) => index == count - 1

    const getWeight = (index: number) => (isExam(index) ? 4 : 6 / (count - 1))

    const select = ({ detail }: any) => {
        detail.select()
    }
    const recalculate = (value?: number) => {
        message = ""
        hint = ""
        const _value = value || total
        const blockedSum = getBlockedSum(marks)

        if (checkAllBlocked(blockeds, count)) return

        if (blockedSum == 0) {
            marks = marks.map((_) => _value)
            total = _value
            return
        }

        const coefficient = blockeds.reduce((coef, blocked, index) => {
            if (blocked) return coef
            return coef + getWeight(index)
        }, 0)

        marks = marks.map((mark, index) => {
            if (blockeds[index]) return mark
            mark = Math.ceil(((_value - blockedSum) / coefficient) * 10)
            if (isExam(index)) return Math.max(50, mark)
            return mark
        })

        total = getTotal(marks)
    }
    $: isAllBlocked = checkAllBlocked(blockeds, count)
    $: if (isAllBlocked) {
        total = getBlockedSum(marks)
    }

    const getTotal = (marks: number[]) =>
        Math.floor(
            marks.reduce((t, mark, index) => t + mark * getWeight(index), 0) /
                10,
        )

    const clamp = (min: number, value: number, max: number) =>
        Math.min(max, Math.max(value, min))

    $: marks = marks.map((mark, index) => clamp(0, mark, 200) || 0)
    $: total = clamp(0, total, 200) || 0

    let message = ""
    let hint = ""
    const credits = () => {
        message = ""
        hint = ""
        const blockedCount = blockeds.reduce((blockedCount, blocked, index) => {
            return isExam(index) ? blockedCount : blockedCount + blocked
        }, 0)

        total = 50

        const sum = marks.reduce((sum, mark, index) =>
            isExam(index) ? sum : sum + mark,
        )

        if (blockedCount == 0) {
            marks = marks.map((_) => 50)
            return
        }

        const notExamCount = count - 1
        if (blockedCount === notExamCount) {
            if (sum / notExamCount < 50) {
                message = "Недопуск к экзамену"
                hint = `Сумма РК меньше ${notExamCount * 50}`
            }
            marks[count - 1] = 50
            total = getTotal(marks)
            marks = marks
            return
        }

        const blockedSum = marks.reduce((sum, mark, index) => {
            if (isExam(index)) return sum
            if (!blockeds[index]) return sum
            return sum + mark
        }, 0)

        const x =
            (50 * notExamCount - blockedSum) / (notExamCount - blockedCount)

        marks = marks.map((mark, index) => {
            if (isExam(index)) return 50
            if (blockeds[index]) return mark
            return x
        })
    }

    const makeRecalculate = (value?: number) => () => recalculate(value)
</script>

<Scaffold>
    <AppBar slot="app-bar">Калькулятор</AppBar>
    <div class="calculator__container">
        {#each blockeds as _, index}
            <div class="calculator__field">
                <TextField
                    label={isExam(index) ? "ПА" : `РК${index + 1}`}
                    inputmode="numeric"
                    bind:value={marks[index]}
                    on:click={select}
                />
                <div class="calculator__switch">
                    <Switch bind:value={blockeds[index]} />
                    <p>Заморозить</p>
                </div>
            </div>
        {/each}
        <TextField
            label="Итог"
            inputmode="numeric"
            bind:value={total}
            on:click={select}
        />
        {#if message.length > 0 && hint.length > 0}
            <div>
                {#if message.length}
                    <p class="error">{message}</p>
                {/if}
                {#if hint.length}
                    <p class="hint">{hint}</p>
                {/if}
            </div>
        {/if}

        <FilledButton on:click={makeRecalculate(70)} disabled={isAllBlocked}
            >Остаться на стипендии</FilledButton
        >
        <FilledButton on:click={credits} disabled={isAllBlocked}
            >Не попасть на кредиты</FilledButton
        >
        <FilledButton on:click={makeRecalculate(90)} disabled={isAllBlocked}
            >Получить А</FilledButton
        >
        <FilledButton on:click={makeRecalculate()} disabled={isAllBlocked}
            >Пересчитать</FilledButton
        >
    </div>

    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .calculator__container {
        margin: 0 auto;
        width: max-content;
        display: grid;
        gap: 1em;
        --width: 100%;
    }
    .calculator__switch {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .calculator__field {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1em;
        align-items: center;
    }
    .calculator__switch p {
        font-size: 0.8em;
    }
    p {
        margin: 0;
    }
    .error {
        color: var(--md-sys-color-error);
    }
    .hint {
        opacity: 0.5;
    }
</style>
