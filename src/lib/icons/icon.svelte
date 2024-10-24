<script lang="ts">
    const icons = "/images/icons.svg"
    let { name, class: class_ }: { name: string; class?: string } = $props()
</script>

<svg class="icon--{name} {class_} w-6 h-6">
    <use href="{icons}#{name}"></use>
</svg>
