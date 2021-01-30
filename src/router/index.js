import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/auth/bungie/callback',
    name: 'BungieAuthCallback',
    props: route => ({ authCode: route.query.code }),
    component: () => import(/* webpackChunkName: "auth" */ '../components/Auth.vue')
  },
  {
    path: '/auth/bungie',
    name: 'BungieAuth',
    component: () => import(/* webpackChunkName: "auth" */ '../components/Auth.vue')
  },
  {
    path: '/character',
    name: 'CharacterSelect',
    component: () => import(/* webpackChunkName: "character" */ '../views/CharacterSelect.vue')
  },
  {
    path: '/character/:characterId',
    name: 'Character',
    props: route => ( { characterId: route.params.characterId } ),
    component: () => import(/* webpackChunkName: "character" */ '../views/CharacterSelect.vue')
  },
  {
    path: '/onboard',
    name: 'Onboard',
    props: route => ( { characterId: route.params.characterId } ),
    component: () => import(/* webpackChunkName: "character" */ '../views/Onboard.vue')
  },
  {
    path: '/perks',
    name: 'PerkSelect',
    component: () => import(/* webpackChunkName: "perks" */ '../views/Perks.vue')
  },
  {
    path: '/perks/:membershipType/:membershipId/:characterId',
    name: 'PerkListing',
    props: route => ( { membershipType: route.params.membershipType, membershipId: route.params.membershipId, characterId: route.params.characterId } ),
    component: () => import(/* webpackChunkName: "perks" */ '../views/Perks.vue')
  },
  {
    path: '/perks/:membershipType/:membershipId',
    name: 'PerkGraph',
    props: route => ( { membershipType: route.params.membershipType, membershipId: route.params.membershipId, } ),
    component: () => import(/* webpackChunkName: "perks" */ '../views/PerkGraph.vue')
  },
  {
    path: '/experiment/:membershipType/:membershipId/:characterId',
    name: 'Experiment',
    props: route => ( { membershipType: route.params.membershipType, membershipId: route.params.membershipId, characterId: route.params.characterId } ),
    component: () => import(/* webpackChunkName: "experiement" */ '../views/Experiment.vue')
  },
  {
    path: '/vault/:membershipType/:membershipId', name: 'Vault',
    props: route => ( { membershipType: route.params.membershipType, membershipId: route.params.membershipId } ),
    component: () => import(/* webpackChunkName: "vault" */ '../views/Vault.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
