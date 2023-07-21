<template>
    <v-container>
      <v-card flat class="w-100">
        <v-card-title>工作區</v-card-title>
        <v-card-subtitle>將多個專案群組在一起</v-card-subtitle>
      </v-card>
      <v-card flat class="w-100 d-flex pa-3">
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="create" color="primary">建立工作區</v-btn>
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="importt" color="warning">匯入</v-btn>
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="exportt" color="warning" :disabled="!is_select_workspace">匯出</v-btn>
      </v-card>
      <v-list v-model="select_workspace" style="height: 25vh;">
        <v-list-item v-for="(ws, i) in workspaces" :key="i" :title="ws.name" :subtitle="ws.description">
          <template v-slot:append>
            <v-btn density="compact" color="info" icon="mdi-select" variant="text" @click="select_ws(ws)"></v-btn>
            <v-btn density="compact" color="info" icon="mdi-pen" variant="text" @click="edit_ws(i)"></v-btn>
            <v-btn v density="compact" color="error" icon="mdi-delete" variant="text" @click="remove_ws(i)"></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-card flat class="w-100">
        <v-card-title>專案列表</v-card-title>
        <v-card-subtitle>選擇管理專案</v-card-subtitle>
        <v-card-text>
          路徑: {{ select_workspace?.name }}
        </v-card-text>
      </v-card>
      <v-card flat class="w-100 d-flex pa-3">
        <v-btn variant="tonal" class="flex-fill ma-1" flat @click="addproject" :disabled="!is_select_workspace" color="primary">加入專案</v-btn>
      </v-card>
      <v-list style="height: 40vh;">
        <v-list-item v-for="(pro, i) in projects" :key="i">
          <v-list-item-title class="text-decoration-underline" @click="open(pro)" style="cursor: pointer;">
            {{ pro }}
          </v-list-item-title>
          <template v-slot:append>
            <v-btn density="compact" color="info" icon="mdi-select" variant="text" @click="select_project_confirm(pro)"></v-btn>
            <v-btn density="compact" color="error" icon="mdi-delete" variant="text" @click="remove_project(i)"></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-dialog v-model="create_dialog" width="500">
        <v-card flat class="pa-4">
          <v-card-title>{{ popup_title }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="name" label="名稱"></v-text-field>
            <v-text-field v-model="description" label="敘述"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" @click="create_confirm" color="success">確認</v-btn>
            <v-btn variant="tonal" @click="create_dialog = false" color="error">取消</v-btn>
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
import { workspace_file, workspace_config } from '@/backend/struct'
import { ipcRenderer } from 'electron'
import { defineComponent } from 'vue'

interface workspace_interface {
  create_dialog: boolean
  select_workspace: workspace_config | undefined
  select_project: string
  edit_workspace: number
  popup_mode: number
  popup_title: string
  name: string
  description: string
  delete_dialog: boolean
  delete_title: string
  delete_text: string
  delete_mode: number // ws or pro
  delete_index: number
}

export default defineComponent({
  name: 'VWorkspace',
  props: {
    workspace: Object
  },
  computed:{
    is_select_workspace():boolean{
      return this.select_workspace !== undefined;
    },
    workspaces(): Array<workspace_config>{
      if (this.workspace == undefined) return []
      return (this.workspace as workspace_file).element;
    },
    projects(): Array<string>{
      if (this.select_workspace == undefined) return []
      return this.select_workspace.projects;
    }
  },
  methods:{
    create(){
      this.popup_title = "建立工作區"
      this.popup_mode = 0;
      this.name = "";
      this.description = "";
      this.create_dialog = true;
    },
    create_confirm(){
      if(this.popup_mode == 0){
        const ws:workspace_config = { name: this.name, description: this.description, projects: this.projects }
        const ws_input:workspace_file = this.workspace as workspace_file;
        ws_input.element.push(ws);
        ipcRenderer.invoke('loader-workspace-save', JSON.stringify(ws_input));
        this.create_dialog = false;
      }
      else if(this.popup_mode == 1){
        const ws_input:workspace_file = this.workspace as workspace_file;
        ws_input.element[this.edit_workspace].name = this.name;
        ws_input.element[this.edit_workspace].description = this.description;
        ipcRenderer.invoke('loader-workspace-save', JSON.stringify(ws_input));
        this.create_dialog = false;
      }
    },
    select_ws(ws:workspace_config){
      this.select_workspace = ws;
    },
    edit_ws(index:number){
      this.popup_title = "編輯工作區"
      this.popup_mode = 1;
      this.edit_workspace = index;

      const ws_input:workspace_file = this.workspace as workspace_file;
      this.name = ws_input.element[this.edit_workspace].name
      this.description = ws_input.element[this.edit_workspace].description;

      this.create_dialog = true;
    },
    remove_ws(index:number){
      const ws_input:workspace_file = this.workspace as workspace_file;
      this.delete_mode = 0;
      this.delete_index = index;
      this.delete_dialog = true;
      this.delete_title = "刪除工作區";
      this.delete_text = `確認刪除工作區 ${ws_input.element[index].name} 嗎?\n 裡面還有 ${ws_input.element[index].projects.length} 個專案標記`;
    },
    importt(){
      ipcRenderer.invoke('io-open-json', "匯入工作區").then((v:string) => {
        const ws_input:workspace_file = this.workspace as workspace_file;
        const vv:workspace_config = JSON.parse(v);
        const checker = ws_input.element.findIndex(x => x.name == vv.name);
        console.log('import', vv)
        if(checker == -1){
          ws_input.element.push(vv);
          ipcRenderer.invoke('loader-workspace-save', JSON.stringify(ws_input));
        }else{
          console.log("The workspace name is already existed")
        }
      })
    },
    exportt(){
      ipcRenderer.invoke('io-save-json', "儲存工作區", JSON.stringify(this.select_workspace));
    },
    addproject(){
      ipcRenderer.invoke('io-open-folder', "新增專案路徑").then((v:string) => {
        const ws_input:workspace_file = this.workspace as workspace_file;
        this.select_workspace?.projects.push(v);
        ipcRenderer.invoke('loader-workspace-save', JSON.stringify(ws_input));
      })
    },
    select_project_confirm(path:string){
      this.$emit('select', path);
    },
    remove_project(index:number){
      this.delete_mode = 1;
      this.delete_index = index;
      this.delete_dialog = true;
      this.delete_title = "刪除專案";
      this.delete_text = `確認刪除專案 ${this.select_workspace?.projects[index]} 嗎?`;
    },
    delete_confirm(){
      console.log(this.delete_mode, this.delete_index);
      if(this.delete_mode == 0){
        const ws_input:workspace_file = this.workspace as workspace_file;
        ws_input.element.splice(this.delete_index, 1);
        ipcRenderer.invoke('loader-workspace-save', JSON.stringify(ws_input));
      }
      else if(this.delete_mode == 1){
        const ws_input:workspace_file = this.workspace as workspace_file;
        this.select_workspace?.projects.splice(this.delete_index, 1);
        ipcRenderer.invoke('loader-workspace-save', JSON.stringify(ws_input));
      }
      this.delete_dialog = false;
    },
    open(command:string){
      ipcRenderer.invoke('shell', command);
    }
  },
  data() : workspace_interface{
    return {
      create_dialog: false,
      select_workspace: undefined,
      edit_workspace: -1,
      select_project: "",
      popup_mode: 0,
      popup_title: "",
      name: "",
      description: "",
      delete_dialog: false,
      delete_title: "",
      delete_text: "",
      delete_mode: 0,
      delete_index: 0
    }
  }
})
</script>