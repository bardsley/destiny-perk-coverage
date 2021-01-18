import axios from 'axios'

const getItemDefinition = async (hash) => {
    let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/inventoryItems/' + hash + '.json', {});
    // console.log(hash,request)
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

export { getItemDefinition, getCategoryDefinition, getCategories, setUpCategories }