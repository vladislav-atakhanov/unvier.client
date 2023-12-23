<script>
    /** @type {string} */
    export let teacher

    /** @type {string | null} */
    export let teacher_link = null
</script>

{#if teacher_link}
    <a href={teacher_link} class="teacher-link">
        {teacher}
    </a>
{:else}
    {teacher}
{/if}

<style>
    .teacher-link {
        color: var(--md-sys-color-primary);
    }
    .teacher-link:hover {
        text-decoration: none;
    }
</style>
