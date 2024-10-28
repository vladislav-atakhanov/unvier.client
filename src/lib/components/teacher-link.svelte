<script lang="ts">
    let {
        teacher,
        teacher_link,
        class: class_ = "",
    }: { teacher: string; teacher_link?: string; class?: string } = $props()
</script>

{#if teacher_link}
    <a
        href={teacher_link}
        class="text-primary underline hover:no-underline {class_}"
    >
        {teacher}
    </a>
{:else}
    {teacher}
{/if}
