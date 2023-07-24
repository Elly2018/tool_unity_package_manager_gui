<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="surface"
        theme="dark"
        permanent
      >
        <v-list color="transparent">
          <v-list-item prepend-icon="mdi-home" title="首頁" @click="Page(0)" :disabled="page == 0"></v-list-item>
          <!---
            <v-list-item prepend-icon="mdi-view-dashboard" title="預覽" @click="Page(1)" :disabled="page == 1"></v-list-item>
          -->
          <v-list-item prepend-icon="mdi-view-carousel" title="工作區" @click="Page(2)" :disabled="page == 2"></v-list-item>
          <v-list-item prepend-icon="mdi-code-tags" title="專案" @click="Page(3)" :disabled="page == 3"></v-list-item>
          <v-list-item prepend-icon="mdi-note" title="預定義" @click="Page(4)" :disabled="page == 4"></v-list-item>
          <v-list-item prepend-icon="mdi-cog" title="設定" @click="Page(5)" :disabled="page == 5"></v-list-item>
        </v-list>

        <template v-slot:append>
        </template>
      </v-navigation-drawer>
      <v-main style="height: 100vh" class="overflow-y-auto">
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NavBar',
  props:{
    page: Number
  },
  methods:{
    Page(index:number){
        this.$emit("page", index);
    }
  },
})
</script>