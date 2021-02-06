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
    console.log(request.data.Response)
    localStorage.setItem('membershipId',request.data.Response.destinyMemberships[0].membershipId)
    localStorage.setItem('membershipType',request.data.Response.destinyMemberships[0].membershipType)
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
    let components = 'CharacterEquipment,CharacterInventories,ItemSockets,ItemPerks,ItemReusablePlugs'
    let url = `https://www.bungie.net/platform/Destiny2/${memTypeId}/Profile/${memId}/Character/${characterId}/?components=${components}`
    try {
        let request = await axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + access_token,
                'x-api-key': localStorage.getItem('x-api-key'),
            }
        });
        let characterEquipment = request.data.Response.equipment.data.items
        let characteInventory =  request.data.Response.inventory.data.items
        let sockets = request.data.Response.itemComponents.sockets.data
        let perks = request.data.Response.itemComponents.perks.data
        let plugs = request.data.Response.itemComponents.reusablePlugs.data
        let returnObj = { equipment: characterEquipment, inventory: characteInventory, sockets: sockets, perks: perks, plugs: plugs}
        console.log("CharacterItems: ",returnObj)
        return returnObj
    } catch (err) {
        console.log("Failed",err)
        return { request_url: url, error: err, perks: { "0000": { perks: [{ perkHash: "1796472574"}]}}}
    }
}

const getVault = async (memTypeId, memId) => {
    const vaultId = 138197802 // BucketHash = bucketHash
    if (tokenExpired()) { await refreshToken() }
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let components = 'ProfileInventories,ItemSockets,ItemPerks,ItemReusablePlugs'
    let request = await axios.get(`https://www.bungie.net/platform/Destiny2/${memTypeId}/Profile/${memId}/?components=${components}`, {
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': localStorage.getItem('x-api-key'),
        }
    });
    let vaultItems =  request.data.Response.profileInventory.data.items.filter((item) => { return item.bucketHash == vaultId } )
    let perks = request.data.Response.itemComponents.perks.data
    let sockets = request.data.Response.itemComponents.sockets.data
    let plugs = request.data.Response.itemComponents.reusablePlugs.data
    let returnObj = { items: vaultItems, perks: perks, sockets: sockets, plugs:plugs } 
    console.log("Vault Items: ",returnObj)
    // return vaultItems
    return returnObj
}

export {
    getMembership, getCharacters, getCharacterItems, getVault
}