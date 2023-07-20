<template>
  <v-app>
      <NavBar @page="(i) => page = i">
        <Homepage v-if="page == 0"/>
        <Dashboard v-else-if="page == 1"/>
        <Workspace v-else-if="page == 2"/>
        <Project v-else-if="page == 3"/>
        <Preset v-else-if="page == 4"/>
        <Setting v-else-if="page == 5"/>
      </NavBar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/NavBar.vue'
import Dashboard from './components/Dashboard.vue'
import Homepage from './components/Homepage.vue'
import Workspace from './components/Workspace.vue'
import Project from './components/Project.vue'
import Preset from './components/Preset.vue'
import Setting from './components/Setting.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    Dashboard,
    Homepage,
    Workspace,
    Project,
    Preset,
    Setting
  },
  data(){
    return {
      page: 0
    }
  }
})
</script>
