<script>
    import Icon from "./icon.svelte"
    import { TELEGRAM } from "../url"
    export let href = TELEGRAM
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
        --size: 1em;
    }
</style>
