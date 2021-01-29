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
    let request = await axios.get('https://www.bungie.net/platform/Destiny2/' + memTypeId + '/Profile/' + memId + '/?components=Characters,ProfileProgression', {
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
    let url = 'https://www.bungie.net/platform/Destiny2/' + memTypeId + '/Profile/' + memId + '/Character/' + characterId + '/?components=CharacterEquipment,CharacterInventories'
    try {
        let request = await axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + access_token,
                'x-api-key': localStorage.getItem('x-api-key'),
            }
        });
        return request.data.Response
    } catch (err) {
        return { request_url: url, error: err, perks: { data: { perks: [{ perkHash: "1796472574"}]}}}
    }
}

const getVault = async (memTypeId, memId) => {
    const vaultId = 138197802 // BucketHash = bucketHash
    if (tokenExpired()) { await refreshToken() }
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let components = 'ProfileInventories,ItemSockets,ItemPerks'
    let request = await axios.get(`https://www.bungie.net/platform/Destiny2/${memTypeId}/Profile/${memId}/?components=${components}`, {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': localStorage.getItem('x-api-key'),
        }
    });
    let vaultItems =  request.data.Response.profileInventory.data.items.filter((item) => { return item.bucketHash == vaultId } )
    let perks = request.data.Response.itemComponents.perks.data
    let sockets = request.data.Response.itemComponents.sockets.data
    console.log(request.data.Response)
    // return vaultItems
    return { vault: vaultItems, perks: perks, sockets: sockets } 
}

export {
    getMembership, getCharacters, getCharacterItems, getVault
}