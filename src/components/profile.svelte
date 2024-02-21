<script>
    import { i18n } from "material/i18n"
    import { useTranscript } from "../api"

    const [transcript] = useTranscript()
    const _ = i18n()
</script>

<div class="profile">
    <p class="fullname">{$transcript?.fullname ?? _("updating")}</p>
    <p class="education-program">
        {$transcript?.education_program ?? _("updating")}
    </p>
</div>

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
