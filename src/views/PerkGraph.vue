<template>
    <div id="perk-graph">
        <h1>Your perk graph</h1>
        <p>Items {{ items.length }}</p>
        <p>Sockets {{ Object.keys(sockets).length }}</p>
    </div>
</template>

<script>

import { setUpCategories , setupPlugsets , getItemDefinition  } from "@/api/manifest";
import { getCharacters, getCharacterItems , getVault } from "@/api/getCharacters";

export default {
    props: ['membershipType','membershipId',],
    data() {
        return {
            categories: {},
            plugsets: {},
            characters: {},
            items: [],
            sockets:{},
            perkGrid: {},
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
            let characterEquipment = []
            Object.assign(characterEquipment,characterItems.equipment)
            Object.assign(characterEquipment,characterItems.inventory)
            let downloadedEquipment = await this.addItemDefinitions(characterEquipment)
            let weapons = this.filterWeapons(downloadedEquipment)
            console.log("Adding ",weapons.length, " weapons")
            this.items = this.items.concat(weapons)
            
        })        
        let vaultContents = await getVault(this.membershipType,this.membershipId )     
        let downloadedEquipment = await this.addItemDefinitions(vaultContents.items)
        let weapons = this.filterWeapons(downloadedEquipment)
        console.log("Adding ",weapons.length, " weapons")
        this.items = this.items.concat(weapons)
        Object.assign(this.sockets,vaultContents.sockets)

    },
    methods: {
        filterWeapons(items) {
            return items.filter( (instance) => {
                return instance.item.itemCategoryHashes && instance.item.itemCategoryHashes.includes(1)
            })
        },
        async addItemDefinitions(instances) {
            return await Promise.all(
                instances.map(async (item) => {
                    let itemDef = await getItemDefinition(item.itemHash)
                    Object.assign(item, { item:itemDef })
                    return item
                })
            )
        }
    }
}
</script>