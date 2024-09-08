
export default function axiosError({error, setDialogBox, resetDialogBox}){
    let msg
    if (error.response) {
        // The server responded with a status other than 200 range
        // console.error('Error Status:', error.response.status);  // 409
        // console.error('Error Message:', error.response.data);  // 'Error Handled'
        msg = error.response.data
        console.log('This is an error.')
    } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        msg = 'No response received'
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in request setup:', error.message);
        msg = error.message
    }
    setDialogBox(prev => ({msg, confirm: resetDialogBox, close: null, show: true}))
}

export function axiosLoading({setDialogBox, msg = 'Loading...'}){
    setDialogBox(prev => ({msg: msg, spinner: true, show: true}))
}