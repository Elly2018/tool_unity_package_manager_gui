<template>
  <v-app>
      <NavBar @page="(i) => page = i">
        <Homepage v-if="page == 0"/>
      </NavBar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/NavBar.vue'
import Homepage from './components/Homepage.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    Homepage,
  },
  data(){
    return {
      page: 0
    }
  }
})
</script>
