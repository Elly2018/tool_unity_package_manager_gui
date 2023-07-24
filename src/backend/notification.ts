import { ipcMain, IpcMainInvokeEvent } from "electron";
import { Notification } from 'electron'

export function EventInit(){
    ipcMain.handle('notification', (e:IpcMainInvokeEvent, title:string, body:string) => {
        const n:Notification = new Notification({title: title, body:body})
        n.show();
    })
}