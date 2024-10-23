export class ColorScheme {
    value = $state<"auto" | "dark" | "light">("auto")
    apply(node: HTMLElement) {
        console.log(node)

        $effect(() => {
            if (this.value === "auto") {
                node.classList.remove("light", "dark")
                return
            }
            node.classList.remove(this.value === "dark" ? "light" : "dark")
            node.classList.add(this.value)
        })
    }
}
