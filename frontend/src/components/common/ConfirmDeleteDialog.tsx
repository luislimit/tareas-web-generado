import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

interface Props { open:boolean; title?:string; text:string; loading?:boolean; onCancel:()=>void; onConfirm:()=>void }
export function ConfirmDeleteDialog({open,title='Confirmar borrado',text,loading=false,onCancel,onConfirm}:Props){
 return <Dialog open={open} onClose={loading?undefined:onCancel}><DialogTitle>{title}</DialogTitle><DialogContent><DialogContentText>{text}</DialogContentText></DialogContent><DialogActions><Button onClick={onCancel} disabled={loading}>Cancelar</Button><Button color="error" variant="contained" onClick={onConfirm} disabled={loading}>Borrar</Button></DialogActions></Dialog>
}
