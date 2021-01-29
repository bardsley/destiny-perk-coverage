<template>
    <div>
        {{ characterId }} has {{ Object.keys(perkGrid).length }} perk types

        <table>
            <thead><td></td>
                <th class="rotate" v-for="weapon_type in weapon_types" :key="weapon_type">
                    <div><span>{{ weapon_type }} </span></div>
                </th><td></td>
            </thead>
            <tbody>
                <tr v-for="(perk,key) in perkGrid" :key="key"> 
                    <th>{{ key }} <span>{{perk.details}}</span></th>
                    <td v-for="weapon_type in weapon_types" :key="key+'_'+weapon_type">{{ perk[weapon_type] }} </td>
                    <td>{{perk.total}}</td>
                </tr>
            </tbody>
        </table>
        <!-- <pre>
            {{ perkGrid }}
        </pre>
        <pre>{{ items }} </pre>
        <pre>
            {{categories}}
        </pre> -->

    </div>
</template>

<script>

import { setUpCategories , setupPlugsets , getItemDefinition , getItemInstanceViaCache , getPerkDefinition } from "@/api/manifest";
import { getCharacterItems, getVault } from "@/api/getCharacters";
// import { getCharacterItems } from "@/api/getCharacters";
export default {
    props: ['membershipType','membershipId','characterId'],
    data() {
        return {
            categories: {},
            plugsets: {},
            items: {},
            perkGrid: {},
            weapon_types: []
        }
    },
    async created() {
        this.categories = await setUpCategories()
        this.plugsets = await setupPlugsets()

        let characterItems = await getCharacterItems(this.membershipType,this.membershipId,this.characterId)
        let tempEquipped = characterItems.equipment.data.items
        let tempOnCharacter = characterItems.inventory.data.items
        let tempVaultContents = await getVault(this.membershipType,this.membershipId )       
        let tempEquipment = Object.assign(tempEquipped,tempOnCharacter)
        let totalEquipment = Object.assign(tempEquipment, tempVaultContents)
        // let totalEquipment = tempEquipment // saFER LOAD
        let downloadedEquipment = await Promise.all(
            totalEquipment.map(async (item) => {
            let itemDef = await getItemDefinition(item.itemHash)
            return Object.assign(itemDef,item)
            })
        )
        // console.log("Items found",downloadedEquipment.length)
        let weapons = downloadedEquipment.filter( (item) => {
            return item.itemCategoryHashes && item.itemCategoryHashes.includes(1)
            // let categories = item.itemCategoryHashes ? (item.itemCategoryHashes.map((hashId) => { return { name: this.categories[hashId].displayProperties.name, hash: hashId } }) ) : []
            // console.log(item.displayProperties.name, categories)
        })
        console.log(weapons)
        weapons.forEach(async (weapon) => {
            // console.log(weapon.displayProperties.name, weapon.itemTypeDisplayName)
            // Is there an entry in perks for the type?
            // if(!this.perkGrid[weapon.itemTypeDisplayName]) { this.$set(this.perkGrid,weapon.itemTypeDisplayName,{}) }
            if(!this.weapon_types.includes(weapon.itemTypeDisplayName)) { this.weapon_types.push(weapon.itemTypeDisplayName)}
            let weaponInstance  = await getItemInstanceViaCache(this.membershipType,this.membershipId,weapon.itemInstanceId)
            // let modSockets = weapon.sockets.socketEntries.filter((entry)=>{ return [2].includes(entry.plugSources) })
            // console.log("Weapon Instance:",weaponInstance)
            weaponInstance.perks.data.perks.forEach(async (perkId) => {
                
                let perk = await getPerkDefinition(perkId.perkHash)
                if(perk.isDisplayable) { 
                    let perkName = perk.displayProperties.name
                    // make sure we have a perk row
                    if(!this.perkGrid[perkName]) { this.$set(this.perkGrid,perkName,{ details: perk, total: 0 }) }
                    if(!this.perkGrid[perkName][weapon.itemTypeDisplayName]) { this.$set(this.perkGrid[perkName],weapon.itemTypeDisplayName,0) }
                    this.perkGrid[perkName][weapon.itemTypeDisplayName] = this.perkGrid[perkName][weapon.itemTypeDisplayName] + 1
                    this.perkGrid[perkName].total += 1
            //         // console.log(perkId.perkHash, perk.displayProperties.name, perk )
                    // console.log(perkName)
                }
                
            })
            // this.perkGrid[weapon.itemTypeDisplayName].push(modSockets)
            
        })
        // this.items  = downloadedEquipment
        
    },
    methods: {
        async getPerksetsOfEquipped(character) {
            console.log(character)
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
tbody>tr>* { border: 1px solid #ccc; }
</style>