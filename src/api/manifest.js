import axios from 'axios'

const getItemDefinition = async (hash) => {
    let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/inventoryItems/'+hash+'.json', {
    });
    // console.log(hash,request)
    return request.data
}

const getCategoryDefinition = async (hash) => {
    let request = await axios.get('https://destiny-perk-coverage-default-rtdb.europe-west1.firebasedatabase.app/manifest/itemCategories/'+hash+'.json', {
    });
    // console.log(hash,request)
    return request.data
}

export { getItemDefinition,getCategoryDefinition}