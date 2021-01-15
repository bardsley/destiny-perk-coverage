import axios from 'axios'
const localApiKey = "742c14f071164cef9bb681b545c3e7be"
// const liveApiKey = "1c57e1390a134c1492de01238975680e"
const xApiKey = localApiKey

const getMembership = async () => {
    console.log(localStorage.getItem('token'))

    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let request = await axios.get('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': xApiKey,
        }
    });
    // localStorage.setItem('membershipId',)
    return request.data.Response
}

const getCharacters = async (memTypeId,memId) => {
    console.log(localStorage.getItem('token'))
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let request = await axios.get('https://www.bungie.net/platform/Destiny2/'+memTypeId+'/Profile/'+memId+'?components=Characters,ProfileProgression', {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': xApiKey,
        }
    });
    return request.data.Response.characters
}

export {
    getMembership,getCharacters
}