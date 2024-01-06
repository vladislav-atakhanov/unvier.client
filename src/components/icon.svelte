<script>
    const icons = "/images/icons.svg"
    /** @type {string} */
    export let name
</script>

<svg class="icon icon--{name}" width="16" height="16">
    <use href="{icons}#{name}"></use>
</svg>

<style>
    svg {
        font-size: var(--size, 24px);
        width: var(--size, 24px);
        height: var(--size, 24px);
    }
</style>
