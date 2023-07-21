<template>
    <v-container>
      <v-card flat class="w-100">
        <v-card-title>預定義</v-card-title>
        <v-card-subtitle>加入先被定義好的路徑或是連結</v-card-subtitle>
      </v-card>
      <v-card flat class="w-100 d-flex pa-3 pb-1">
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="createrepo" color="warning">匯入</v-btn>
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="createpath" :disabled="!canexport" color="warning">匯出</v-btn>
      </v-card>
      <v-card flat class="w-100 d-flex pa-3 pt-1">
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="createrepo" color="primary">新增組件配置</v-btn>
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="createpath" color="primary">新增路徑配置</v-btn>
      </v-card>
      <v-row class="pa-1 ma-1" style="height: 70vh;">
        <v-col cols="6">
          <v-list class="ma-1" style="height: 70vh;">
            <v-list-item class="text-truncate" v-for="(ms, i) in repos" :key="i">
              <v-list-item-title class="text-decoration-underline" style="cursor: pointer">標題: {{ ms.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-decoration-underline" style="cursor: pointer" @click="open(ms.url)">模組連結: {{ ms.url }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn density="compact" color="info" icon="mdi-pen" variant="text" ></v-btn>
                <v-btn density="compact" color="error" icon="mdi-delete" variant="text" ></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="6">

        </v-col>
      </v-row>
      <v-dialog v-model="create_repo" width="500">
        <v-card flat class="pa-4">
          <v-card-title>{{ create_repo_title }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="create_repo_content.title" label="標題"></v-text-field>
            <v-text-field v-model="create_repo_content.url" label="連結"></v-text-field>
            <v-checkbox v-model="create_repo_content.use_branch" label="標註分支"></v-checkbox>
            <v-text-field v-model="create_repo_content.branch" :disabled="!create_repo_content.use_branch" label="分支"></v-text-field>
            <v-checkbox v-model="create_repo_content.use_name" label="標註資料夾名稱"></v-checkbox>
            <v-text-field v-model="create_repo_content.name" :disabled="!create_repo_content.use_name" label="資料夾名稱"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" @click="create_confirm" color="success">確認</v-btn>
            <v-btn variant="tonal" @click="create_repo = false" color="error">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="create_path" width="500">
        <v-card flat class="pa-4">
          <v-card-title>{{ create_path_title }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="create_path_content.title" label="標題"></v-text-field>
            <v-text-field v-model="create_path_content.path" label="路徑"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" @click="create_path_confirm" color="success">確認</v-btn>
            <v-btn variant="tonal" @click="create_path = false" color="error">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { preset_file, preset_path, preset_repo } from '@/backend/struct'
import { ipcRenderer } from 'electron'

interface preset_interface {
  create_repo: boolean
  create_repo_mode: number
  create_repo_title: string
  create_repo_content: preset_repo
  edit_repo: number
  create_path: boolean
  create_path_mode: number
  create_path_title: string
  create_path_content: preset_path
  edit_path: number
}

export default defineComponent({
  name: 'VPreset',
  props:{
    preset: Object
  },
  computed:{
    repos():Array<preset_repo>{
      const pro_input:preset_file = this.preset as preset_file;
      return pro_input?.repos ?? [];
    },
    canexport():boolean{
      const pro_input:preset_file = this.preset as preset_file;
      return ((pro_input?.repos.length ?? 0) + (pro_input?.paths.length ?? 0)) > 0;
    }
  },
  methods:{
    createrepo(){
      this.create_repo = true;
      this.create_repo_mode = 0;
      this.create_repo_title = "新增模組配置"
      this.create_repo_content = { title: "", name: "", url: "", branch: "", use_branch: false, use_name: false};
    },
    createpath(){
      this.create_path = true;
      this.create_path_mode = 0;
      this.create_path_title = "新增路徑配置"
      this.create_path_content = {title: "", path: ""};
    },
    create_confirm(){
      const pro_input:preset_file = this.preset as preset_file;
      if(this.create_repo_mode == 0){
        pro_input.repos.push(this.create_repo_content);
        ipcRenderer.invoke('loader-preset-save', JSON.stringify(pro_input));
        this.create_repo = false;
      }else if(this.create_repo_mode == 1){
        pro_input.repos[this.edit_repo] = this.create_repo_content;
        ipcRenderer.invoke('loader-preset-save', JSON.stringify(pro_input));
        this.create_repo = false;
      }
    },
    create_path_confirm(){
      const pro_input:preset_file = this.preset as preset_file;
      if(this.create_path_mode == 0){
        pro_input.paths.push(this.create_path_content);
        ipcRenderer.invoke('loader-preset-save', JSON.stringify(pro_input));
        this.create_path = false;
      }else if(this.create_path_mode == 1){
        pro_input.paths[this.edit_path] = this.create_path_content;
        ipcRenderer.invoke('loader-preset-save', JSON.stringify(pro_input));
        this.create_path = false;
      }
    },
    open(command:string){
      ipcRenderer.invoke('shell', command);
    }
  },
  data(): preset_interface{
    return {
      create_repo: false,
      create_repo_mode: 0,
      create_repo_title: "",
      create_repo_content: { title: "", name: "", url: "", branch: "", use_branch: false, use_name: false},
      edit_repo: 0,
      create_path: false,
      create_path_mode: 0,
      create_path_title: "",
      create_path_content: {title: "", path: ""},
      edit_path: 0
    }
  }
})
</script>