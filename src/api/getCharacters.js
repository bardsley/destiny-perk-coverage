import axios from 'axios'
import { tokenExpired, refreshToken } from './refreshToken'

const getMembership = async () => {
    if (tokenExpired()) { await refreshToken() }
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let request = await axios.get('https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/', {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': localStorage.getItem('x-api-key'),
        }
    });
    // localStorage.setItem('membershipId',)
    return request.data.Response
}

const getCharacters = async (memTypeId, memId) => {
    if (tokenExpired()) { await refreshToken() }
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let request = await axios.get('https://www.bungie.net/platform/Destiny2/' + memTypeId + '/Profile/' + memId + '?components=Characters,ProfileProgression', {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': localStorage.getItem('x-api-key'),
        }
    });
    return request.data.Response.characters.data
}

const getCharacterItems = async (memTypeId, memId, characterId) => {
    if (tokenExpired()) { await refreshToken() }
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let request = await axios.get('https://www.bungie.net/platform/Destiny2/' + memTypeId + '/Profile/' + memId + '/Character/' + characterId + '?components=CharacterEquipment,CharacterInventories', {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': localStorage.getItem('x-api-key'),
        }
    });
    return request.data.Response
}

export {
    getMembership, getCharacters, getCharacterItems
}