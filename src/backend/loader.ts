import { IpcMainInvokeEvent, ipcMain } from "electron";
import * as fs from 'fs'
import * as path from 'path'

export function EventInit(){
    ipcMain.handle('loader-workspace', (e:IpcMainInvokeEvent) => {
        const result = fs.readFileSync(path.join(__dirname, 'workspace'))
        return result;
    })

    ipcMain.handle('loader-project', (e:IpcMainInvokeEvent, projectpath:string) => {
        const result = fs.readFileSync(projectpath)
        return result;
    })
}