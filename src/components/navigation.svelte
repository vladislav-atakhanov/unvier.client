<script>
    import { NavigationBar } from "material/components"
    import { ATTESTATION, SCHEDULE, PROFILE } from "../url"
</script>

<NavigationBar let:Item on:update>
    <Item label="Оценки" icon="book" path={ATTESTATION} />
    <Item label="Расписание" icon="calendar_month" path={SCHEDULE} />
    <Item label="Профиль" icon="account_circle" path={PROFILE} />
</NavigationBar>