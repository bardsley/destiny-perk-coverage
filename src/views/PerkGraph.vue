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
                <template v-for="(perk,index) in Object.keys(perkGrid).sort().map((key) => { return Object.assign(perkGrid[key],{ key: key}) })">
                    <tr :key="perk.key">
                        <th @click="toggleDetails(`perk-details-${index}`)" >
                            <div>
                                <img v-if="perk.details.displayProperties.hasIcon" :src="`https://www.bungie.net${perk.details.displayProperties.icon}`" alt="" @mouseover="showTooltip" @mouseleave="hideTooltip">
                                <div>
                                    {{ perk.key }} 
                                    <span class="additional">{{ perk.details.itemTypeDisplayName }}</span>
                                    <span class="hover hidden" v-html="perk.details.displayProperties.description.replaceAll('\n','<br/>')"></span>
                                </div>
                            </div>
                        </th>
                        <td v-for="weapon_type in weapon_types" :key="perk.key+'_'+weapon_type">
                            <div v-if="perk[weapon_type]" class="totals">
                                <span class="any">
                                    <span class="pve">{{perk[weapon_type].total.pve}}</span>
                                    <span class="pvp">{{perk[weapon_type].total.pvp}}</span>
                                    <span class="god">{{perk[weapon_type].total.god}}</span>
                                    <span class="junk">{{perk[weapon_type].total.junk}}</span>
                                </span>
                                <span :class="nodeValuable(perk[weapon_type].locked) > 0 ? ['locked'] : ['locked','empty'] ">
                                    {{ nodeTotal(perk[weapon_type].locked) }}</span>
                                <span :class="['unlocked'] + ( nodeTotal(perk[weapon_type].unlocked) == nodeTotal(perk[weapon_type].total) ? [' '] : [' empty']) + ( nodeValuable(perk[weapon_type].unlocked) > 0  ? [' total'] : [''] )">
                                    {{ nodeTotal(perk[weapon_type].unlocked) }}
                                </span>

                            </div>
                        </td>
                        <td>{{perk.total}}</td>
                    </tr>
                    <tr :key="perk.key+'-details'" :id="`perk-details-${index}`" class="details hidden">
                        <td colspan="18">
                            <pre>{{ perk.details }}</pre>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>

import { setUpCategories , setupPlugsets , getItemDefinition , /* getPerkDefinition */ } from "@/api/manifest";
import { getCharacters, getCharacterItems , getVault } from "@/api/getCharacters";
import { processWishlist } from "@/api/wishlist";

