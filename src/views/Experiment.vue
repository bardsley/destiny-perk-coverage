<template>
    <div class="debug">
        <pre>
            {{ wishes }}
        </pre>

        <table>
            <template v-for="(weapon,index) in wishes">
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
import { processWishlist } from "@/api/wishlist";
// import { getItemDefinition } from "@/api/manifest";

export default {
    props: ['membershipType','membershipId','characterId'],
    data() {
        return {
            wishes: [],
            rows: [],
        }
    },
    async created() {
        // let currentMode = 'none'
        console.debug("Load the experiment")
        // this.rows = await downloadWishlist()
        this.wishes = await processWishlist()
        // this.rows = this.rows.filter((row) => {
        //     return row.field && row.field.data
        // }).map((row,index) => { 
        //     let pve = new RegExp(/pve/i)
        //     let pvp = new RegExp(/pvp/i)
        //     if(row.field.data.search(pve) >= 0) { console.log("pve mode switch @ ", index); currentMode = 'PVE' } 
        //     if(row.field.data.search(pvp) >= 0) { console.log("pvp mode switch @ ", index); currentMode = 'PVP' } 
        //     // console.log('--')
        //     // let returnObject = Object.assign(Object.assign({ index: index, mode: currentMode } , row ) , { nextRow: this.rows[index+1]})
        //     let returnObject = Object.assign({ index: index, mode: currentMode } , row )
        //     return returnObject 
        // }).filter( row => row.field.name == 'dimwishlist')
        console.log('Wishlist Size:', Object.keys(this.wishes).length)
        // let keys = Object.keys(this.wishes)
        // keys.slice(0,5).forEach(async (key) => { 
            
        //     let item = await getItemDefinition(key)
        //     this.debug.push({name: item.displayProperties.name, rolls: this.wishes[key]})
        // })
    },
    methods: {

    }
}
</script>

<style lang="scss">
   table, table * { border-collapse: collapse; border: 1px solid #ccc;}
   td { padding: 0.2em 0.5em; text-align:right; }
</style>