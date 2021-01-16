import axios from 'axios'

const storeToken= async (token) => {
    const parsedToken = JSON.stringify(token);
    const expiry = new Date().getTime() + (token.expires_in * 1000)
    // console.debug('Storing Token',token, parsedToken,"Expiry",expiry)
    localStorage.setItem('token',parsedToken)
    localStorage.setItem('token_expires',expiry)
    
}
const retrieveToken = async () => {
    let return_token = null
    if (localStorage.getItem('token')) {
        try {
            return_token = JSON.parse(localStorage.getItem('token'));
        } catch(e) {
            console.error("Token Broken",e)
            localStorage.removeItem('token');
        }
    } 
    return return_token
}

const tokenExpired = () => {
    const tokenExpiry = parseInt(localStorage.getItem('token_expires'))
    return (tokenExpiry < new Date().getTime())
}

const refreshToken = async () => {
    console.debug("Refresh Access Token")
    let token = JSON.parse(localStorage.getItem('token'))
    // let access_token = token.access_token
    let refresh_token = token.refresh_token
    // console.log('Tokens:',access_token,refresh_token)

    let request = await axios.post('https://www.bungie.net/platform/app/oauth/token/', 
        "client_id=35259&client_secret=6tgrKtTvbN0rSmAhSOFBDAbBOdfj0cFdWMTzmwGVJwU&grant_type=refresh_token&refresh_token="+refresh_token,
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