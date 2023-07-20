<template>
    <v-container>
      <v-card flat class="w-100" :loading="loading">
        <v-card-title>專案管理</v-card-title>
        <v-card-subtitle>管理子模組, Git 同步設定</v-card-subtitle>
        <v-card-text>
          {{ project_path }}
        </v-card-text>
      </v-card>
      <v-card flat class="w-100 d-flex pa-3">
        <v-btn class="flex-fill" flat @click="create" :disabled="!is_project_load" color="primary">新增模組</v-btn>
      </v-card>
      <v-row class="pa-1 ma-1" style="height: 25vh;">
        <v-col cols="6">
          <v-list style="height: 25vh;">
            <v-list-item v-for="(ms, i) in modules" :key="i" :title="ms.target_path" :subtitle="ms.url + '\n' + ms.branch">
              <template v-slot:append>
                <v-btn color="info" icon="mdi-sync" variant="text" @click="sync_module(i)"></v-btn>
                <v-btn color="info" icon="mdi-pen" variant="text" @click="edit_module_confirm(i)"></v-btn>
                <v-btn color="error" icon="mdi-delete" variant="text" @click="remove_module(i)"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="6">
          <v-btn class="w-100 my-1" color="info" @click="fetch_all">Fetch All</v-btn>
          <v-btn class="w-100 my-1" color="info" @click="sync_all">Sync All</v-btn>
        </v-col>
      </v-row>
      <v-card flat class="w-100">
        <v-card-title>純檔案區</v-card-title>
        <v-card-subtitle>非模組化, 簡單的檔案備份與同步管理</v-card-subtitle>
      </v-card>
      <v-dialog v-model="create_module" width="500">
        <v-card flat class="pa-4">
          <v-card-title>{{ create_module_title }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="create_module_content.url" label="連結"></v-text-field>
            <v-checkbox v-model="create_module_content.use_branch" label="標註分支"></v-checkbox>
            <v-text-field v-model="create_module_content.branch" :disabled="!create_module_content.use_branch" label="分支"></v-text-field>
            <v-checkbox v-model="create_module_content.use_name" label="標註資料夾名稱"></v-checkbox>
            <v-text-field v-model="create_module_content.name" :disabled="!create_module_content.use_name" label="資料夾名稱"></v-text-field>
            <v-text-field v-model="create_module_content.target_path" label="路徑"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="create_confirm" color="success">確認</v-btn>
            <v-btn @click="create_module = false" color="error">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { project_config, project_module, setting_file, project_resource, Snackbar_Content } from '@/backend/struct'
import { ipcRenderer } from 'electron'
import * as path from 'path'

interface project_interface {
  loading: boolean
  create_module: boolean
  create_module_mode: number
  create_module_title: string
  create_module_content: project_module
  edit_module: number
  create_resource: boolean
  create_resource_mode: number
  create_resource_title: string
  create_resource_content: project_resource
  edit_resource: number
}

export default defineComponent({
  name: 'VProject',
  props: {
    project: Object,
    project_path: String,
    setting: Object
  },
  computed:{
    is_project_load():boolean{
      return this.project !== undefined;
    },
    modules():Array<project_module>{
      if(this.project === undefined) return [];
      const pro_input:project_config = this.project as project_config;
      return pro_input.modules;
    }
  },
  methods:{
    create(){
      this.create_module = true;
      this.create_module_mode = 0;
      this.create_module_title = "新增模組"
      this.create_module_content = { name: "", url: "", branch: "", use_branch: false, use_name: false, target_path: ""};
    },
    create_confirm(){
      const pro_input:project_config = this.project as project_config;
      const set_input:setting_file = this.setting as setting_file;
      if(this.create_module_mode == 0){
        pro_input.modules.push(this.create_module_content);
        ipcRenderer.invoke('loader-project-save', this.project_path, JSON.stringify(pro_input), set_input.config_filename);
        this.create_module = false;
      }else if(this.create_module_mode == 1){
        pro_input.modules[this.edit_module] = this.create_module_content;
        ipcRenderer.invoke('loader-project-save', this.project_path, JSON.stringify(pro_input), set_input.config_filename);
        this.create_module = false;
      }
    },
    sync_module(index:number){
      const pro_input:project_config = this.project as project_config;
      const target = pro_input.modules[index];
      if(this.project_path == undefined) return;
      let pat = path.join(this.project_path, target.target_path);
      if(target.use_name && target.name.length > 0){
        pat = path.join(pat, target.name);
      }
      ipcRenderer.invoke('git-sync', pat, target.url, target.use_branch, target.branch)
    },
    edit_module_confirm(index:number){
      const pro_input:project_config = this.project as project_config;
      this.create_module = true;
      this.create_module_mode = 1;
      this.create_module_title = "編輯模組"
      this.edit_module = index;
      this.create_module_content = pro_input.modules[index];
    },
    remove_module(index:number){
      const pro_input:project_config = this.project as project_config;
      const set_input:setting_file = this.setting as setting_file;
      pro_input.modules.splice(index, 1);
      ipcRenderer.invoke('loader-project-save', this.project_path, JSON.stringify(pro_input), set_input.config_filename);
    },
    fetch_all(){
      const pro_input:project_config = this.project as project_config;
      const leng = pro_input.modules.length;
      for(let i = 0; i < leng; i++){
        const target = pro_input.modules[i];
        if(this.project_path == undefined) return;
        let pat = path.join(this.project_path, target.target_path);
        if(target.use_name && target.name.length > 0){
          pat = path.join(pat, target.name);
        }
        ipcRenderer.invoke('git-fetch', pat, target.url, target.use_branch, target.branch)
      }
    },
    sync_all(){
      const pro_input:project_config = this.project as project_config;
      const leng = pro_input.modules.length;

      const tasks = pro_input.modules.map(target => {
        if(this.project_path == undefined) return;
        let pat = path.join(this.project_path, target.target_path);
        if(target.use_name && target.name.length > 0){
          pat = path.join(pat, target.name);
        }
        return ipcRenderer.invoke('git-sync', pat, target.url, target.use_branch, target.branch)
        
      })

      Promise.all(tasks).then(() => {
        const k:Snackbar_Content = {
          title: "同步完畢",
          text: `同步了 ${leng} 個子模組`,
          color: "info",
          has_close: true
        }
        this.$emit('toast', k);
        this.loading = false;
      })
      this.loading = true;
    }
  },
  data(): project_interface{
    return {
      loading: false,
      create_module: false,
      create_module_mode: 0,
      create_module_title: "",
      create_module_content: { name: "", url: "", branch: "", use_branch: false, use_name: false, target_path: ""},
      edit_module: 0,
      create_resource: false,
      create_resource_mode: 0,
      create_resource_title: "",
      create_resource_content: { from: "", to: "" },
      edit_resource: 0
    }
  }
})
</script>