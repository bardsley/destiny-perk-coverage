<template>
    <div class="debug">
        6917529212086378442
        <pre>
        {{ instances.length }}
        {{ 
            instances.
            filter((i) => { return !i.item.traitIds || i.item.traitIds.includes("item_type.weapon") }).
            map(( i ) => { return { name: i.item.displayProperties.name, type: i.item.traitIds, itemhash: i.item.hash } } ) 
        }}
        {{ instances }}
       </pre>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { getVault , getCharacterItems} from "@/api/getCharacters";
import { getItemDefinition } from "@/api/manifest";


export default {
    props: ['membershipType','membershipId','characterId'],
    data() {
        return {
            instances: [],
            rows: [],
        }
    },
    async created() {
        // let rawInstances = await getVault(this.membershipType,this.membershipId ) 
        let rawInstances = await getCharacterItems(this.membershipType,this.membershipId,this.characterId)
        let characterInstances = []
        characterInstances = characterInstances.concat(rawInstances.equipment)
        characterInstances = characterInstances.concat(rawInstances.inventory)
        let detailedInstances = await this.addItemDefinitions(characterInstances)
        this.instances = detailedInstances
    },
    methods: {
        async addItemDefinitions(instances) {
            console.log('Adding defs to ',instances.length)
            return await Promise.all(
                instances.map(async (instance) => {
                    let itemDef = await getItemDefinition(instance.itemHash)
                    Object.assign(instance, { item:itemDef })
                    return instance
                })
            )
        },
    }
}
</script>

<style lang="scss">
   table, table * { border-collapse: collapse; border: 1px solid #ccc;}
   td { padding: 0.2em 0.5em; text-align:right; }
</style>