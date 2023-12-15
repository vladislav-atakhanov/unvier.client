<script>
    export let active = false
    /** @type {string} */
    export let title
</script>

<section class="card" class:card--active={active}>
    <h2 class="card__title">{title}</h2>
    <slot />
</section>

<style>
    .card__title {
        padding-bottom: var(--padding);
        margin: 0;
        font-size: 1em;
        font-weight: normal;
        border-bottom: 1px solid var(--md-sys-color-outline);
        margin-bottom: var(--padding);
    }
    .card {
        --padding: 0.5em;
        padding: var(--padding);
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 5px;
    }
    .card--active {
        border: 1px solid var(--md-sys-color-primary);
        background-color: var(--md-sys-color-secondary-container);
    }
</style>
