<script>
    import { Drawer, DrawerHeader } from "material/components"
    import { i18n } from "material/i18n"
    import {
        ATTESTATION,
        CALCULATOR,
        EXAMS,
        FAQ,
        PROFILE,
        SCHEDULE,
        SETTINGS,
        TELEGRAM,
        UMKD,
    } from "../url"
    import Icon from "./icon.svelte"
    import Profile from "./profile.svelte"
    import { checkAuth } from "../api"
    import { onMount } from "svelte"
    const _ = i18n()

    let isAuth = false
    onMount(() => {
        isAuth = checkAuth()
    })
</script>

<Drawer let:Section let:Item>
    <DrawerHeader slot="header">
        {#if isAuth}
            <Profile />
        {:else}
            <p>{_("updating")}</p>
        {/if}
    </DrawerHeader>
    <Section>
        <Item label={_("schedule")} icon="calendar_month" href={SCHEDULE} />
        <Item label={_("attestation")} icon="book" href={ATTESTATION} />
        <Item label={_("calculator")} icon="calculate" href={CALCULATOR} />
        <Item label={_("umkd")} icon="description" href={UMKD} />
        <Item label={_("exams")} icon="playlist_add_check" href={EXAMS} />
        <Item label={_("profile")} icon="account_circle" href={PROFILE} />
    </Section>
    <Section>
        <Item label="Telegram" href={TELEGRAM}>
            <Icon name="telegram" slot="icon" />
        </Item>
        <Item label={_("settings")} icon="settings" href={SETTINGS} />
        <Item label={_("faq")} icon="help" href={FAQ} />
    </Section>
</Drawer>
