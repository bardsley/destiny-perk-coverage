import axios from 'axios'

const downloadWishlist = async () => {
    let url = 'https://raw.githubusercontent.com/48klocs/dim-wish-list-sources/master/voltron.txt'
    let request = await axios.get(url, {});
    let rows  = request.data.split("\n").filter((row) => {  // Split on newline and clear blank lines
        return row != ""
    }).map((row) => { // breakout notes data and fieldname
        let [field,notes] = row.split('#')
        let [fieldName,fieldData] = field.split(':')
        return { field: {name: fieldName, data: fieldData }, notes: notes }
    })

    return rows
}

const addModeToWishlist = (wishlist) => {

    let currentMode = 'none'

    let processed = wishlist.filter((row) => { // Remove everything that doesn't give perk info or PVP/PVE switch
        return row.field && row.field.data
    }).map((row,index) => { // Add PvP vs PvE info
        let pve = new RegExp(/pve/i)
        let pvp = new RegExp(/pvp/i)
        if(row.field.data.search(pve) >= 0) { currentMode = 'pve' } 
        if(row.field.data.search(pvp) >= 0) { currentMode = 'pvp' } 
        let returnObject = Object.assign({ index: index, mode: currentMode } , row )
        return returnObject 
    }).filter(( item ) => { // Only want the wishlist goodies
        return item.field.name == 'dimwishlist'
    }).map((wish) => { // split the info
        let [ itemString, perkString ] = wish.field.data.split('&')
        let itemhash = itemString.split('=')[1]
        let perks = perkString.split('=')[1].split(',')
        return { item: itemhash, perks: perks,  mode: wish.mode } 
    })
    return processed
}

const consolidateRollsOnWishlist = (wishlist) => {
    let rolls = {}
    
    wishlist.forEach(wish => { // Store PvP and PvE
        if( !Object.keys(rolls).includes(wish.item) ) { rolls[wish.item] = { // make sure we have somewhere to store it 
            pvp: [[],[],[],[]] , pve: [[],[],[],[]] , god: [[],[],[],[]] } 
        } 
        wish.perks.forEach((perkHash,index) => {
            if(!rolls[wish.item][wish.mode][index].includes(perkHash)) { rolls[wish.item][wish.mode][index].push(perkHash) }
        })
    })

    Object.keys(rolls).forEach(itemHash => { // Prep god rolls and remove from pvep/pvp
        rolls[itemHash].pvp.forEach((perkHash,index) => {
            let item = rolls[itemHash]
            item.god[index] = item.pvp[index].filter(x => item.pve[index].includes(x));
            item.pvp[index] = item.pvp[index].filter(x => !item.god[index].includes(x))
            item.pve[index] = item.pve[index].filter(x => !item.god[index].includes(x))
        })
    })
  
    console.log(rolls)
    return rolls
}

const processWishlist = async () => {
    let rows = await downloadWishlist()
    let processed = addModeToWishlist(rows)
    let rolls = consolidateRollsOnWishlist(processed)
    return rolls 
}

export { downloadWishlist , processWishlist }