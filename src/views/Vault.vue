<template>
    <div class="weapons">
        <h1>{{ number_weapons }} Weapons</h1>
        <div v-for="(item,index) in debug" :key="item.hash+'-'+index" class="item">
            <h2>{{ item.item.displayProperties.name }}</h2>
            <!-- <img src="item.item.displayProperties" alt=""> -->
            <p>{{ item.item.displayProperties.description }}</p>
            <div class="icons">
                <img v-if="item.item.displayProperties.hasIcon" :src="`${bungie_url}${item.item.displayProperties.icon}`" alt="">
                <img v-for="(icon_path,index) in item.perk_icons" :src="icon_path" :key="index"/>
            </div>
            
        </div>
    </div>
</template>

<script>
import { getVault } from "@/api/getCharacters";
import { getItemDefinition } from "@/api/manifest";
export default {
    props: ['membershipType','membershipId',],
    data() {
        return {
            debug: null,
            bungie_url: 'https://www.bungie.net',
            number_weapons: 0,
        }
    },
    async created() {

        console.debug("Load the experiment")
        // Get Vault instances
        let vaultContents = await getVault(this.membershipType,this.membershipId )       

        // Get item definitions and merge instance TODO dont get same item multiple times
        let downloadedEquipment = await Promise.all(
            vaultContents.items.map(async (itemInstance) => {
                let item = await getItemDefinition(itemInstance.itemHash)
                item.instance = itemInstance
                return item
            })
        )
        console.log("Merged Equipment: ", downloadedEquipment)

        // Filter so we only have weapons
        let weapons = downloadedEquipment.filter( (item) => {
            return item.itemCategoryHashes && item.itemCategoryHashes.includes(1)
            // let categories = item.itemCategoryHashes ? (item.itemCategoryHashes.map((hashId) => { return { name: this.categories[hashId].displayProperties.name, hash: hashId } }) ) : []
            // console.log(item.displayProperties.name, categories)
        })
        this.number_weapons = weapons.length

        console.log("Filter to weapons: ", weapons)


        // Split weapons into those with and without perks set
        let status = weapons.reduce((perkable,item) => {
            // console.log("Checking for perk: ", item.itemInstanceId, vaultContents.perks[item.itemInstanceId] ,item)
            //     return !vaultContents.perks[item.itemInstanceId]
            if(vaultContents.perks[item.instance.itemInstanceId]) { // Cant find it in perks
                perkable.yep.push(item)
            } else {
                perkable.nope.push(item)
            }
            return perkable
        },{ yep: [], nope: [] });
        this.number_weapons = `${weapons.length} ( ${status.yep.length} / ${status.nope.length} )`
        this.debug = status.yep.map((item) => { 
            let perk_icons = vaultContents.perks[item.instance.itemInstanceId].perks.map((perk) => { return `${this.bungie_url}${perk.iconPath}` }).filter((iconPath) => iconPath != this.bungie_url )
            return { hash: item.instance.itemHash, perk_icons: perk_icons, item: item }
        })
       
    },
    methods: {

    }
}
</script>

<style lang="scss">
    .weapons {
        display:flex; flex-wrap: wrap;
        h1 { width: 100%; padding: 0.3em; margin:0;}
        .item {
            width: calc( 25% - 1em ); max-width: 250px; min-width: 14.5em/*183px*/;
            border-radius: 0.5em; margin: 0.5em;
            background: var(--gentle-backing);    
            padding:0.5em 0.5em 4.2em; position:relative;
            font-size: 0.8em;
            h2,p { margin:0;}

            .icons { 
                position: absolute; bottom:0.5em; width: calc(100% - 1em);
                background: #333;
                border-radius: 7px;
                padding: 0.4em 0.3em 0.15em 0.4em;
                img { 
                    max-width: 1.8em; border-radius: 3px; margin-right: 0.35em;
                    border: solid 1px rgba(255, 136, 0, 0.2);
                }
                img:last-of-type {
                    margin-right:0;
                }
            }
        }
    }
    
</style>