import axios from 'axios'
import { tokenExpired, refreshToken } from './refreshToken'
import { Mutex } from 'async-mutex';

const itemInstanceCacheMutex = new Mutex();


const getItemDefinition = async (hash) => {
    let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/inventoryItems/' + hash + '.json', {});
    // console.log(hash,request)
    return request.data
}

const getPerkDefinition = async (hash) => {
  let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/sandboxPerks/' + hash + '.json', {});
    // console.log(hash,request)
    return request.data
}

const getItemInstance = async (memTypeId, memId, itemInstanceId) => {
    if (tokenExpired()) { await refreshToken() }
    let access_token = JSON.parse(localStorage.getItem('token')).access_token
    let components = "ItemInstances,ItemPerks"//,ItemSockets"//,ItemReusablePlugs,ItemTalentGrids,ItemPlugStates,PresentationNodes"
    let url = `https://www.bungie.net/platform/Destiny2/${memTypeId}/Profile/${memId}/Item/${itemInstanceId}/?components=${components}`
    try {
      let request = await axios.get(url,{
        headers: {
            Authorization: 'Bearer ' + access_token,
            'x-api-key': localStorage.getItem('x-api-key'),
        }
      })
      return request.data.Response
    } catch (err) {
      return { request_url: url, error: err, perks: { data: { perks: [{ perkHash: "1796472574"}]}}}
    }
}

const getItemInstanceViaCache = async (memTypeId, memId, itemInstanceId) => {
  if(!localStorage.getItem('itemInstanceCache')) { localStorage.setItem('itemInstanceCache',JSON.stringify({}))}
  let itemInstanceCache = JSON.parse(localStorage.getItem('itemInstanceCache'))
  console.log("Searching ",itemInstanceCache, " for ", itemInstanceId)
  let cachedItem = itemInstanceCache[itemInstanceId]
  if(!cachedItem) { 
    let liveItem = await getItemInstance (memTypeId, memId, itemInstanceId)
    const release = await itemInstanceCacheMutex.acquire();
    try {
      itemInstanceCache = JSON.parse(localStorage.getItem('itemInstanceCache')) // Rfresh the cache
      itemInstanceCache[itemInstanceId] = liveItem
      localStorage.setItem('itemInstanceCache',JSON.stringify(itemInstanceCache))
    } finally { release(); }
    return liveItem
  } else {
    console.log("Cache Hit ",itemInstanceId, itemInstanceCache)
    return cachedItem
  }
  
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

const getPlugsets = async () => {
  let request = await axios.get('https://www.bungie.net/common/destiny2_content/json/en/DestinyPlugSetDefinition-28e06178-b2e8-420e-99ca-311865aaf5f0.json',{});
  return request.data
}

const setupPlugsets = async () => {
  if(!localStorage.getItem('plugsets')) {
    console.log("No Plugsets")
    getPlugsets().then((response) => { 
      localStorage.setItem('plugsets',JSON.stringify(response))
      return JSON.stringify(response)
    })
    
  } else {
    return JSON.parse(localStorage.getItem('plugsets'))
  }
}

export { getItemDefinition, getPerkDefinition, getItemInstance, getItemInstanceViaCache , getCategoryDefinition, setUpCategories, setupPlugsets }