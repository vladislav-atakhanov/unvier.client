<script lang="ts">
    let { teacher, teacher_link }: { teacher: string; teacher_link?: string } =
        $props()
</script>

{#if teacher_link}
    <a href={teacher_link} class="text-primary underline hover:no-underline">
        {teacher}
    </a>
{:else}
    {teacher}
{/if}
