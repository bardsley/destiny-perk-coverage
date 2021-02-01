<template>
    <div id="perk-graph">
        <h1>Your perk graph</h1>
        <p>Items {{ weapons.length }}, Sockets {{ Object.keys(sockets).length }}</p>
        

        <table>
            <thead><td></td>
                <th class="rotate" v-for="weapon_type in weapon_types" :key="weapon_type">
                    <div><span>{{ weapon_type }} </span></div>
                </th><th class="rotate"><div><span>Total</span></div></th>
            </thead>
            <tbody>
                <template v-for="(perk,key,index) in perkGrid" > 
                    <tr :key="key">
                        <th>{{ key }} <span>{{perk.details}}</span></th>
                        <td v-for="weapon_type in weapon_types" :key="key+'_'+weapon_type">{{ perk[weapon_type] }} </td>
                        <td>{{perk.total}}</td>
                    </tr>
                    <tr :key="key+'-details'" :id="`perk-details-${index}`">
                        <td colspan="18">
                            <pre>{{ perk }}</pre>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>

    </div>
</template>

<script>

import { setUpCategories , setupPlugsets , getItemDefinition , getPerkDefinition } from "@/api/manifest";
import { getCharacters, getCharacterItems , getVault } from "@/api/getCharacters";

export default {
    props: ['membershipType','membershipId',],
    data() {
        return {
            categories: {},
            plugsets: {},
            characters: {},
            sockets:{},
            perks: {},
            perkGrid: {},
            weapons: [],
            weapon_types: []
        }
    },
    async created() {
        this.categories = await setUpCategories()
        this.plugsets = await setupPlugsets()
        this.characters = await getCharacters(this.membershipType,this.membershipId)
        let characterIds = Object.keys(this.characters)
        
        characterIds.forEach( async (characterId) => {
            let characterItems = await getCharacterItems(this.membershipType,this.membershipId,characterId)
            Object.assign(this.sockets,characterItems.sockets)
            Object.assign(this.perks,characterItems.perks)

            let characterEquipment = []
            Object.assign(characterEquipment,characterItems.equipment)
            Object.assign(characterEquipment,characterItems.inventory)
            let downloadedEquipment = await this.addItemDefinitions(characterEquipment)
            let weapons = this.filterWeapons(downloadedEquipment)
            console.log("Adding ",weapons.length, " weapons")
            this.weapons = this.weapons.concat(weapons)
            
        })        
        let vaultContents = await getVault(this.membershipType,this.membershipId )     
        Object.assign(this.sockets,vaultContents.sockets)
        Object.assign(this.perks,vaultContents.perks)

        let downloadedEquipment = await this.addItemDefinitions(vaultContents.items)
        let weapons = this.filterWeapons(downloadedEquipment)
        console.log("Adding ",weapons.length, " weapons")
        this.weapons = this.weapons.concat(weapons)
        
        // Add definitions to all perks?
        console.log("Perks size",Object.keys(this.perks).length)
        
        // Build the grid
        this.weapons.forEach((instance) => {
            let weapon = instance.item
            let category = weapon.itemTypeDisplayName ? weapon.itemTypeDisplayName : false
            if(category) {
                if(!this.weapon_types.includes(category)) { this.weapon_types.push(category) }

                let perks = this.perks[instance.itemInstanceId].perks
                perks.forEach(async (perkId) => {
                    let perk = await getPerkDefinition(perkId.perkHash)
                    if(perk.isDisplayable) { 
                        console.log("Perkdef:",perk)
                        let perkName = perk.displayProperties.name
                        if(!this.perkGrid[perkName]) { this.$set(this.perkGrid,perkName,{ details: perk, total: 0 }) }
                        if(!this.perkGrid[perkName][weapon.itemTypeDisplayName]) { this.$set(this.perkGrid[perkName],weapon.itemTypeDisplayName,0) }
                        this.perkGrid[perkName][weapon.itemTypeDisplayName] = this.perkGrid[perkName][weapon.itemTypeDisplayName] + 1
                        this.perkGrid[perkName].total += 1
                    }
                })
            }
        })

    },
    methods: {
        filterWeapons(instances) {
            return instances.filter( (instance) => {
                return instance.item.itemCategoryHashes && instance.item.itemCategoryHashes.includes(1)
            })
        },
        async addItemDefinitions(instances) {
            return await Promise.all(
                instances.map(async (instance) => {
                    let itemDef = await getItemDefinition(instance.itemHash)
                    Object.assign(instance, { item:itemDef })
                    return instance
                })
            )
        },
        getWeaponSockets(sockets) {
            console.log("Not processing",sockets)
            // const weaponPerkSocketCategory = 4241085061  // socketCategories socketEntries
            // let socketIndexes = sockets.socketCategories.filter((cat) => { return cat.socketCategoryHash == weaponPerkSocketCategory })[0].socketIndexes
            // sockets = socketIndexes.map((index) => {
            //     // let plugItemhash = sockets.socketEntries[index].reusablePlugItems ? sockets.socketEntries[index].reusablePlugItems[0].plugItemHash : 0
            //     // return plugItemhash 

            //     let plugset = this.plugsets[sockets.socketEntries[index].randomizedPlugSetHash]
            //     // plugset ? plugset.reusablePlugItems : []
            //     let names = null
            //     if(plugset) {
            //         console.log('Plugset:',plugset.reusablePlugItems)
            //         names = plugset.reusablePlugItems.map((plugItem) => {
            //             console.log('PlugItem:',plugItem.plugItemHash)
            //             if(plugItem.plugItemHash) {
            //                 console.log("Exists:", plugItem.plugItemHash)
            //                 let perkName = ""
            //                 getItemDefinition(plugItem.plugItemHash).then((response) => {
            //                     perkName = response.displayProperties.name
            //                     console.log("perkNamne", perkName)
            //                 })

            //             }
            //         })
            //     }
            //     return names 
            //     // return plugset ? plugset.reusablePlugItems : false
            // })
            // console.log("Sockets before filter",sockets)
            // sockets = sockets.filter((item) => { return item } ) //.map((item) => {return item.plugItemHash} )
            // return sockets
        }
    }
}
</script>

<style lang="scss">
table { border-collapse: collapse; }
tbody th { 
    text-align: left; 

    span { 
        font-size: 0.7em; display:none;
    }
}

th.rotate {
    /* Something you can count on */
    height: 140px;
    white-space: nowrap;

    > div {
        transform: 
        /* Magic Numbers */
        translate(14px, 51px)
        /* 45 is really 360 - 45 */
        rotate(315deg);
        // rotate(0deg);
        width: 30px;

        > span {
            border-bottom: 1px solid #ccc;
            padding: 5px 10px;
        }
    }
}
tbody th { padding: 5px 10px; }
tbody td { text-align:center;}
tbody td pre { text-align: left; max-width:100%; overflow: hidden; white-space: pre-wrap; }
tbody>tr>* { border: 1px solid #ccc; }
</style>