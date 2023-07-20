import { IpcMainInvokeEvent, ipcMain, dialog, BrowserWindow } from "electron";
import * as fs from 'fs'

export function EventInit(win:BrowserWindow){
    ipcMain.handle('io-save-json', (e:IpcMainInvokeEvent, title:string, data:string) => {
        const result = dialog.showSaveDialogSync(win, {title: title});
        if(result != undefined){
            fs.writeFileSync(result, data);
        }
    })
    ipcMain.handle('io-open-json', (e:IpcMainInvokeEvent, title:string) => {
        const result = dialog.showOpenDialogSync(win, {title: title, properties: ['openFile']});
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
}