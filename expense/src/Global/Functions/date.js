export default function utcDate(date){
    console.log(date)
    date = date.replace(' ', 'T') + 'Z'
    console.log(new Date(date))
    return new Date(date)
}

export function shortDate(date){
    // return utcDate(date)
    return utcDate(date).toLocaleString('en-GB', {
        style: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
})
}

export function shortDateTime(date){
    // return utcDate(date)
    return utcDate(date).toLocaleString('en-GB', {
        style: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
})
}

export function timeZone(){
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}