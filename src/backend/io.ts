import { IpcMainInvokeEvent, ipcMain, dialog, BrowserWindow, shell } from "electron";
import * as fs from 'fs'
import * as fse from 'fs-extra'

export function EventInit(win:BrowserWindow){
    ipcMain.handle('shell', (e:IpcMainInvokeEvent, command:string) => {
        shell.openExternal(command)
    })
    ipcMain.handle('io-save-json', (e:IpcMainInvokeEvent, title:string, data:string) => {
        const result = dialog.showSaveDialogSync(win, {title: title, filters: [ { name: "JSON file", extensions: ['json'] } ]});
        if(result != undefined){
            fs.writeFileSync(result, data);
        }
    })
    ipcMain.handle('io-open-json', (e:IpcMainInvokeEvent, title:string) => {
        const result = dialog.showOpenDialogSync(win, {title: title, properties: ['openFile'], filters: [ { name: "JSON file", extensions: ['json'] } ]});
        if(result != undefined && result.length > 0){
            return fs.readFileSync(result[0]).toString();
        }
    })
    ipcMain.handle('io-open-folder', (e:IpcMainInvokeEvent, title:string) => {
        const result = dialog.showOpenDialogSync(win, {title: title, properties: ['openDirectory']});
        if(result != undefined && result.length > 0){
            return result[0];
        }
    })
    ipcMain.handle('io-copyto', async (e:IpcMainInvokeEvent, src:string, dist:string, override:boolean) => {
        return fse.copy(src, dist, {overwrite: override});
    })
}