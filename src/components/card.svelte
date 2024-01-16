<script>
    export let active = false
    /** @type {string} */
    export let title

    /** @type {string | undefined} */
    export let href = undefined

    /** @type {string} */
    let class_ = ""
    export { class_ as class }

    export let tag = "section"
</script>

<svelte:element
    this={href ? "a" : tag}
    {href}
    class="card {class_}"
    class:card--button={href || tag === "button"}
    {...$$restProps}
    class:card--active={active}
    on:click
>
    <h2 class="card__title">{title}</h2>
    <slot />
</svelte:element>

<style>
    .card__title {
        padding-bottom: var(--padding);
        margin: 0;
        font-size: 1em;
        font-weight: normal;
        border-bottom: 1px solid var(--md-sys-color-outline);
        margin-bottom: var(--padding);
        word-wrap: break-word;
    }

    .card {
        --padding: 0.5em;
        padding: var(--padding);
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 5px;
        text-decoration: none;
        color: inherit;
        display: block;
        font: inherit;
        background-color: transparent;
        text-align: left;
    }
    @media (hover: hover) {
        .card--button:hover {
            border: 1px solid var(--md-sys-color-primary);
            background-color: var(--md-sys-color-secondary-container);
        }
    }
    .card--button:active,
    .card--active {
        border: 1px solid var(--md-sys-color-primary);
        background-color: var(--md-sys-color-secondary-container);
    }
</style>
