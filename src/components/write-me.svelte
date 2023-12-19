<script>
    import Icon from "./icon.svelte"
    export let href = "https://t.me/univerapp"
    export let icon = "telegram"
</script>

<a class="write-me" {href}>
    <Icon name={icon} />
</a>

<style>
    .write-me {
        display: flex;
        align-items: center;
        color: inherit;
        height: 1em;
        width: 1em;
    }
</style>
