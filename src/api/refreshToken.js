import axios from 'axios'
const localApiKey = "742c14f071164cef9bb681b545c3e7be"
const xApiKey = localApiKey

const refreshToken = async () => {
    let token = JSON.parse(localStorage.getItem('token'))
    let access_token = token.access_token
    let refresh_token = token.refresh_token
    console.log('Tokens:',access_token,refresh_token)

    let request = await axios.post('https://www.bungie.net/platform/app/oauth/token/', 
        "client_id=35259&client_secret=6tgrKtTvbN0rSmAhSOFBDAbBOdfj0cFdWMTzmwGVJwU&grant_type=refresh_token&refresh_token="+refresh_token,
        {
            headers: {
                // Authorization: 'Bearer ' + access_token,
                'x-api-key': xApiKey,
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
    return request
}

export { refreshToken }