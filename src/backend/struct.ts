import { FetchResult, StatusResult } from 'simple-git'

export interface workspace_config {
    projects: Array<string>
    name: string
    description: string
}

export interface workspace_file {
    element: Array<workspace_config>
}

export interface recent_open {
    path: Array<string>
}

export interface preset_repo {
    url: string
    use_branch: boolean
    branch: string
    use_name: boolean
    name: string
}

export interface preset_path {
    name: string
    path: string
}

export interface preset_file {
    paths: Array<preset_path>
    repos: Array<preset_repo>
}

export interface project_module {
    url: string
    use_branch: boolean
    branch: string
    use_name: boolean
    name: string
    target_path: string
}

export interface project_resource {
    from: string
    to: string
}

export interface project_config {
    modules: Array<project_module>
    resource: Array<project_resource>
}

export interface setting_file {
    config_filename: string
    lastopen: string
}

export interface Snackbar_Content{
    title: string
    text: string
    color: string
    has_close: boolean
}

export interface module_state {
    fetch: FetchResult
    status: StatusResult
}