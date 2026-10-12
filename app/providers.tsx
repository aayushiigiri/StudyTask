'use client'
import * as React from 'react'
import { FluentProvider, createLightTheme, createDarkTheme, SSRProvider, RendererProvider, createDOMRenderer, renderToStyleElements } from '@fluentui/react-components'
import { useServerInsertedHTML } from 'next/navigation'
import { brandRamp, Palette } from '@/lib/types'
export const ThemeContext=React.createContext({mode:'system' as 'light'|'dark'|'system',palette:'indigo' as Palette,setMode:(_: 'light'|'dark'|'system')=>{},setPalette:(_: Palette)=>{}})
export function useTheme(){return React.useContext(ThemeContext)}
export const useThemeMode = useTheme
export function Providers({children}:{children:React.ReactNode}){
 const [renderer]=React.useState(()=>createDOMRenderer()); const did=React.useRef(false)
 const [mode,setMode]=React.useState<'light'|'dark'|'system'>('system'); const [palette,setPalette]=React.useState<Palette>('indigo')
 React.useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('studyflow.theme')||'null');if(saved?.mode)setMode(saved.mode);if(saved?.palette)setPalette(saved.palette)}catch{}},[])
 React.useEffect(()=>{try{localStorage.setItem('studyflow.theme',JSON.stringify({mode,palette}))}catch{}},[mode,palette])
 React.useEffect(()=>{if(mode!=='system')return;const media=window.matchMedia('(prefers-color-scheme: dark)');const update=()=>setSystemDark(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[mode])
 const [systemDark,setSystemDark]=React.useState(false)
 const dark=mode==='dark'||(mode==='system'&&systemDark)
 const theme=dark?createDarkTheme(brandRamp(palette)):createLightTheme(brandRamp(palette))
 useServerInsertedHTML(()=>{if(did.current)return;did.current=true;return <>{renderToStyleElements(renderer)}</>})
 return <RendererProvider renderer={renderer}><SSRProvider><ThemeContext.Provider value={{mode,palette,setMode,setPalette}}><FluentProvider theme={theme} id="__fluent-root" suppressHydrationWarning>{children}</FluentProvider></ThemeContext.Provider></SSRProvider></RendererProvider>
}
