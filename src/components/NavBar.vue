<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="bg-deep-purple"
        theme="dark"
        permanent
      >
        <v-list color="transparent">
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" @click="Page(0)"></v-list-item>
          <v-list-item prepend-icon="mdi-account-box" title="Account" @click="Page(1)"></v-list-item>
          <v-list-item prepend-icon="mdi-gavel" title="Admin" @click="Page(2)"></v-list-item>
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