<script>
    export let active = false
    /** @type {string} */
    export let title

    /** @type {string | undefined} */
    export let href = undefined

    /** @type {string} */
    let class_ = ""
    export { class_ as class }
</script>

<svelte:element
    this={href ? "a" : "section"}
    {href}
    class="card {class_}"
    class:card--button={href}
    class:card--slot={$$slots.default}
    {...$$restProps}
    class:card--active={active}
>
    <h2 class="card__title">{title}</h2>
    <slot />
</svelte:element>

<style>
    .card__title {
        margin: 0;
        font-size: 1em;
        font-weight: normal;
        word-wrap: break-word;
    }
    .card--slot .card__title {
        border-bottom: 1px solid var(--md-sys-color-outline);
        padding-bottom: var(--_padding);
        margin-bottom: var(--_padding);
    }

    .card {
        --_padding: var(--padding, 0.5em);
        padding: var(--_padding);
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 5px;
        text-decoration: none;
        color: inherit;
        display: block;
        font: inherit;
        background-color: transparent;
        text-align: left;
    }

    .card--button {
        transition: transform 0.2s;
    }
    .card--button:active {
        transform: scale(0.95);
    }
    .card--button:hover,
    .card--active {
        border: 1px solid var(--md-sys-color-primary);
        background-color: var(--md-sys-color-secondary-container);
    }
</style>
