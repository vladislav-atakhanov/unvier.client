<script>
    import { Scaffold, AppBar } from "material/components"
    import Navigation from "../components/navigation.svelte"
    import WriteMe from "../components/write-me.svelte"
    import SchemeSwitcher from "../components/scheme-switcher.svelte"
    import { useIsAuth, useServerVersion } from "../api"
    import LanguageSwitcher from "../components/language-switcher.svelte"
    import { i18n } from "material/i18n"
    import LoadingText from "../components/loading-text.svelte"
    import Version, { clientVersion } from "../components/version.svelte"
    import { PRIVACY_POLICY } from "../url"

    const [serverVersion, loading] = useServerVersion()

    const isAuth = useIsAuth()
    const _ = i18n()
</script>

<Scaffold>
    <AppBar slot="app-bar" canBack={true}
        >{_("settings")}
        <div slot="actions" class="settings__write-me"><WriteMe /></div>
    </AppBar>
    <div class="settings__container">
        <div class="settings__switcher">
            {_("color-scheme")}
            <SchemeSwitcher />
        </div>
        <div class="settings__switcher">
            {_("language")}
            <LanguageSwitcher />
        </div>
        <div class="settings__version">
            <dl>
                <dt>{_("version.server")}</dt>
                <dd>
                    <LoadingText {loading}>
                        {$serverVersion}
                    </LoadingText>
                </dd>
            </dl>
            <dl>
                <dt>{_("version.client")}</dt>
                <dd>{clientVersion}</dd>
            </dl>
            <p><Version /></p>
        </div>

        <div class="policy">
            <a href={PRIVACY_POLICY}>{_("privacy-policy")}</a>
        </div>
    </div>

    <svelte:fragment slot="navigation-bar">
        {#if $isAuth}
            <Navigation />
        {/if}
    </svelte:fragment>
</Scaffold>

<style>
    :global(md-filled-button) {
        display: block;
    }
    .settings__write-me {
        font-size: 2em;
    }
    .settings__container {
        margin: 0 auto;
        max-width: 500px;
        display: grid;
        gap: 1em;
    }
    .settings__switcher {
        display: grid;
        gap: 0.5em;
    }
    .settings__version p {
        margin: 0;
        color: var(--md-sys-color-error);
    }
    .settings__version dd {
        margin: 0;
        padding: 0;
    }
    .settings__version dl {
        margin: 0;
        display: flex;
        gap: 1em;
    }
    .settings__version dt::after {
        content: ":";
    }
    a {
        color: var(--md-sys-color-primary);
    }
    @media (hover: hover) {
        a:hover {
            text-decoration: none;
        }
    }
</style>
