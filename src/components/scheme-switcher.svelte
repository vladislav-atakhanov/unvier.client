<script lang="ts">
    import {
        type Scheme,
        getSavedScheme,
        setScheme,
    } from "material/color-scheme"
    import { onMount } from "svelte"
    let current: Scheme

    onMount(() => {
        current = getSavedScheme()
    })

    $: current && setScheme(current)
</script>

<div class="switcher">
    <div class="switcher__labels">
        <label class="label" class:label--active={current === "light"}>
            <input type="radio" bind:group={current} value="light" />
            <span>Светлая</span>
        </label>
        <label class="label" class:label--active={current === "auto"}>
            <input type="radio" bind:group={current} value="auto" />
            <span>Системная</span>
        </label>
        <label class="label" class:label--active={current === "dark"}>
            <input type="radio" bind:group={current} value="dark" />
            <span>Темная</span>
        </label>
    </div>
</div>

<style>
    .switcher__labels {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 10em;
        overflow: hidden;
    }
    input {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        overflow: hidden;
    }
    label {
        text-align: center;
        padding: 10px 12px;
        border-left: 1px solid var(--md-sys-color-outline);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    label:first-of-type {
        border-left: none;
    }
    .label--active {
        background-color: var(--md-sys-color-secondary-container);
    }
</style>
