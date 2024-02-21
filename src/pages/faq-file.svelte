<script>
    import { Scaffold, AppBar, Icon } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import { useFAQ, useIsAuth } from "../api"
    import LoadingText from "../components/loading-text.svelte"
    import { i18n } from "material/i18n"
    import { onMount } from "svelte"
    import { fetchFAQFile } from "../api/files"
    const _ = i18n()
    const [faq, loading] = useFAQ()

    /** @type {string} */
    export let id
    /** @type {string} */
    let content = ""

    /** @type {HTMLElement} */
    let contentElement
    onMount(() => {
        fetchFAQFile(id).then((c) => (content = c))
    })

    $: title = $faq?.find(({ id: i }) => id === i)?.label

    /** @param {MouseEvent} event */
    const onClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (!event.target) return
        /** @type {HTMLElement} */
        const target = event.target

        const selector = target.getAttribute("href")
        if (!selector) return
        /** @type {HTMLElement} */
        const element = contentElement.querySelector(selector)
        if (!element) return

        const appBarHeight =
            document.querySelector(".scaffold__app-bar")?.scrollHeight || 0

        document.querySelector(".scaffold__content")?.scrollTo({
            behavior: "smooth",
            top: element.offsetTop - appBarHeight - 16,
        })
    }

    const isAuth = useIsAuth()
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Scaffold>
    <AppBar slot="app-bar">
        <LoadingText {loading} {title} />
    </AppBar>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="content" bind:this={contentElement} on:click={onClick}>
        {#if content}
            {@html content}
        {/if}
    </div>
    <svelte:fragment slot="navigation-bar">
        {#if $isAuth}
            <Navigation />
        {/if}
    </svelte:fragment>
</Scaffold>

<style>
    .content {
        max-width: 800px;
        margin: 0 auto;
    }
    .content :global(a) {
        color: var(--md-sys-color-primary);
    }
    .content :global(kbd) {
        display: inline-block;
        border-radius: 3px;
        padding: 1px 2px 0;
        border: 1px solid var(--md-sys-color-outline);
    }
    .content :global(h1) {
        margin-top: 0;
    }
</style>
