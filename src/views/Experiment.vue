<template>
    <div class="debug">
        <table>
            <template v-for="(weapon,index) in debug">
            <tr v-for="(roll,newIndex) in weapon.rolls" class="weapons" :key="`${index}-${newIndex}`">
                <th>{{ weapon.name }}</th>
                <td v-for="perkHash in roll" :key="`${weapon.name}-${perkHash}`">{{ perkHash }}</td>
            </tr>    
            </template>
        </table>
             
        <!-- <pre>{{ debug}}</pre> -->
    </div>
</template>

<script>
import { downloadWishlist } from "@/api/wishlist";
import { getItemDefinition } from "@/api/manifest";

export default {
    props: ['membershipType','membershipId','characterId'],
    data() {
        return {
            debug: [],
            bungie_url: 'https://www.bungie.net',
            number_weapons: 0,
        }
    },
    async created() {

        console.debug("Load the experiment")
        let wishes = await downloadWishlist()
        console.log('Wishlist Size:', Object.keys(wishes).length)
        console.log(wishes)
        let keys = Object.keys(wishes)
        keys.slice(0,5).forEach(async (key) => { 
            let item = await getItemDefinition(key)
            this.debug.push({name: item.displayProperties.name, rolls: wishes[key]})
        })
        // this.debug = wishes

       
    },
    methods: {

    }
}
</script>

<style lang="scss">
   table, table * { border-collapse: collapse; border: 1px solid #ccc;}
   td { padding: 0.2em 0.5em; text-align:right; }
</style>