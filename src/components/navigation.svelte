<script>
    import { NavigationBar } from "material/components"
    import { ATTESTATION, SCHEDULE, PROFILE } from "../url"

    import { i18n } from "material/i18n"
    const _ = i18n()
</script>

<NavigationBar let:Item on:update>
    <Item label={_("attestation")} icon="book" path={ATTESTATION} />
    <Item label={_("schedule")} icon="calendar_month" path={SCHEDULE} />
    <Item label={_("profile")} icon="account_circle" path={PROFILE} />
</NavigationBar>
