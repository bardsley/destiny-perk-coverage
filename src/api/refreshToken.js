import axios from 'axios'

const storeToken = (token) => {
    const parsedToken = JSON.stringify(token);
    const expiry = new Date().getTime() + (token.expires_in * 1000)
    localStorage.setItem('token',parsedToken)
    localStorage.setItem('token_expires',expiry)
}
const retrieveToken = () => {
    let return_token = null
    if (localStorage.getItem('token')) {
        try {
            return_token = JSON.parse(localStorage.getItem('token'));
        } catch(e) {
            localStorage.removeItem('token');
        }
    } 
    return return_token
}

const tokenExpired = () => {
    const tokenExpiry = parseInt(localStorage.getItem('token_expires')) || -1000000000 
    const token_expired = tokenExpiry < new Date().getTime()
    const token_missing = !localStorage.getItem('token')
    return (token_missing || token_expired)
}

const refreshToken = async () => {
    console.debug("Refresh Access Token")
    let token = JSON.parse(localStorage.getItem('token'))
    if(!token) { return false } // Should be to reject promise?
    let refresh_token = token.refresh_token
    let tokenRefreshUrl = 'https://www.bungie.net/platform/app/oauth/token/'
    let secret = window.location.host == 'destiny-perk-coverage.web.app' ? 'rxIuYYnX3ZKJFUmtNXn5vE7dn0sZIfKLeo2yvo3yn7o' : '6tgrKtTvbN0rSmAhSOFBDAbBOdfj0cFdWMTzmwGVJwU'
    let clientId = window.location.host == 'destiny-perk-coverage.web.app' ? 35202 : 35259
    let tokenRefreshData =`client_id=${clientId}&client_secret=${secret}&grant_type=refresh_token&refresh_token=${refresh_token}`
    let request = await axios.post(tokenRefreshUrl, 
        tokenRefreshData,
        {
            headers: {
                'x-api-key': localStorage.getItem('x-api-key'),
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
    // console.log(request.data)  
    storeToken(request.data)
    return request
}



export { storeToken, retrieveToken, tokenExpired, refreshToken }