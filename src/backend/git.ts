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
    ipcMain.handle('git-sync', async (e:IpcMainInvokeEvent, pat:string, url:string, use_branch:boolean, branch:string, auto_commit:string) => {
        const exist = fs.existsSync(pat);
        const gitexist = fs.existsSync(path.join(pat, '.git'));
        if(!exist || !gitexist) {
            if(!exist) fs.mkdirSync(pat, {recursive: true});
            const git = simpleGit.gitP(pat, options);
            await git.clone(url, pat, { '--branch': use_branch && branch.length > 0 ? branch : null}, (error) => { console.log(error) })
        }else{
            const git = simpleGit.gitP(pat);
            const result_f = await git.fetch();
            const result_s = await git.status();
            const result_b = await git.branch();
            const date:Date = new Date(Date.now());
            const syncAction = async () => {
                if((result_s.not_added.length + result_s.deleted.length + result_s.modified.length) > 0){
                    let all:Array<string> = []
                    all.push(...result_s.not_added);
                    all.push(...result_s.modified);
                    all.push(...result_s.deleted);
                    await git.add(all)
                    await git.commit(auto_commit.replace(/(%DATE%)/, date.toDateString()).replace(/(%TIME%)/, date.toTimeString()), all);
                    await git.push();
                }
                if(result_f.deleted.length + result_f.updated.length > 0){
                    await git.pull();   
                }
            }
            if(result_b.current != branch && use_branch){
                await syncAction();
                if(use_branch && branch.length > 0) git.checkout(branch);
                await git.pull();
            }else{
                await syncAction();
            }
        }
    })
}