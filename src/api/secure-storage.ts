import SecureStorage from "secure-web-storage"

const secret = "6cceadbb-1602-4e90-8893-5c872e157575"
const encrypt = (message: string, key: string) => {
    let _key = key
    while (_key.length < message.length) _key += key

    const result = Array.from(message).reduce((result, m, index) => {
        const k = _key[index]
        result += String.fromCharCode(m.charCodeAt(0) ^ k.charCodeAt(0))
        return result
    }, "")
    return result
}
export const secureStorage: Storage = new SecureStorage(localStorage, {
    hash(message: string) {
        var hash = 0,
            i,
            chr
        if (message.length === 0) return hash
        for (i = 0; i < message.length; i++) {
            chr = message.charCodeAt(i)
            hash = (hash << 5) - hash + chr
            hash |= 0 // Convert to 32bit integer
        }
        return hash.toString()
    },
    encrypt(data: string) {
        return encrypt(data, secret)
    },
    decrypt(data: string) {
        return encrypt(data, secret)
    },
})
