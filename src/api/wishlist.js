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
    }).filter(( item ) => { // Only want the wishlist goodies
        return item.field.name == 'dimwishlist' 
    }).map((wish) => {
        let [ itemString, perkString ] = wish.field.data.split('&')
        let itemhash = itemString.split('=')[1]
        let perks = perkString.split('=')[1].split(',')
        return { item: itemhash, perks: perks }
    })

    let rolls = {}
    console.log(rolls)
    rows.forEach(wish => {
        // console.log("->", rolls)
        if( !Object.keys(rolls).includes(wish.item) ) { rolls[wish.item] = [] }
        rolls[wish.item].push(wish.perks)
        //     console.debug("Add this roll", rolls[wish.item])
        //      = 
        // } else {
        //     console.debug("New weapon",rolls[wish.item])
        //     rolls[wish.item] = [wish.perks]
        //     console.debug("New weapon",rolls[wish.item])

        // }
        
    });

    return rolls
}

export { downloadWishlist }