class StoredValue<T extends string> {
    value = $state<T>("" as T)
    constructor(public key: string, public defaultValue: T) {
        this.value = defaultValue
    }
    apply(...args: unknown[]) {
        $effect(() => {
            if (this.value === this.defaultValue) {
                localStorage.removeItem(this.key)
            } else {
                localStorage.setItem(this.key, this.value)
            }
        })
        this.value = (localStorage.getItem(this.key) as T) ?? this.defaultValue
    }
}

export class ColorScheme extends StoredValue<"auto" | "dark" | "light"> {
    constructor() {
        super("color-theme", "auto")
    }
    apply(node: HTMLElement) {
        super.apply()
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
