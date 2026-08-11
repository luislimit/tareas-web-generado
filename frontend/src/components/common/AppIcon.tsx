import { SvgIcon, type SvgIconProps } from '@mui/material'

export type AppIconName =
  | 'home' | 'tasks' | 'time' | 'book' | 'tools' | 'settings'
  | 'category' | 'subcategory' | 'state' | 'stateTime' | 'users' | 'documentType'
  | 'edit' | 'delete' | 'changeState' | 'history' | 'add' | 'close'
  | 'chevronLeft' | 'chevronRight' | 'chevronUp' | 'chevronDown'
  | 'pending' | 'calendarWeek' | 'calendarMonth' | 'warning' | 'user'

interface Props extends SvgIconProps { name: AppIconName }

export function AppIcon({ name, ...props }: Props) {
  switch (name) {
    case 'home':
      return <SvgIcon {...props}><path d="M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5.5v-7h-5v7H4a1 1 0 0 1-1-1V10.8Zm2 1V20h2.5v-7h9v7H19v-8.2l-7-6.1-7 6.1Z"/></SvgIcon>
    case 'tasks':
      return <SvgIcon {...props}><path d="M8 3h8l1 2h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2l1-2Zm1.2 2-.5 1H5v14h14V7h-3.7l-.5-1H9.2ZM7.5 10.2l1.4 1.4 2.8-3 1.1 1-3.9 4.1-2.5-2.5 1.1-1Zm6.5.3h3v1.5h-3v-1.5Zm-6.5 5.2 1.4 1.4 2.8-3 1.1 1-3.9 4.1-2.5-2.5 1.1-1Zm6.5.3h3v1.5h-3V16Z"/></SvgIcon>
    case 'time':
      return <SvgIcon {...props}><path d="M6 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V2h-2v2H8V2H6Zm13 8v10H5V10h14Zm-7 1.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm.8 1.8v2.5l1.8 1.1-.8 1.3-2.5-1.6v-3.3h1.5Z"/></SvgIcon>
    case 'book':
      return <SvgIcon {...props}><path d="M4 3h6.2c1 0 1.8.3 2.8 1.1C14 3.3 14.8 3 15.8 3H20a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-4.2c-1 0-1.8.3-2.8 1.1-1-.8-1.8-1.1-2.8-1.1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v13h5.2c.7 0 1.2.1 1.8.4V6c-.6-.7-1.1-1-1.8-1H5Zm9 1v12.4c.6-.3 1.1-.4 1.8-.4H19V5h-3.2c-.7 0-1.2.3-1.8 1Z"/></SvgIcon>
    case 'tools':
      return <SvgIcon {...props}><path d="M14.7 6.2a5 5 0 0 0-6.4 6.4L3 17.9V21h3.1l5.3-5.3a5 5 0 0 0 6.4-6.4l-3 3-2.1-.6-.6-2.1 2.6-2.6Zm-8 12.8H5v-1.7l4.5-4.5.9.9L6.7 19ZM17 3l4 4-1.4 1.4-4-4L17 3Zm-3.2 12.2 1.4-1.4 5.8 5.8L19.6 21l-5.8-5.8Z"/></SvgIcon>
    case 'settings':
      return <SvgIcon {...props}><path d="m9.7 2-.5 2a8 8 0 0 0-1.5.9L5.8 4.3 4.3 5.8l.6 1.9A8 8 0 0 0 4 9.2l-2 .5v2.1l2 .5a8 8 0 0 0 .9 1.5l-.6 1.9 1.5 1.5 1.9-.6a8 8 0 0 0 1.5.9l.5 2h2.1l.5-2a8 8 0 0 0 1.5-.9l1.9.6 1.5-1.5-.6-1.9a8 8 0 0 0 .9-1.5l2-.5V9.7l-2-.5a8 8 0 0 0-.9-1.5l.6-1.9-1.5-1.5-1.9.6a8 8 0 0 0-1.5-.9l-.5-2H9.7ZM10.8 6h.4a5 5 0 1 1-.4 0Zm.2 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></SvgIcon>
    case 'category':
      return <SvgIcon {...props}><path d="M3 5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm2 2v11h14V7h-7.8l-2-2H5v2Z"/></SvgIcon>
    case 'subcategory':
      return <SvgIcon {...props}><path d="M5 3h6v5H5V3Zm8 13h6v5h-6v-5ZM5 16h6v5H5v-5Zm3-8v4h8v2H7a1 1 0 0 1-1-1V8h2Zm8 4v4h-2v-4h2Z"/></SvgIcon>
    case 'state':
      return <SvgIcon {...props}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 4h2v5h-2V8Zm0 7h2v2h-2v-2Z"/></SvgIcon>
    case 'stateTime':
      return <SvgIcon {...props}><path d="M12 2a10 10 0 1 0 9.8 12h-2.1A8 8 0 1 1 18 7.1V10h2V3h-7v2h3.3A9.9 9.9 0 0 0 12 2Zm-1 5h2v5.2l3.2 1.9-1 1.7-4.2-2.6V7Z"/></SvgIcon>
    case 'users':
      return <SvgIcon {...props}><path d="M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm7.5 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM9 13c4 0 7 2 7 5v3H2v-3c0-3 3-5 7-5Zm0 2c-2.9 0-5 1.3-5 3v1h10v-1c0-1.7-2.1-3-5-3Zm7.5-.8c3.1 0 5.5 1.7 5.5 4.3V21h-4v-2h2v-.5c0-1.2-1.4-2.1-3.5-2.3v-2Z"/></SvgIcon>
    case 'documentType':
      return <SvgIcon {...props}><path d="M5 2h9l5 5v15H5V2Zm2 2v16h10V8h-4V4H7Zm8 .8V6h1.2L15 4.8ZM9 11h6v2H9v-2Zm0 4h6v2H9v-2Z"/></SvgIcon>
    case 'edit':
      return <SvgIcon {...props}><path d="m4 16.5-.8 4.3 4.3-.8L18.8 8.7l-3.5-3.5L4 16.5Zm12.7-12.7 1.4-1.4a1.4 1.4 0 0 1 2 0l1.5 1.5a1.4 1.4 0 0 1 0 2l-1.4 1.4-3.5-3.5Z"/></SvgIcon>
    case 'delete':
      return <SvgIcon {...props}><path d="M8 3h8l1 2h4v2H3V5h4l1-2Zm-2 6h12l-1 12H7L6 9Zm3 2 .5 8h1.7l-.2-8H9Zm4 0-.2 8h1.7l.5-8h-2Z"/></SvgIcon>
    case 'changeState':
      return <SvgIcon {...props}><path d="M7 5h10.2l-2.6-2.6L16 1l5 5-5 5-1.4-1.4L17.2 7H7a3 3 0 0 0-3 3v1H2v-1a5 5 0 0 1 5-5Zm10 14H6.8l2.6 2.6L8 23l-5-5 5-5 1.4 1.4L6.8 17H17a3 3 0 0 0 3-3v-1h2v1a5 5 0 0 1-5 5Z"/></SvgIcon>
    case 'history':
      return <SvgIcon {...props}><path d="M12 3a9 9 0 0 0-8.5 6H1l3.5 4L8 9H5.7A7 7 0 1 1 5 15H3a9 9 0 1 0 9-12Zm-1 4h2v5.2l3.2 1.9-1 1.7-4.2-2.6V7Z"/></SvgIcon>
    case 'add':
      return <SvgIcon {...props}><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z"/></SvgIcon>
    case 'close':
      return <SvgIcon {...props}><path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z"/></SvgIcon>
    case 'pending':
      return <SvgIcon {...props}><path d="M4 4h16v16H4V4Zm2 2v12h12V6H6Zm2 2h5v2H8V8Zm0 4h8v2H8v-2Zm0 4h6v2H8v-2Z"/></SvgIcon>
    case 'calendarWeek':
      return <SvgIcon {...props}><path d="M6 2v2H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2h-1V2h-2v2H8V2H6Zm13 8v8H5v-8h14ZM7 12h3v2H7v-2Zm4 0h3v2h-3v-2Zm4 0h2v2h-2v-2Zm-8 3h3v2H7v-2Zm4 0h3v2h-3v-2Z"/></SvgIcon>
    case 'calendarMonth':
      return <SvgIcon {...props}><path d="M6 2v2H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2h-1V2h-2v2H8V2H6Zm13 8v8H5v-8h14ZM7 12h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-8 3h2v2H7v-2Zm4 0h2v2h-2v-2Zm4 0h2v2h-2v-2Z"/></SvgIcon>
    case 'warning':
      return <SvgIcon {...props}><path d="M12 3 2 21h20L12 3Zm0 4 6.6 12H5.4L12 7Zm-1 3v5h2v-5h-2Zm0 7v2h2v-2h-2Z"/></SvgIcon>
    case 'user':
      return <SvgIcon {...props}><path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 10c5 0 9 2.5 9 6v2H3v-2c0-3.5 4-6 9-6Zm0 2c-3.8 0-7 1.7-7 4h14c0-2.3-3.2-4-7-4Z"/></SvgIcon>
    case 'chevronLeft': return <SvgIcon {...props}><path d="m15.5 5-7 7 7 7 1.5-1.5-5.5-5.5L17 6.5 15.5 5Z"/></SvgIcon>
    case 'chevronRight': return <SvgIcon {...props}><path d="m8.5 5 7 7-7 7L7 17.5l5.5-5.5L7 6.5 8.5 5Z"/></SvgIcon>
    case 'chevronUp': return <SvgIcon {...props}><path d="m5 15.5 7-7 7 7-1.5 1.5-5.5-5.5L6.5 17 5 15.5Z"/></SvgIcon>
    case 'chevronDown': return <SvgIcon {...props}><path d="m5 8.5 7 7 7-7L17.5 7 12 12.5 6.5 7 5 8.5Z"/></SvgIcon>
  }
}
