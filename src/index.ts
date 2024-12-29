const is_object = (val: any, or = false) => typeof val === 'object' && val !== null && !Array.isArray(val) ? val : or
const is_array = (val: any, or = false) => typeof val === 'object' && Array.isArray(val) ? val : or


// it will generate [a&b&c]
const formateArray = (data: any, pieces: any[]) => {
    let res = ''
    for (let item of data) {
        if (is_object(item)) {
            const format = formateObject(item, pieces) // {a:1&b:2}
            const index = pieces.length
            pieces.push(`${index}(${format})`)
            item = `{${index}}`
        } else if (is_array(item)) {
            const format = formateArray(item, pieces) // [a&b&c]
            const index = pieces.length
            pieces.push(`${index}(${format})`)
            item = `[${index}]`
        }
        res += `${item}&`
    }
    res = res.slice(0, -1)
    return `${res}`
}

// it will return {a:1&b:2}
const formateObject = (data: any, pieces: any[]) => {
    let res = ''
    for (let key in data) {
        let item = data[key]

        if (is_object(item)) {
            const format = formateObject(item, pieces) // {a:1&b:2}
            const index = pieces.length
            pieces.push(`${index}(${format})`)
            item = `{${index}}`
        } else if (is_array(item)) {
            const format = formateArray(item, pieces) // [a&b&c]
            const index = pieces.length
            pieces.push(`${index}(${format})`)
            item = `[${index}]`
        }
        res += `${key}=${item}&`
    }
    res = res.slice(0, -1)
    return `${res}`
}

export const toString = (data: any): any => {
    let pieces: any[] = []

    if (is_object(data)) {
        const root = formateObject(data, pieces) // {a:1&b:2}
        let res = `{${root}}/${pieces.join('|')}`
        res = res.replace(/\'/g, '"')
        return encodeURI(res)
    } else if (is_array(data)) {
        const root = formateArray(data, pieces) // [a&b&c]
        let res = `[${root}]/${pieces.join('|')}`
        res = res.replace(/\'/g, '"')
        return encodeURI(res)
    }
}

const extractArray = (data: any, pieces: any[]) => {
    let res = []
    const items = data.split('&')
    for (let value of items) {
        if (isType(value, 'object')) {
            const index = value.slice(1, -1)
            const piece = pieces[index]
            value = extractObject(piece, pieces)
        } else if (isType(value, 'array')) {
            const index = value.slice(1, -1)
            const piece = pieces[index]
            value = extractArray(piece, pieces)
        }
        res.push(value)
    }

    return res
}

const extractObject = (data: any, pieces: any[]) => {
    let res: any = {}

    const items = data.split('&')
    for (let item of items) {
        const split = item.split('=')
        const key = split[0]
        let value = split[1]

        if (isType(value, 'object')) {
            const index = value.slice(1, -1)
            const piece = pieces[index]
            value = extractObject(piece, pieces)
        } else if (isType(value, 'array')) {
            const index = value.slice(1, -1)
            const piece = pieces[index]
            value = extractArray(piece, pieces)
        }
        res[key] = value
    }

    return res
}

const isType = (data: string, type: string): any => {
    if (data) {
        let start = data.charAt(0)
        let end = data.charAt(data.length - 1)
        if (type === 'array') {
            return start + end === '[]'
        }
        return start + end === '{}'
    }
}

const parse = (data: any) => {
    data = decodeURI(data)
    const splites = data.split('/')
    let root = splites[0]
    const pieces: any = {}

    if (splites[1]) {
        const piecesArray = splites[1].split('|')
        for (let pc of piecesArray) {
            const _r = /(\d+)\(/gi
            const regex = new RegExp(_r)
            const mt: any = regex.exec(pc);
            pc = pc.replace(_r, '')
            pc = pc.slice(0, -1)
            pieces[mt[1]] = pc
        }
    }

    if (isType(root, 'object')) {
        root = root.slice(1, -1) // rermove brakets
        let res = extractObject(root, pieces)
        return res
    } else if (isType(root, 'array')) {
        root = root.slice(1, -1) // rermove brakets
        let res = extractArray(root, pieces)
        return res
    }
}

const piece = {
    toString,
    parse
}
export default piece