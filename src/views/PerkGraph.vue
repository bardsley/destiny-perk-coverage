<template>
    <div id="perk-graph">
        <h1>Your perk graph</h1>
        <p><span id="status">{{status}}</span> Weapons {{ weapons.length }}, Sockets {{ Object.keys(sockets).length }}</p>
        

        <table>
            
            <thead>
                <tr><td colspan="18" class="backing"><div></div></td></tr>
                <tr>
                    <td></td>
                    <th class="rotate" v-for="weapon_type in weapon_types" :key="weapon_type">
                        <div><span>{{ weapon_type }} </span></div>
                    </th><th class="rotate"><div><span>Total</span></div></th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(perkDetails,perkName,index) in perkGrid" > 
                    <tr :key="perkName">
                        <th @click="toggleDetails(`perk-details-${index}`)">{{ perkName }}</th>
                        <td v-for="weapon_type in weapon_types" :key="perkName+'_'+weapon_type">
                            <div v-if="perkDetails[weapon_type]" class="totals">
                                <span class="any">{{ perkDetails[weapon_type].total }} </span>
                                <span :class="perkDetails[weapon_type].locked > 0 ? ['locked'] : ['locked','empty'] ">{{ perkDetails[weapon_type].locked }}</span>
                                <span :class="['unlocked'] + ( perkDetails[weapon_type].unlocked == 0 ? [' empty'] : [' ']) + ( perkDetails[weapon_type].unlocked == perkDetails[weapon_type].total ? [' total'] : [''] )">
                                    {{ perkDetails[weapon_type].unlocked }}
                                </span>

                            </div>
                        </td>
                        <td>{{perkDetails.total}}</td>
                    </tr>
                    <tr :key="perkName+'-details'" :id="`perk-details-${index}`" class="details hidden">
                        <td colspan="18">
                            <pre>{{ perkDetails }}</pre>
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
            weapon_types: [],
            status: ''
        }
    },
    async created() {
        this.status = "Loading Categories"
        this.categories = await setUpCategories()
        this.status = "Loading Plugsets"
        this.plugsets = await setupPlugsets()
        this.status = "Downloading your character(s)"
        this.characters = await getCharacters(this.membershipType,this.membershipId)
        let characterIds = Object.keys(this.characters)
        this.status = "Downloading equipped and carried gear"
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
        this.status = "Downloading your vault"
        let vaultContents = await getVault(this.membershipType,this.membershipId )     
        Object.assign(this.sockets,vaultContents.sockets)
        Object.assign(this.perks,vaultContents.perks)

        this.status = "Assessing combined stash"
        let downloadedEquipment = await this.addItemDefinitions(vaultContents.items)
        this.status = "Filtering all non-weapon items"
        let weapons = this.filterWeapons(downloadedEquipment)
        console.log("Adding ",weapons.length, " weapons")
        this.weapons = this.weapons.concat(weapons)
        
        // Add definitions to all perks?
        console.log("Perks size",Object.keys(this.perks).length)
        
        // Build the grid

        // perkName -> WeaponType -> { locked: X , unlocked: X }
        this.status = "Categorising all available perks"

        this.weapons.forEach(async (instance) => {
            let weapon = instance.item
            let category = weapon.itemTypeDisplayName ? weapon.itemTypeDisplayName : false
            if(category) {
                if(!this.weapon_types.includes(category)) { this.weapon_types.push(category) }

                let perks = this.perks[instance.itemInstanceId].perks
                await perks.forEach(async (perkId) => {
                    let perk = await getPerkDefinition(perkId.perkHash)
                    if(perk.isDisplayable) { 
                        // console.log("Perkdef:",perk)
                        let perkName = perk.displayProperties.name
                        // Setup grid space for this perk and weapontype combo
                        if(!this.perkGrid[perkName]) { this.$set(this.perkGrid,perkName,{ details: perk, total: 0 }) }
                        if(!this.perkGrid[perkName][weapon.itemTypeDisplayName]) { 
                            this.$set(this.perkGrid[perkName],weapon.itemTypeDisplayName,{ locked: 0 , unlocked: 0 , total: 0 }) 
                        }
                        // Is it locked ?
                        let key = instance.state & 1 ? 'locked' : 'unlocked'
                        this.perkGrid[perkName][weapon.itemTypeDisplayName][key] = this.perkGrid[perkName][weapon.itemTypeDisplayName][key] + 1
                        this.perkGrid[perkName][weapon.itemTypeDisplayName]['total'] = this.perkGrid[perkName][weapon.itemTypeDisplayName]['total'] + 1
                        this.perkGrid[perkName].total += 1
                    }
                })
            }
        })
        this.status = "Done "


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
        toggleDetails(htmlId) { 
            let htmlNode = document.getElementById(htmlId)
            if(htmlNode.classList.contains('hidden')) { htmlNode.classList.remove('hidden') } else { htmlNode.classList.add('hidden') }
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
#perk-graph {
    h1 { margin-bottom:0; }
    p { margin:0;}
    table { border-collapse: collapse; 
        padding-right: 50px; margin-top: -3em; 
        margin-right: 50px;
        position:relative;
        // overflow: hidden;
    }
    tbody th { 
        text-align: left; 
    }
    thead th {
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        top:0;
        z-index: 1;
    }
    td.backing {
        position: sticky;
        width: 100%;
        top: 0;
    }
    td.backing div { 
        background-image: linear-gradient( to top , rgba(0,0,0,0) , var(--background) 10%);
        width: 100%;
        position: absolute;
        height: 90px;
        z-index: 900;
        top: 50px;
    }

    th.rotate {
        /* Something you can count on */
        height: 140px;
        white-space: nowrap;
        width: 3em;
        > div {
            transform: 
            /* Magic Numbers */
            translate(34px, 47px)
            /* 45 is really 360 - 45 */
            rotate(315deg);
            // rotate(0deg);
            width: 30px;

            > span {
                border-bottom: 1px solid #ccc;
                // background: var(--dark-background);
                padding: 5px 10px;
            }
        }
    }
    tbody th { padding: 0 10px; }
    tbody td { text-align:center; border-spacing:0; padding:0; }
    tbody td pre { text-align: left; max-width:100%; overflow: hidden; white-space: pre-wrap; }
    tbody>tr>* { border: 1px solid #ccc; }
    .hidden { display:none; }

    .totals { 
        display:flex;
        flex-wrap: wrap;
        color: #fff;
        span { display: block; }
        .any { width: 100%; background: var(--dark-background); min-width: 3em;}
        .locked, .unlocked { width: 50%; padding: 0 0.5em; }
        .locked { background: var(--locked-background); }
        .locked.empty { background: var(--locked-empty); }
        .unlocked { background: var(--unlocked-background); }
        .unlocked.empty { background: var(--unlocked-empty);}
        .unlocked.total { background: var(--unlocked-total);}
    }
}
</style>