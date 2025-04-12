import { create } from "zustand";
import { persist } from "zustand/middleware";
import {v4 as uuidv4} from 'uuid'
type Task = {
    id:string,
    title:string,
    description:string,
    progress:number,
    deadline:string,
    photos:string[],
    isSubmitted:boolean,
    createdBy:string,
}

type TaskStore ={
    tasks:Task[],
    createTask:(task: Omit<Task, 'id'>)=> void
    submitTask:(id:string)=> void
}

export const useTaskStore = create<TaskStore>()(persist(
    (set)=>({
        tasks:[],
        createTask:(task)=>set(state=>({
            tasks:[...state.tasks, {...task, id:uuidv4()}]
        })),
        submitTask:(id)=> set(state=>({
            tasks:state.tasks.map(task=>task.id === id? {...task, isSubmitted:true} : task)
        }))
    }),
    {
        name:"task-store"
    }
))