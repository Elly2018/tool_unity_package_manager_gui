<template>
    <v-container>
      <v-card>
        <v-tabs v-model="tab">
          <v-tab value="repo">模組管理</v-tab>
          <v-tab value="res">純檔案管理</v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="repo">
              <v-card flat class="w-100" :loading="loading">
                <v-card-subtitle>管理子模組, Git 同步設定</v-card-subtitle>
                <v-card-text v-if="project_path != undefined" class="text-decoration-underline" style="cursor: pointer" @click="open(project_path)"> 專案路徑: {{ project_path }} </v-card-text>
              </v-card>
              <v-card flat class="w-100 d-flex pa-3">
                <v-btn variant="tonal" class="flex-fill ma-1" flat @click="create" :disabled="!is_project_load" color="primary">新增模組</v-btn>
              </v-card>
              <v-row class="pa-1 ma-1" style="height: 30vh;">
                <v-col cols="6">
                  <v-list style="height: 25vh;">
                    <v-list-item class="text-truncate" v-for="(ms, i) in modules" :key="i">
                      <v-list-item-title style="cursor: pointer" class="text-decoration-underline" @click="open(project_path + '\\' + ms.target_path)">本地: {{ ms.target_path }}</v-list-item-title>
                      <v-list-item-subtitle style="cursor: pointer" class="text-decoration-underline" @click="open(ms.url)">來源: {{ ms.url + '\n' + ms.branch }}</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-badge :model-value="module_up(i) > 0" :content="module_up(i)">
                          <v-btn density="compact" color="info" icon="mdi-arrow-up-thick" variant="text"></v-btn>
                        </v-badge>
                        <v-badge :model-value="module_down(i) > 0" :content="module_down(i)">
                          <v-btn density="compact" color="info" icon="mdi-arrow-down-thick" variant="text"></v-btn>
                        </v-badge>
                        <v-btn density="compact" color="info" icon="mdi-sync" variant="text" @click="sync_module(i)"></v-btn>
                        <v-btn density="compact" color="info" icon="mdi-pen" variant="text" @click="edit_module_confirm(i)"></v-btn>
                        <v-btn density="compact" color="error" icon="mdi-delete" variant="text" @click="remove_module(i)"></v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="6">
                  <v-btn variant="tonal" class="w-100 my-1" color="info" @click="fetch_all" :disabled="!is_project_load">全部狀態更新</v-btn>
                  <v-btn variant="tonal" class="w-100 my-1" color="info" @click="sync_all" :disabled="!is_project_load">全部資源同步</v-btn>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item value="res">
              <v-card flat class="w-100">
                <v-card-subtitle>非模組化, 簡單的檔案備份與同步管理, 這邊只會用複製的功能, 刪除的檔案不會同步刪除 (注意)</v-card-subtitle>
                <v-card-text v-if="project_path != undefined" class="text-decoration-underline" style="cursor: pointer" @click="open(project_path)"> 專案路徑: {{ project_path }} </v-card-text>
              </v-card>
              <v-card flat class="w-100 d-flex pa-3">
                <v-btn variant="tonal" class="flex-fill ma-1" flat @click="create_res" :disabled="!is_project_load" color="primary">新增檔案同步</v-btn>
              </v-card>
              <v-row class="pa-1 ma-1" style="height: 30vh;">
                <v-col cols="6">
                  <v-list style="height: 25vh;">
                    <v-list-item shaped="true" class="text-truncate" v-for="(ms, i) in resources" :key="i">
                      <v-list-item-title class="text-decoration-underline" style="cursor: pointer" @click="open(ms.to)">本地: {{ ms.to }}</v-list-item-title>
                      <v-list-item-subtitle class="text-decoration-underline" style="cursor: pointer" @click="open(ms.from)">來源: {{ ms.from }}</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-btn density="compact" color="info" icon="mdi-arrow-up-thick" variant="text"></v-btn>
                        <v-btn density="compact" color="info" icon="mdi-arrow-down-thick" variant="text"></v-btn>
                        <v-btn density="compact" color="info" icon="mdi-pen" variant="text" @click="edit_resource_confirm(i)"></v-btn>
                        <v-btn density="compact" color="error" icon="mdi-delete" variant="text" @click="remove_resource(i)"></v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="6">
                  <v-btn variant="tonal" class="w-100 my-1" color="info" @click="backup_all" :disabled="!is_project_load">全部資源備份</v-btn>
                  <v-btn variant="tonal" class="w-100 my-1" color="info" @click="resource_download_all" :disabled="!is_project_load">全部資源下載</v-btn>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>

      <v-card flat class="w-100">
        <v-card-subtitle>模組動作</v-card-subtitle>
      </v-card>

      <v-dialog v-model="create_module" width="500">
        <v-card flat class="pa-4">
          <v-card-title>{{ create_module_title }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="create_module_content.url" label="連結">
              <template v-slot:append>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-horizontal" v-bind="props"></v-btn>
                  </template>
                  <v-list>
                    <v-list-subheader>載入預定義</v-list-subheader>
                    <v-list-item v-for="(repo, i) in preset_repos" :key="i" @click="load_preset_repo(repo)">{{ repo.title }}</v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>
            <v-checkbox v-model="create_module_content.use_branch" label="標註分支"></v-checkbox>
            <v-text-field v-model="create_module_content.branch" :disabled="!create_module_content.use_branch" label="分支"></v-text-field>
            <v-checkbox v-model="create_module_content.use_name" label="標註資料夾名稱"></v-checkbox>
            <v-text-field v-model="create_module_content.name" :disabled="!create_module_content.use_name" label="資料夾名稱"></v-text-field>
            <v-text-field v-model="create_module_content.target_path" label="路徑">
              <template v-slot:append>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-horizontal" v-bind="props"></v-btn>
                  </template>
                  <v-list>
                    <v-list-subheader>載入預定義</v-list-subheader>
                    <v-list-item v-for="(path, i) in preset_paths" :key="i" @click="load_preset_path(path)">{{ path.title }}</v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" @click="create_confirm" color="success">確認</v-btn>
            <v-btn variant="tonal" @click="create_module = false" color="error">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="create_resource" width="500">
        <v-card flat class="pa-4">
          <v-card-title>{{ create_resource_title }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="create_resource_content.from" label="來源"></v-text-field>
            <v-text-field v-model="create_resource_content.to" label="專案內路徑"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" @click="create_res_confirm" color="success">確認</v-btn>
            <v-btn variant="tonal" @click="create_resource = false" color="error">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="delete_dialog" width="500">
        <v-card flat class="pa-4">
          <v-card-title>{{ delete_title }}</v-card-title>
          <v-card-text>
            {{ delete_text }}
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" @click="delete_confirm" color="success">確認</v-btn>
            <v-btn variant="tonal" @click="delete_dialog = false" color="error">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { project_config, project_module, setting_file, project_resource, Snackbar_Content, module_state, preset_path, preset_repo, preset_file } from '@/backend/struct'
import { ipcRenderer } from 'electron'
import * as path from 'path'

interface project_interface {
  tab: any
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
  delete_dialog: boolean
  delete_title: string
  delete_text: string
  delete_mode: number // git or res
  delete_index: number
  module_status: Array<module_state | undefined>
}

export default defineComponent({
  name: 'VProject',
  props: {
    project: Object,
    preset: Object,
    project_path: String,
    setting: Object
  },
  watch: {
    project: function(newP, oldP){
      console.log("Project Update",this.project_path);
      this.fetch_all();
    }
  },
  computed:{
    is_project_load():boolean{
      return this.project !== undefined;
    },
    modules():Array<project_module>{
      if(this.project === undefined) return [];
      const pro_input:project_config = this.project as project_config;
      return pro_input.modules;
    },
    resources():Array<project_resource>{
      if(this.project === undefined) return [];
      const pro_input:project_config = this.project as project_config;
      return pro_input.resource;
    },
    preset_repos():Array<preset_repo>{
      const pro_input:preset_file = this.preset as preset_file;
      return pro_input?.repos ?? [];
    },
    preset_paths():Array<preset_path>{
      const pro_input:preset_file = this.preset as preset_file;
      return pro_input?.paths ?? [];
    }
  },
  methods:{
    create(){
      this.create_module = true;
      this.create_module_mode = 0;
      this.create_module_title = "新增模組"
      this.create_module_content = { name: "", url: "", branch: "", use_branch: false, use_name: false, target_path: ""};
    },
    create_res(){
      this.create_resource = true;
      this.create_resource_mode = 0;
      this.create_resource_title = "新增檔案同步"
      this.create_resource_content = { from: "", to: "" };
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
    create_res_confirm(){
      const pro_input:project_config = this.project as project_config;
      const set_input:setting_file = this.setting as setting_file;
      if(this.create_resource_mode == 0){
        pro_input.resource.push(this.create_resource_content);
        ipcRenderer.invoke('loader-project-save', this.project_path, JSON.stringify(pro_input), set_input.config_filename);
        this.create_resource = false;
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
      const k:Snackbar_Content = {
          title: "更新完畢",
          text: `更新了 ${target.target_path} 模組`,
          color: "info",
          has_close: true
        }
      ipcRenderer.invoke('git-sync', pat, target.url, target.use_branch, target.branch).then(()=> {
        this.$emit('toast', k);
        this.loading = false;
      })
      this.loading = true;
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
      this.delete_mode = 0;
      this.delete_index = index;
      this.delete_dialog = true;
      this.delete_title = "刪除模組";
      this.delete_text = `確認刪除模組 ${pro_input.modules[index].target_path} 嗎?`;
    },
    edit_resource_confirm(index:number){
      const pro_input:project_config = this.project as project_config;
      this.create_resource = true;
      this.create_resource_mode = 1;
      this.create_resource_title = "編輯資源同步"
      this.edit_resource = index;
      this.create_resource_content = pro_input.resource[index];
    },
    remove_resource(index:number){
      const pro_input:project_config = this.project as project_config;
      this.delete_mode = 1;
      this.delete_index = index;
      this.delete_dialog = true;
      this.delete_title = "刪除資源同步";
      this.delete_text = `確認刪除資源同步 ${pro_input.resource[index].to} 嗎?`;
    },
    delete_confirm(){
      if(this.delete_mode == 0){
        const pro_input:project_config = this.project as project_config;
        const set_input:setting_file = this.setting as setting_file;
        pro_input.modules.splice(this.delete_index, 1);
        ipcRenderer.invoke('loader-project-save', this.project_path, JSON.stringify(pro_input), set_input.config_filename);
      }
      else if(this.delete_mode == 1){
        const pro_input:project_config = this.project as project_config;
        const set_input:setting_file = this.setting as setting_file;
        pro_input.resource.splice(this.delete_index, 1);
        ipcRenderer.invoke('loader-project-save', this.project_path, JSON.stringify(pro_input), set_input.config_filename);
      }
      this.delete_dialog = false;
    },
    load_preset_repo(repo:preset_repo){
      this.create_module_content.name = repo.name;
      this.create_module_content.url = repo.url;
      this.create_module_content.branch = repo.branch;
      this.create_module_content.use_branch = repo.use_branch;
      this.create_module_content.use_name = repo.use_name;
    },
    load_preset_path(path:preset_path){
      this.create_module_content.target_path = path.path;
    },
    fetch_all(){
      const pro_input:project_config = this.project as project_config;
      const leng = pro_input.modules.length;
      this.module_status = []
      const tasks = pro_input.modules.map((target, i) => {
        if(this.project_path == undefined) return;
        let pat = path.join(this.project_path, target.target_path);
        if(target.use_name && target.name.length > 0){
          pat = path.join(pat, target.name);
        }
        return ipcRenderer.invoke('git-fetch', pat, target.url, target.use_branch, target.branch).then(vs => {
          if(vs == undefined) return;
          const v:module_state = JSON.parse(vs);
          this.module_status[i] = v;
          console.log(target.url, target.target_path, v);
        })
      })

      Promise.all(tasks).then(() => {
        const k:Snackbar_Content = {
          title: "更新完畢",
          text: `更新了 ${leng} 個子模組`,
          color: "info",
          has_close: true
        }
        this.$emit('toast', k);
        this.loading = false;
      })
      this.loading = true;
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
    },
    backup_all(){
      const pro_input:project_config = this.project as project_config;
      const leng = pro_input.resource.length;
      const tasks = pro_input.resource.map(target => {
        return ipcRenderer.invoke('io-copyto', target.to, target.from, true);
      })

      Promise.all(tasks).then(() => {
        const k:Snackbar_Content = {
          title: "資源備份完畢",
          text: `備份了 ${leng} 個資源配置`,
          color: "info",
          has_close: true
        }
        this.$emit('toast', k);
        this.loading = false;
      })
      this.loading = true;
    },
    resource_download_all(){
      const pro_input:project_config = this.project as project_config;
      const leng = pro_input.resource.length;
      const tasks = pro_input.resource.map(target => {
        return ipcRenderer.invoke('io-copyto', target.from, target.to, true);
      })

      Promise.all(tasks).then(() => {
        const k:Snackbar_Content = {
          title: "資源下載完畢",
          text: `下載了 ${leng} 個資源配置`,
          color: "info",
          has_close: true
        }
        this.$emit('toast', k);
        this.loading = false;
      })
      this.loading = true;
    },
    module_up(i:number):number{
      return this.module_status[i]?.status.not_added.length ?? 0;
    },
    module_down(i:number):number{
      return (this.module_status[i]?.fetch.updated.length ?? 0) + (this.module_status[i]?.fetch.deleted.length ?? 0);
    },
    open(command:string){
      ipcRenderer.invoke('shell', command);
    }
  },
  data(): project_interface{
    return {
      tab: null,
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
      edit_resource: 0,
      module_status: [],
      delete_dialog: false,
      delete_title: "",
      delete_text: "",
      delete_mode: 0,
      delete_index: 0
    }
  }
})
</script>