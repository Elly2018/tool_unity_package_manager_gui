import { IpcMainInvokeEvent, ipcMain } from "electron";
import { workspace_file, recent_open, preset_file, setting_file, project_config } from './struct'
import * as fs from 'fs'
import * as path from 'path'

export function EventInit(){
    ipcMain.handle('loader-workspace', (e:IpcMainInvokeEvent) => {
        const p = path.join(__dirname, 'workspace.json');
        if(fs.existsSync(p)){
            const result = fs.readFileSync(p)
            return result.toString();
        }else{
            const k:workspace_file = { element: [] }
            const k_string = JSON.stringify(k);
            fs.writeFileSync(p, k_string);
            return k_string;
        }
    })
    ipcMain.handle('loader-workspace-save', (e:IpcMainInvokeEvent, v:string) => {
        const p = path.join(__dirname, 'workspace.json');
        fs.writeFileSync(p, v);
    })

    ipcMain.handle('loader-setting', (e:IpcMainInvokeEvent) => {
        const p = path.join(__dirname, 'setting.json');
        if(fs.existsSync(p)){
            const result = fs.readFileSync(p)
            return result.toString();
        }else{
            const k:setting_file = { config_filename: "fufu.json", lastopen: "" }
            const k_string = JSON.stringify(k);
            fs.writeFileSync(p, k_string);
            return k_string;
        }
    })

    ipcMain.handle('loader-preset', (e:IpcMainInvokeEvent) => {
        const p = path.join(__dirname, 'preset.json');
        if(fs.existsSync(p)){
            const result = fs.readFileSync(p)
            return result.toString();
        }else{
            const k:preset_file = { paths: [], repos: [] }
            const k_string = JSON.stringify(k);
            fs.writeFileSync(p, k_string);
            return k_string;
        }
    })

    ipcMain.handle('loader-recent', (e:IpcMainInvokeEvent) => {
        const p = path.join(__dirname, 'recent.json');
        if(fs.existsSync(p)){
            const result = fs.readFileSync(p)
            return result.toString();
        }else{
            const k:recent_open = { path: [] }
            const k_string = JSON.stringify(k);
            fs.writeFileSync(p, k_string);
            return k_string;
        }
    })

    ipcMain.handle('loader-project', (e:IpcMainInvokeEvent, projectpath:string, filename:string) => {
        const p = path.join(projectpath, filename);
        if(fs.existsSync(p)){
            const result = fs.readFileSync(p)
            return result.toString();
        }else{
            const k:project_config = { modules: [], resource: [] }
            const k_string = JSON.stringify(k);
            fs.writeFileSync(p, k_string);
            return k_string;
        }
    })

    ipcMain.handle('loader-project-save', (e:IpcMainInvokeEvent, projectpath:string, v:string, filename:string) => {
        const p = path.join(projectpath, filename);
        fs.writeFileSync(p, v);
    })
}