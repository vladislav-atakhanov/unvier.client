<script lang="ts">
    import { NavigationBar } from "material/components"
    import { ATTESTATION, SCHEDULE, PROFILE } from "../url"
    import InstallButton from "./install-button.svelte"

    import { i18n } from "material/i18n"
    const _ = i18n()
</script>

<NavigationBar let:Item on:update>
    <Item label={_("attestation")} icon="book" path={ATTESTATION} />
    <Item label={_("schedule")} icon="calendar_month" path={SCHEDULE} />
    <Item label={_("profile")} icon="account_circle" path={PROFILE} />
    <InstallButton tag="li" class="navigation__item--install">
        <Item slot="mobile" label={_("install")} icon="install_mobile" />
        <Item slot="desktop" label={_("install")} icon="install_desktop" />
    </InstallButton>
</NavigationBar>
