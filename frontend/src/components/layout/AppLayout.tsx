import {
  AppBar,
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material'
import { useState, type ReactNode } from 'react'
import { AppIcon } from '../common/AppIcon'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../../app/currentUser'

const expandedWidth = 236
const collapsedWidth = 68

const navItemSx = {
  mx: 1,
  mb: 0.5,
  minHeight: 42,
  borderRadius: 1.5,
  color: '#cbd5e1',
  '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 },
  '&.active': {
    bgcolor: 'rgba(59,130,246,.18)',
    color: '#ffffff',
    '&:hover': { bgcolor: 'rgba(59,130,246,.24)' },
  },
  '&:hover': { bgcolor: 'rgba(148,163,184,.10)' },
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [adminOpen, setAdminOpen] = useState(true)
  const location = useLocation()
  const width = collapsed ? collapsedWidth : expandedWidth
  const adminActive = location.pathname.startsWith('/admin')
  const { usuarios, currentUserId, setCurrentUserId, loading: usersLoading } = useCurrentUser()

  const item = (to: string, label: string, icon: ReactNode) => (
    <ListItemButton component={NavLink} to={to} sx={navItemSx}>
      <ListItemIcon>{icon}</ListItemIcon>
      {!collapsed && <ListItemText primary={label} />}
    </ListItemButton>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: '#ffffff',
          color: 'text.primary',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 52 }}>
          <Box sx={{ width: width - 16, display: 'flex', alignItems: 'center', transition: '.2s' }}>
            <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: 'primary.main', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>
              T
            </Box>
            {!collapsed && <Typography variant="h6" sx={{ ml: 1.25, fontSize: 16 }}>Tareas</Typography>}
          </Box>
          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>Gestión de trabajo</Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <AppIcon name="user" fontSize="small" color="action" />
            <FormControl size="small" sx={{ minWidth: 190 }}>
              <Select
                value={currentUserId}
                displayEmpty
                disabled={usersLoading || !usuarios.length}
                onChange={(e) => setCurrentUserId(String(e.target.value))}
                sx={{ height: 34, fontSize: 13 }}
                renderValue={(value) => {
                  if (!value) return 'Seleccionar usuario'
                  const u = usuarios.find((x) => String(x.id) === String(value))
                  return u ? `${u.nombre}${u.codigo ? ` (${u.codigo})` : ''}` : 'Seleccionar usuario'
                }}
              >
                {usuarios.length > 1 && <MenuItem value=""><em>Seleccionar usuario</em></MenuItem>}
                {usuarios.map((u) => <MenuItem key={u.id} value={String(u.id)}>{u.nombre}{u.codigo ? ` (${u.codigo})` : ''}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="aside"
        sx={{
          position: 'fixed', top: 52, bottom: 0, left: 0, width,
          bgcolor: '#0f172a', color: '#fff', transition: 'width .2s', overflowX: 'hidden',
          borderRight: '1px solid #111827',
        }}
      >
        <List dense sx={{ pt: 1.25 }}>
          {item('/', 'Inicio', <AppIcon name="home" fontSize="small" />)}
          {item('/peticiones', 'Peticiones', <AppIcon name="tasks" fontSize="small" />)}
          {item('/imputaciones', 'Imputaciones', <AppIcon name="time" fontSize="small" />)}
          {item('/documentos', 'Documentos', <AppIcon name="book" fontSize="small" />)}

          <ListItemButton
            onClick={() => !collapsed && setAdminOpen((v) => !v)}
            sx={{ ...navItemSx, color: adminActive ? '#fff' : '#cbd5e1' }}
          >
            <ListItemIcon><AppIcon name="tools" fontSize="small" /></ListItemIcon>
            {!collapsed && <><ListItemText primary="Administración" />{adminOpen ? <AppIcon name="chevronUp" fontSize="small" /> : <AppIcon name="chevronDown" fontSize="small" />}</>}
          </ListItemButton>
          {!collapsed && (
            <Collapse in={adminOpen} timeout="auto" unmountOnExit>
              <List dense disablePadding sx={{ pl: 2 }}>
                {item('/admin/categorias', 'Categorías', <AppIcon name="category" fontSize="small" />)}
                {item('/admin/subcategorias', 'Subcategorías', <AppIcon name="subcategory" fontSize="small" />)}
                {item('/admin/estados', 'Estados', <AppIcon name="state" fontSize="small" />)}
                {item('/admin/estados-horas', 'Estados horas', <AppIcon name="stateTime" fontSize="small" />)}
                {item('/admin/usuarios', 'Usuarios', <AppIcon name="users" fontSize="small" />)}
                {item('/admin/tipos-documento', 'Tipos documento', <AppIcon name="documentType" fontSize="small" />)}
              </List>
            </Collapse>
          )}
          {item('/configuracion', 'Configuración', <AppIcon name="settings" fontSize="small" />)}
        </List>

        <Tooltip title={collapsed ? 'Expandir menú' : 'Contraer menú'} placement="right">
          <IconButton
            onClick={() => setCollapsed((v) => !v)}
            size="small"
            sx={{ position: 'absolute', right: 12, bottom: 14, color: '#94a3b8', bgcolor: 'rgba(255,255,255,.05)' }}
          >
            {collapsed ? <AppIcon name="chevronRight" fontSize="small" /> : <AppIcon name="chevronLeft" fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box component="main" sx={{ ml: `${width}px`, pt: '52px', transition: 'margin-left .2s' }}>
        <Box sx={{ p: 2.5, minWidth: 900 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
