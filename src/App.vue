<template>
  <v-app id="app">
      <NavBar @page="(i) => page = i"  :page="page">
        <Homepage v-show="page == 0"/>
        <Dashboard v-show="page == 1"/>
        <Workspace v-show="page == 2" :workspace="workspace" @select="select_project"/>
        <Project v-show="page == 3" :preset="preset" :project="project" :project_path="project_path" :setting="setting" @toast="toast"/>
        <Preset v-show="page == 4" :preset="preset"/>
        <Setting v-show="page == 5" :setting="setting"/>
      </NavBar>
      <v-snackbar :color="Snackbar_data.color" v-model="Snackbar">
        <v-card flat :color="Snackbar_data.color">
          <v-card-title>{{ Snackbar_data.title }}</v-card-title>
          <v-card-text>{{ Snackbar_data.text }}</v-card-text>
        </v-card>
      </v-snackbar>
      <v-dialog v-model="reset_dialog" width="500">
        <v-card flat class="pa-4">
          <v-card-title>Parse Error</v-card-title>
          <v-card-text>
            Project Config Parse Error: {{ project_path_temp }}
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" @click="reset_confirm" color="success">確認</v-btn>
            <v-btn variant="tonal" @click="reset_dialog = false" color="error">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { workspace_file, recent_open, preset_file, setting_file, project_config, Snackbar_Content } from './backend/struct'
import { ipcRenderer } from 'electron'


interface app_interface{
  page: number
  project_path: string
  project_path_temp: string
  Snackbar: boolean
  Snackbar_data: Snackbar_Content
  workspace: workspace_file | undefined
  recent: recent_open | undefined
  preset: preset_file | undefined
  setting: setting_file | undefined
  project: project_config | undefined
  reset_dialog: boolean
}

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
  mounted() {
    ipcRenderer.invoke('loader-workspace').then((v:string) => {
        this.workspace = JSON.parse(v);
        console.log("workspace", this.workspace);
      })
      ipcRenderer.invoke('loader-recent').then((v:string) => {
        this.recent = JSON.parse(v);
        console.log("recent", this.recent);
      })
      ipcRenderer.invoke('loader-preset').then((v:string) => {
        this.preset = JSON.parse(v);
        console.log("preset", this.preset);
      })
      ipcRenderer.invoke('loader-setting').then((v:string) => {
        this.setting = JSON.parse(v);
        console.log("setting", this.setting);
      })
  },
  methods:{
    select_project(p:string){
      ipcRenderer.invoke('loader-project', p, this.setting?.config_filename).then((v:string) => {
        try{
          this.project = JSON.parse(v);
          this.project_path = p;
          console.log("project", this.project);
          this.page = 3;
        }catch(e){
          console.error("project", e);
          this.project_path_temp = p;
          this.reset_dialog = true;
        }
      })
    },
    reset_confirm(){
      this.reset_dialog = false;
      ipcRenderer.invoke('loader-project-reset', this.project_path_temp, this.setting?.config_filename, (v:string) => {
        this.project = JSON.parse(v);
        this.project_path = this.project_path_temp;
        console.log("project-reset", this.project);
        this.page = 3;
      })
    },
    toast(v:Snackbar_Content){
      //this.Snackbar = true;
      //this.Snackbar_data = v;
      ipcRenderer.invoke('notification', v.title, v.text);
    }
  },
  data() : app_interface{
    return {
      page: 0,
      Snackbar: false,
      Snackbar_data: { title: "EE", text: "EE", color: "primary", has_close: false },
      project_path: "",
      project_path_temp: "",
      workspace: undefined,
      recent: undefined,
      preset: undefined,
      setting: undefined,
      project: undefined,
      reset_dialog: false
    }
  }
})
</script>
