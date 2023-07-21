<template>
  <v-container class="w-75">
    <v-card flat class="w-100">
      <v-card-title>軟體介紹頁面</v-card-title>
      <v-card-subtitle>這邊會簡單的介紹軟體的使用</v-card-subtitle>
    </v-card>
    
    <p class="ma-2">
      在工作區建立工作區, 工作區的用意是 多個專案管理群組化, 接著在表格輸入工作區的名稱與敘述即可.
    </p>
    <v-img src="image/workspace.jpg" />
    <p class="ma-2">
      有了工作區後就可以加入專案, 但是在加入專案之前, 先選擇剛才加入的工作區, 接著選擇專案用資料夾.
    </p>
    <v-img src="image/project.jpg" />
    <p class="ma-2">
      選擇專案後會跳來專案頁面, 這時候就可以加入專案會使用的模組.
    </p>
    <v-img src="image/module.jpg" />
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VHomepage'
})
</script>
