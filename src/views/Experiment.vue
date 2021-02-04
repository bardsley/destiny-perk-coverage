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
            wishes: {},
            rows: [],
        }
    },
    async created() {
        console.debug("Load the experiment")
        this.wishes = await processWishlist()
        console.log('Wishlist Size:', Object.keys(this.wishes).length)
    },
    methods: {

    }
}
</script>

<style lang="scss">
   table, table * { border-collapse: collapse; border: 1px solid #ccc;}
   td { padding: 0.2em 0.5em; text-align:right; }
</style>