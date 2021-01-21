import axios from 'axios'
import { tokenExpired, refreshToken } from './refreshToken'


const getItemDefinition = async (hash) => {
    let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/inventoryItems/' + hash + '.json', {});
    // console.log(hash,request)
    return request.data
}

const getItemInstance = async (memTypeId, memId, itemInstanceId) => {
    if (tokenExpired()) { await refreshToken() }
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let components = "ItemInstances,ItemPerks,ItemSockets,ItemReusablePlugs" //,ItemTalentGrids,ItemPlugStates,PresentationNodes"
    let request = await axios.get(`https://www.bungie.net/platform/Destiny2/${memTypeId}/Profile/${memId}/Item/${itemInstanceId}/?components=${components}`,{
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': localStorage.getItem('x-api-key'),
        }
    })
    return request.data
}

const getCategoryDefinition = async (hash) => {
    let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/itemCategories/' + hash + '.json', {});
    // console.log(hash,request)
    return request.data
}

const getCategories = async () => {
    let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/itemCategories.json', {});
    return request.data
}

const setUpCategories = async () => {
    if(!localStorage.getItem('categories')) {
      console.log("No categories")
      getCategories().then((response) => { 
        localStorage.setItem('categories',JSON.stringify(response))
        return JSON.stringify(response)
      })
      
    } else {
      return JSON.parse(localStorage.getItem('categories'))
    }
  }

export { getItemDefinition, getItemInstance, getCategoryDefinition, getCategories, setUpCategories }