class HTTPError_ extends Error {
    constructor(public status: number, message: string) {
        super(message)
    }
}
export class BadRequest extends HTTPError_ {
    constructor() {
        super(400, "Bad Request")
    }
}
export class Unauthorized extends HTTPError_ {
    constructor() {
        super(401, "Unauthorized")
    }
}
export class PaymentRequired extends HTTPError_ {
    constructor() {
        super(402, "Payment Required")
    }
}
export class Forbidden extends HTTPError_ {
    constructor() {
        super(403, "Forbidden")
    }
}
export class NotFound extends HTTPError_ {
    constructor() {
        super(404, "Not Found")
    }
}
export class RequestTimeout extends HTTPError_ {
    constructor() {
        super(408, "Request Timeout")
    }
}
export class ServerError extends HTTPError_ {
    constructor(status: number) {
        super(status, "Server Error")
    }
}

export function HTTPError(status: number) {
    switch (status) {
        case 400:
            return new BadRequest()
        case 401:
            return new Unauthorized()
        case 402:
            return new PaymentRequired()
        case 403:
            return new Forbidden()
        case 404:
            return new NotFound()
        case 408:
            return new RequestTimeout()
    }
    if (status >= 500 && status < 600) return new ServerError(status)
    return new HTTPError_(status, `Status ${status}`)
}
