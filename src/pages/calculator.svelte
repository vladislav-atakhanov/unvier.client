<script lang="ts">
    import {
        Scaffold,
        AppBar,
        TextField,
        Switch,
        FilledButton,
    } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { i18n } from "material/i18n"
    import { getTotal, isExam, getWeight } from "../api/marks"
    const _ = i18n()
    export let count = 3
    let wish = 70
    const blockFlags = new Array(count).fill(false)
    let marks = new Array(count).fill(wish)

    let total = wish
    const getBlockedSum = (marks: number[]) =>
        Math.floor(
            marks.reduce((sum, mark, index) => {
                if (!blockFlags[index]) return sum
                const weight = getWeight(index, count)
                return sum + (mark * weight) / 10
            }, 0),
        )

    const checkAllBlocked = (blockFlags: boolean[], count: number) =>
        blockFlags.filter(Boolean).length === count

    const select = ({ detail }: any) => {
        detail.select()
    }
    const recalculate = (value?: number) => {
        message = ""
        hint = ""
        if (checkAllBlocked(blockFlags, count)) return
        const _value = value || total
        const blockedSum = getBlockedSum(marks)

        if (blockedSum == 0) {
            marks = marks.map((_) => _value)
            total = _value
            return
        }

        const coefficient = blockFlags.reduce((coefficient, blocked, index) => {
            if (blocked) return coefficient
            return coefficient + getWeight(index, count)
        }, 0)

        const x = Math.ceil(((_value - blockedSum) / coefficient) * 10)
        marks = marks.map((mark, index) => {
            if (blockFlags[index]) return mark
            if (isExam(index, count)) return Math.max(50, x)
            return x
        })
        total = getTotal(marks)
    }
    $: isAllBlocked = checkAllBlocked(blockFlags, count)
    $: if (isAllBlocked) {
        total = getBlockedSum(marks)
    }

    const clamp = (min: number, value: number, max: number) =>
        Math.min(max, Math.max(value, min))

    $: marks = marks.map((mark) => clamp(0, mark, 200) || 0)
    $: total = clamp(0, total, 200) || 0

    let message = ""
    let hint = ""
    const credits = () => {
        message = ""
        hint = ""
        const blockedCount = blockFlags.reduce(
            (blockedCount, blocked, index) => {
                return isExam(index, count)
                    ? blockedCount
                    : blockedCount + blocked
            },
            0,
        )

        total = 50

        const sum = marks.reduce((sum, mark, index) =>
            isExam(index, count) ? sum : sum + mark,
        )

        if (blockedCount == 0) {
            marks = marks.map((_) => 50)
            return
        }

        const notExamCount = count - 1
        if (blockedCount === notExamCount) {
            if (sum / notExamCount < 50) {
                message = _("calculator.inadmissibility")

                hint = _("calculator.sum-less-than", notExamCount * 50)
            }
            marks[count - 1] = 50
            total = getTotal(marks)
            marks = marks
            return
        }

        const blockedSum = marks.reduce((sum, mark, index) => {
            if (isExam(index, count)) return sum
            if (!blockFlags[index]) return sum
            return sum + mark
        }, 0)

        const x =
            (50 * notExamCount - blockedSum) / (notExamCount - blockedCount)

        marks = marks.map((mark, index) => {
            if (isExam(index, count)) return 50
            if (blockFlags[index]) return mark
            return x
        })
    }

    const makeRecalculate = (value?: number) => () => recalculate(value)
</script>

<Scaffold>
    <AppBar slot="app-bar">{_("calculator")}</AppBar>
    <div class="calculator__container">
        {#each blockFlags as __, index}
            <div class="calculator__field">
                <TextField
                    label={isExam(index, count)
                        ? _("calculator.exam")
                        : _("calculator.part", index + 1)}
                    inputmode="numeric"
                    bind:value={marks[index]}
                    on:click={select}
                />
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="calculator__switch">
                    <Switch bind:value={blockFlags[index]} />
                    <p>{_("calculator.freeze")}</p>
                </label>
            </div>
        {/each}
        <TextField
            label={_("total")}
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
            >{_("calculator.stipend")}</FilledButton
        >
        <FilledButton on:click={credits} disabled={isAllBlocked}
            >{_("calculator.not-credits")}</FilledButton
        >
        <FilledButton on:click={makeRecalculate(90)} disabled={isAllBlocked}
            >{_("calculator.get-a")}</FilledButton
        >
        <FilledButton on:click={makeRecalculate()} disabled={isAllBlocked}
            >{_("calculator.recalculate")}</FilledButton
        >
    </div>

    <Navigation slot="navigation-bar" />
</Scaffold>

<style>
    .calculator__container {
        margin: 0 auto;
        display: grid;
        gap: 1em;
        --width: 100%;
        max-width: 500px;
    }
    .calculator__switch {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .calculator__field {
        display: grid;
        grid-template-columns: auto max-content;
        gap: 1em;
        align-items: center;
        width: 100%;
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
