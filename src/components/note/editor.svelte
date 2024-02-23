<script>
    import { BottomSheet, IconButton, OneLine } from "material/components"
    const clear = () => (value = "")

    /** @param {() => void} close*/
    const onSubmit = (close) => () => {
        close()
    }

    /** @type {HTMLElement} */
    let textarea
    const focus = () => {
        if (textarea) textarea.focus()
    }

    /** @type {BottomSheet} */
    let sheet

    let _title = "Заметка"

    let value = ""
    /**
     * @param {string} text
     * @param {string} [title]
     * @returns {Promise<string>}
     */
    export function getText(text, title = "Заметка") {
        value = text
        _title = title
        return new Promise((r) => {
            sheet.open().then(() => {
                r(value)
                clear()
            })
        })
    }
</script>

<BottomSheet
    on:open={focus}
    on:click={focus}
    let:close
    bind:this={sheet}
    --sheet-height="calc(100vh - 100px)"
>
    <div class="content">
        <div class="header">
            <h2 class="header__title"><OneLine>{_title}</OneLine></h2>
            <IconButton
                disabled={value.length < 1}
                on:click={clear}
                icon="delete"
            />
        </div>
        <form on:submit|preventDefault={onSubmit(close)}>
            <textarea bind:value bind:this={textarea}></textarea>
        </form>
    </div>
</BottomSheet>

<style>
    .content {
        display: grid;
        height: 100%;
        grid-template-rows: max-content auto;
    }
    .header {
        display: grid;
        grid-template-columns: 1fr min-content;
        align-items: center;
        gap: 1em;
    }
    .header__title {
        margin: 0;
        font-size: 1em;
        font-weight: bold;
    }
    textarea {
        font: inherit;
        background-color: transparent;
        border: none;
        outline: none;
        resize: none;
        display: block;
        height: calc(100% + var(--sheet-padding));
        margin-left: calc(var(--sheet-padding) * -1);
        width: calc(100% + var(--sheet-padding) * 2);
        padding: var(--sheet-padding);
    }
</style>
