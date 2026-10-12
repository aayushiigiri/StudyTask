export type Priority = 'high' | 'medium' | 'low'
export type SubjectColor = 'blue' | 'teal' | 'forest' | 'marigold' | 'pumpkin' | 'cranberry' | 'purple' | 'lavender' | 'pink' | 'steel'
export type Subject = { id: string; name: string; color: SubjectColor }
export type Subtask = { id: string; title: string; done: boolean }
export type Task = { id: string; title: string; description?: string; dueAt?: string; priority: Priority; completed: boolean; completedAt?: string; subjectId?: string; subtasks: Subtask[]; estimateMin?: number; order: number; createdAt: string; updatedAt: string }
export type AppState = { tasks: Task[]; subjects: Subject[]; theme: 'light' | 'dark' | 'system'; palette: 'indigo' | 'teal' | 'sunrise' | 'classic'; userName?: string }
export const subjectColors: SubjectColor[] = ['blue','teal','forest','marigold','pumpkin','cranberry','purple','lavender','pink','steel']
export const priorityLabel: Record<Priority,string> = { high: 'High', medium: 'Medium', low: 'Low' }
export const priorityWeight: Record<Priority,number> = { high: 3, medium: 2, low: 1 }
export const uid = () => Math.random().toString(36).slice(2, 10)
export const makeTask = (title: string, overrides: Partial<Task> = {}): Task => { const now = new Date().toISOString(); return { id: uid(), title, priority: 'medium', completed: false, subtasks: [], order: Date.now(), createdAt: now, updatedAt: now, ...overrides } }
export const seedSubjects: Subject[] = [
 {id:'ds',name:'Data Structures',color:'blue'},{id:'os',name:'Operating Systems',color:'purple'},{id:'dm',name:'Discrete Math',color:'teal'},{id:'physics',name:'Physics Lab',color:'pumpkin'},{id:'writing',name:'Technical Writing',color:'marigold'}
]
const shift = (days:number,hour=17) => { const d=new Date(); d.setDate(d.getDate()+days); d.setHours(hour,0,0,0); return d.toISOString() }
export const seedTasks: Task[] = [
 makeTask('Finish binary search tree implementation',{subjectId:'ds',priority:'high',dueAt:shift(-2),estimateMin:90,subtasks:[{id:'a',title:'Implement insert and remove',done:true},{id:'b',title:'Add traversal tests',done:false},{id:'c',title:'Push to GitHub',done:false}]}),
 makeTask('Review process scheduling notes',{subjectId:'os',priority:'medium',dueAt:shift(0,19),estimateMin:45}),
 makeTask('Submit DBMS assignment',{subjectId:'ds',priority:'high',dueAt:shift(0,23),estimateMin:120}),
 makeTask('Read graph theory chapter 4',{subjectId:'dm',priority:'low',dueAt:shift(1),estimateMin:30}),
 makeTask('Physics lab report: pendulum',{subjectId:'physics',priority:'high',dueAt:shift(2),estimateMin:75,subtasks:[{id:'d',title:'Plot measurements',done:true},{id:'e',title:'Write conclusion',done:true},{id:'f',title:'Format citations',done:false}]}),
 makeTask('Outline capstone proposal',{subjectId:'writing',priority:'medium',dueAt:shift(4),estimateMin:60}),
 makeTask('Practice recurrence relations',{subjectId:'dm',priority:'medium',dueAt:shift(6),estimateMin:40}),
 makeTask('Clean up lab notebook',{subjectId:'physics',priority:'low',estimateMin:20}),
 makeTask('Update portfolio case study',{subjectId:'writing',priority:'low',dueAt:shift(10),estimateMin:45}),
 makeTask('Complete OS quiz',{subjectId:'os',priority:'high',completed:true,completedAt:shift(-1),dueAt:shift(-1)}),
 makeTask('Email teaching assistant',{subjectId:'ds',priority:'medium',completed:true,completedAt:shift(-2)}),
 makeTask('Submit reading response',{subjectId:'writing',priority:'low',completed:true,completedAt:shift(-3)})
]
export const initialState: AppState = {tasks: seedTasks, subjects: seedSubjects, theme:'system', palette:'indigo', userName: ''}
export type Action = {type:'hydrate';state:AppState}|{type:'upsert';task:Task}|{type:'toggle';id:string}|{type:'delete';id:string}|{type:'restore';task:Task}|{type:'addSubject';subject:Subject}|{type:'updateSubject';subject:Subject}|{type:'deleteSubject';id:string}|{type:'settings';patch:Partial<AppState>}|{type:'setUserName';name:string}
export function reducer(state:AppState, action:Action):AppState { switch(action.type) { case 'hydrate': return {...initialState,...action.state}; case 'upsert': return {...state,tasks: state.tasks.some(t=>t.id===action.task.id)?state.tasks.map(t=>t.id===action.task.id?action.task:t):[action.task,...state.tasks]}; case 'toggle': return {...state,tasks:state.tasks.map(t=>t.id===action.id?{...t,completed:!t.completed,completedAt:!t.completed?new Date().toISOString():undefined,updatedAt:new Date().toISOString()}:t)}; case 'delete': return {...state,tasks:state.tasks.filter(t=>t.id!==action.id)}; case 'restore': return {...state,tasks:[action.task,...state.tasks]}; case 'addSubject': return {...state,subjects:[...state.subjects,action.subject]}; case 'updateSubject': return {...state,subjects:state.subjects.map(s=>s.id===action.subject.id?action.subject:s)}; case 'deleteSubject': return {...state,subjects:state.subjects.filter(s=>s.id!==action.id),tasks:state.tasks.map(t=>t.subjectId===action.id?{...t,subjectId:undefined}:t)}; case 'settings': return {...state,...action.patch}; case 'setUserName': return {...state,userName:action.name}; default:return state} }
export const dateLabel = (iso?:string) => { if(!iso) return 'No due date'; const d=new Date(iso), now=new Date(); const diff=Math.round((d.getTime()-now.getTime())/86400000); if(d<now) return `Overdue · ${Math.max(1,Math.abs(diff))}d`; if(d.toDateString()===now.toDateString()) return `Today ${d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}`; if(diff===1)return 'Tomorrow'; if(diff<7)return `In ${diff} days`; return d.toLocaleDateString([], {weekday:'short',day:'numeric',month:'short'}) }
export const isToday = (iso?:string) => !!iso && new Date(iso).toDateString()===new Date().toDateString()
export const formatEstimate = (min=0) => min>=60?`${Math.floor(min/60)}h${min%60?` ${min%60}m`:''}`:`${min}m`
export const subjectAccent = (color:SubjectColor) => `colorPalette${color[0].toUpperCase()+color.slice(1)}Border2` as const
export const subjectBg = (color:SubjectColor) => `colorPalette${color[0].toUpperCase()+color.slice(1)}Background2` as const
export const subjectFg = (color:SubjectColor) => `colorPalette${color[0].toUpperCase()+color.slice(1)}Foreground2` as const
export const parseQuickAdd = (raw:string, subjects:Subject[]) => { let title=raw.trim(), priority:Priority='medium', estimateMin:number|undefined; const high=title.match(/!high\b/i), low=title.match(/!low\b/i); if(high){priority='high';title=title.replace(high[0],'')} if(low){priority='low';title=title.replace(low[0],'')} const est=title.match(/~(\d+)(m|h)\b/i); if(est){estimateMin=Number(est[1])*(est[2].toLowerCase()==='h'?60:1);title=title.replace(est[0],'')} let subjectId:string|undefined; for(const s of subjects){const re=new RegExp(`#${s.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'); if(re.test(title)){subjectId=s.id;title=title.replace(re,'')}} const due=title.match(/\b(today|tomorrow|mon|tue|wed|thu|fri|sat|sun)\b(?:\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?/i); let dueAt:string|undefined; if(due){const d=new Date(); if(/tomorrow/i.test(due[1]))d.setDate(d.getDate()+1); else if(!/today/i.test(due[1])){const days=['sun','mon','tue','wed','thu','fri','sat'], target=days.indexOf(due[1].slice(0,3).toLowerCase()); d.setDate(d.getDate()+((target-d.getDay()+7)%7||7))} if(due[2]){let h=Number(due[2]); if(due[4]?.toLowerCase()==='pm'&&h<12)h+=12;d.setHours(h,Number(due[3]||0),0,0)} else d.setHours(17,0,0,0); dueAt=d.toISOString();title=title.replace(due[0],'')} return {title:title.replace(/\s+/g,' ').trim(),priority,estimateMin,subjectId,dueAt} }
export interface TaskRepository { load():AppState; save(state:AppState):void }
export const repository:TaskRepository = {load:()=>{try{const raw=localStorage.getItem('studyflow.v1');return raw?JSON.parse(raw):initialState}catch{return initialState}},save:(state)=>{try{localStorage.setItem('studyflow.v1',JSON.stringify(state))}catch{}}}
export function scoreTask(t:Task){if(t.completed)return -1; if(!t.dueAt)return priorityWeight[t.priority]*2; const hours=(new Date(t.dueAt).getTime()-Date.now())/3600000; return priorityWeight[t.priority]*2+(hours<=0?10:Math.max(0,24-hours)/4)}
export const streak = (tasks:Task[]) => {let count=0; const d=new Date(); while(tasks.some(t=>t.completedAt&&new Date(t.completedAt).toDateString()===d.toDateString())){count++;d.setDate(d.getDate()-1)} return count}
export const paletteVariants = {indigo:{10:'#101132',80:'#5B5FC7',110:'#9AA3E9'},teal:{10:'#001A1F',80:'#0F7B8A',110:'#7EB3BD'},sunrise:{10:'#2D0700',80:'#C2410C',110:'#E99377'},classic:{10:'#1F2937',80:'#2563EB',110:'#93C5FD'}} as const
export type Palette = keyof typeof paletteVariants
export function brandRamp(p:Palette){const b=paletteVariants[p]; return {10:b[10],20:b[10],30:b[10],40:b[80],50:b[80],60:b[80],70:b[80],80:b[80],90:b[110],100:b[110],110:b[110],120:b[110],130:b[110],140:b[110],150:b[110],160:b[110]} as any}

