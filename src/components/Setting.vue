<template>
    <v-container>
      <v-card v-if="s_input != undefined" flat class="w-100">
        <v-card-title>偏好設定</v-card-title>
        <v-card-subtitle>影響軟體的運作行為</v-card-subtitle>
        <v-card-text>
          <v-text-field v-model="s_input.config_filename" label="專案配置檔案名稱"></v-text-field>
          <v-text-field v-model="s_input.auto_commit_format" label="自動送出 Git 更新訊息格式"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" class="w-100" color="success" size="large">確認</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
</template>

<script lang="ts">
import { setting_file } from '@/backend/struct';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'VSetting',
  props:{
    setting: Object
  },
  computed:{
    s_input():setting_file{
      return this.setting as setting_file ?? undefined
    }
  }
})
</script>