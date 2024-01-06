<script>
    import { Drawer, DrawerHeader } from "material/components"
    import { i18n } from "material/i18n"
    import {
        ATTESTATION,
        CALCULATOR,
        EXAMS,
        PROFILE,
        SCHEDULE,
        SETTINGS,
        TELEGRAM,
    } from "../url"
    import Icon from "./icon.svelte"
    import { useTranscript } from "../api"
    const _ = i18n()

    const [transcript] = useTranscript()
</script>

<Drawer let:Section let:Item>
    <DrawerHeader slot="header">
        <div class="profile">
            <p class="fullname">{$transcript?.fullname ?? _("updating")}</p>
            <p class="education-program">
                {$transcript?.education_program ?? _("updating")}
            </p>
        </div>
    </DrawerHeader>
    <Section>
        <Item label={_("exams")} icon="playlist_add_check" href={EXAMS} />
        <Item label={_("calculator")} icon="calculate" href={CALCULATOR} />
    </Section>
    <Section>
        <Item label={_("attestation")} icon="book" href={ATTESTATION} />
        <Item label={_("schedule")} icon="calendar_month" href={SCHEDULE} />
        <Item label={_("profile")} icon="account_circle" href={PROFILE} />
    </Section>
    <Section>
        <Item label="Telegram" href={TELEGRAM}>
            <Icon name="telegram" slot="icon" />
        </Item>
        <Item label={_("settings")} icon="settings" href={SETTINGS} />
    </Section>
</Drawer>

<style>
    .profile {
        align-self: flex-end;
    }
    p {
        margin: 0;
    }
    .fullname {
        font-weight: bold;
    }
    .education-program {
        font-size: 0.8em;
    }
</style>
