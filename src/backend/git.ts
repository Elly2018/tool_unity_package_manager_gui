import { IpcMainInvokeEvent, ipcMain } from "electron";
import * as simpleGit from 'simple-git'
import * as fs from 'fs'
import * as path from 'path'

const options: Partial<simpleGit.SimpleGitOptions> = {
    baseDir: process.cwd(),
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
 };

export function EventInit(){
    ipcMain.handle('git-fetch', async (e:IpcMainInvokeEvent, pat:string, url:string, use_branch:boolean, branch:string) => {
        const exist = fs.existsSync(pat);
        const gitexist = fs.existsSync(path.join(pat, '.git'));
        if(!exist || !gitexist) {
            if(!exist) fs.mkdirSync(pat, {recursive: true});
            const git = simpleGit.gitP(pat, options)
            await git.clone(url, pat, { '--branch':  use_branch && branch.length > 0 ? branch : null}, (error) => { console.log(error) })
            return undefined;
        }else{
            const git = simpleGit.gitP(pat);
            const result_f = await git.fetch();
            const result_s = await git.status();
            return JSON.stringify({fetch: result_f, status: result_s});
        }
    })
    ipcMain.handle('git-sync', async (e:IpcMainInvokeEvent, pat:string, url:string, use_branch:boolean, branch:string) => {
        const exist = fs.existsSync(pat);
        const gitexist = fs.existsSync(path.join(pat, '.git'));
        if(!exist || !gitexist) {
            if(!exist) fs.mkdirSync(pat, {recursive: true});
            const git = simpleGit.gitP(pat, options);
            await git.clone(url, pat, { '--branch': use_branch && branch.length > 0 ? branch : null}, (error) => { console.log(error) })
        }else{
            const git = simpleGit.gitP(pat);
            if(use_branch && branch.length > 0) git.checkout(branch);
            await git.pull();
        }
    })
}