export default function utcDate(date){
    date = date.replace(' ', 'T')
    return new Date(date + 'Z')
}

export function shortDate(date){
    return utcDate(date).toLocaleString('en-GB', {
        style: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
})
}

export function shortDateTime(date){
    return utcDate(date).toLocaleString('en-GB', {
        style: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
})
}