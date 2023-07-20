<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="bg-deep-purple"
        theme="dark"
        permanent
      >
        <v-list color="transparent">
          <v-list-item prepend-icon="mdi-home" title="Homepage" @click="Page(0)"></v-list-item>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" @click="Page(1)"></v-list-item>
          <v-list-item prepend-icon="mdi-view-carousel" title="Workspace" @click="Page(2)"></v-list-item>
          <v-list-item prepend-icon="mdi-code-tags" title="Project" @click="Page(3)"></v-list-item>
          <v-list-item prepend-icon="mdi-note" title="Preset" @click="Page(4)"></v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="Setting" @click="Page(5)"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block>
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main style="height: 100vh">
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar',
  methods:{
    Page(index:number){
        this.$emit("page", index);
    }
  },
})
</script>