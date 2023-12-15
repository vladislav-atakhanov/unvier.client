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
        width: 1em;
        height: 1em;
    }
</style>