export default {
    props: ['membershipType','membershipId',],
    data() {
        return {
            categories: {},
            plugsets: {},
            characters: {},
            sockets:{},
            perks: {},
            plugs: {},
            wishes: {},
            perkGrid: {},
            weapons: [],
            weapon_types: [],
            status: ''
        }
    },
    async created() {
        let ignorableTypes = ['Restore Defaults','Weapon Mod','Shader','','Intrinsic','Weapon Ornament']
        this.status = "Loading Categories"
        this.categories = await setUpCategories()
        this.status = "Loading Plugsets"
        this.plugsets = await setupPlugsets()
        this.status = "Loading Wishlist"
        this.wishes = await processWishlist()
        this.status = "Downloading your character(s)"
        this.characters = await getCharacters(this.membershipType,this.membershipId)
        let characterIds = Object.keys(this.characters)
        this.status = "Downloading equipped and carried gear"
        characterIds.forEach( async (characterId) => {
            let characterItems = await getCharacterItems(this.membershipType,this.membershipId,characterId)
            Object.assign(this.sockets,characterItems.sockets)
            Object.assign(this.plugs,characterItems.plugs)
            Object.assign(this.perks,characterItems.perks)

            let characterEquipment = []
            characterEquipment = characterEquipment.concat(characterItems.equipment)
            characterEquipment = characterEquipment.concat(characterItems.inventory)
            

            let downloadedEquipment = await this.addItemDefinitions(characterEquipment)
            let weapons = this.filterWeapons(downloadedEquipment)
            console.log("Adding ",weapons.length, " weapons")
            this.weapons = this.weapons.concat(weapons)
            
        })        
        this.status = "Downloading your vault"
        let vaultContents = await getVault(this.membershipType,this.membershipId )     
        Object.assign(this.sockets,vaultContents.sockets)
        Object.assign(this.perks,vaultContents.perks)
        Object.assign(this.plugs,vaultContents.plugs)

        this.status = "Assessing combined stash"
        let downloadedEquipment = await this.addItemDefinitions(vaultContents.items)
        this.status = "Filtering all non-weapon items"
        let weapons = this.filterWeapons(downloadedEquipment)
        console.log("Adding ",weapons.length, " weapons")
        this.weapons = this.weapons.concat(weapons)
        
        console.log("Weapon Instance keys ",this.weapons.map((row)=>{ return row.itemInstanceId }))
        // Add definitions to all perks?
        console.log("Perks size",Object.keys(this.perks).length)
        
        // Build the grid

        // perkName -> WeaponType -> { locked: X , unlocked: X }
        this.status = "Categorising all available perks"
        await Promise.all(this.weapons.map(async (instance) => { 
        // this.weapons.forEach(async (instance) => {
            let weapon = instance.item
            // let weaponName = weapon.displayProperties.name
            // console.log(`Weapon: ${weapon.displayProperties.name}`,weapon)
            let category = weapon.itemTypeDisplayName ? weapon.itemTypeDisplayName : false
            if(category && weapon.summaryItemHash != 2673424576) { // only process non exotics
                if(!this.weapon_types.includes(category)) { this.weapon_types.push(category) }

                let weaponHighlight = 'Arctic Haze' 
                if(instance.item.displayProperties.name == weaponHighlight) { 
                    console.warn('I have found a ' + weaponHighlight + "("+instance.itemInstanceId+")")
                    console.log(this.sockets[instance.itemInstanceId])
                    console.log(this.plugs[instance.itemInstanceId])  
                }
                // let sockets = this.sockets[instance.itemInstanceId].sockets
                let sockets = [] 
                if(this.plugs[instance.itemInstanceId]) {
                    sockets = Object.values(this.plugs[instance.itemInstanceId].plugs).flat()
                } else { 
                    console.log("No plugs for instID:", instance.itemInstanceId," a ", weapon.displayProperties.name)
                }
                
                await Promise.all(sockets.map( async (socket) => {
                // await sockets.forEach(async (socket) => {
                    // let perk = await getItemDefinition(socket.plugHash) // TODO this just gets the current plugged item I think https://bungie-net.github.io/#/components/schemas/Destiny.DestinyComponentType
                    let perk = await getItemDefinition(socket.plugItemHash) // TODO this just gets the current plugged item I think https://bungie-net.github.io/#/components/schemas/Destiny.DestinyComponentType
                    if(perk && perk.displayProperties && !ignorableTypes.includes(perk.itemTypeDisplayName)) { 
                        let perkName = perk.displayProperties.name

                        // Setup grid space for this perk and weapontype combo
                        if(!this.perkGrid[perkName]) { this.$set(this.perkGrid,perkName,{ details: perk, total: 0 }) }
                        if(!this.perkGrid[perkName][weapon.itemTypeDisplayName]) { 
                            this.$set(this.perkGrid[perkName],category, { 
                                locked: { pvp: 0, pve: 0, god: 0, junk: 0 }  , 
                                unlocked: { pvp: 0, pve: 0, god: 0, junk: 0 }  , 
                                total: { pvp: 0, pve: 0, god: 0, junk: 0 } 
                            }) 
                        }

                        let perkGraphSlot = this.perkGrid[perkName][weapon.itemTypeDisplayName]
                        let key = instance.state & 1 ? 'locked' : 'unlocked'
                        let rollType = 'n/a'
                        let weaponPerks = this.wishes[weapon.hash] 
                        if(!weaponPerks) { rollType = 'junk'}
                        else { 
                            let perkHash = perk.hash.toString()
                            if(weaponPerks.flattened.pvp.includes(perkHash)) { rollType = 'pvp' }
                            if(weaponPerks.flattened.pve.includes(perkHash)) { rollType = 'pve' }
                            if(weaponPerks.flattened.god.includes(perkHash)) { rollType = 'god' }
                            if(rollType == 'n/a') { rollType = 'junk' }
                        } 
                        perkGraphSlot[key][rollType] = perkGraphSlot[key][rollType] + 1
                        perkGraphSlot['total'][rollType] = perkGraphSlot['total'][rollType] + 1
                        this.perkGrid[perkName].total += 1
                    }
                }))
            } else {
                console.debug("Ignoring ",weapon.displayProperties.name)
            }
        }))
        this.status = "Done "
        this.weapon_types = this.weapon_types.sort()


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
        nodeTotal(graphNode) { 
            return graphNode.pve + graphNode.pvp + graphNode.god + graphNode.junk
        },
        nodeValuable(graphNode) { 
            return graphNode.pve + graphNode.pvp + graphNode.god
        },
        showTooltip(event) { if(event.target.getElementsByClassName('hover')) { event.target.getElementsByClassName('hover')[0].classList.remove('hidden'); }},
        hideTooltip(event) { if(event.target.getElementsByClassName('hover')) { event.target.getElementsByClassName('hover')[0].classList.add('hidden'); }},
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
        max-width:10%;
        >div {
            text-align: left; 
            display: flex;
            position:relative;
            img { max-width: 38px; max-height: 38px; margin-right: 0.2em; }
            .hover { 
                position:absolute; top:2em; left: 5em; width: 35em; z-index: 10000; padding: 1em;
                background: rgba(255,255,255,0.9); border-radius: 0 15px 15px 15px;

            }
        }
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
    tbody th { 
        padding: 0 10px; 
        .additional {
            font-size:0.7em;
            display:block;
        }
    }
    tbody td { text-align:center; border-spacing:0; padding:0; }
    tbody td pre { text-align: left; max-width:100%; overflow: hidden; white-space: pre-wrap; }
    tbody>tr>* { border: 1px solid #ccc; }
    .hidden { display:none; }

    .totals { 
        display:flex;
        flex-wrap: wrap;
        color: #fff;
        font-weight:bold; 
        >span { 
            display: block; 
            span { padding: 0 0.1em;}
            .pve { color: var(--pve);}
            .pvp { color: var(--pvp);}
            .god { color: var(--god);}
            .junk { color: var(--junk);}
        }
        .any { width: 100%; background: var(--dark-background); min-width: 2em; padding: 0.1em 0.2em; font-size: 1.1em; }
        .locked, .unlocked { width: 50%; padding: 0; }
        .locked { background: var(--locked-background); }
        .locked.empty { background: var(--locked-empty); font-weight: normal; }
        .unlocked { background: var(--unlocked-background); }
        .unlocked.empty { background: var(--unlocked-empty); font-weight: normal; }
        .unlocked.total { background: var(--unlocked-total); font-weight: normal; }
    }
}
</style>