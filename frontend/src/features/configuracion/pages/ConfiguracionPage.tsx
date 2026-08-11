import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Stack, Switch, Typography } from '@mui/material'
import { PageHeader } from '../../../components/layout/PageHeader'
import { UiGlyph } from '../../../components/common/UiGlyph'

export function ConfiguracionPage() {
  return <Box>
    <PageHeader title="Configuración" subtitle="Preferencias de presentación de la aplicación" />
    <Stack spacing={1.5} sx={{ maxWidth: 760 }}>
      <Paper variant="outlined" sx={{ p: 2 }}><Stack direction="row" spacing={1.5} alignItems="center"><UiGlyph text="D" title="Densidad" /><Box sx={{flex:1}}><Typography fontWeight={600}>Densidad de tablas</Typography><Typography variant="body2" color="text.secondary">La vista compacta es la recomendada para el uso Desktop First.</Typography></Box><FormControl size="small" sx={{width:160}}><InputLabel>Densidad</InputLabel><Select label="Densidad" value="compact"><MenuItem value="compact">Compacta</MenuItem><MenuItem value="standard">Normal</MenuItem></Select></FormControl></Stack></Paper>
      <Paper variant="outlined" sx={{ p: 2 }}><Stack direction="row" spacing={1.5} alignItems="center"><UiGlyph text="T" title="Tema" /><Box sx={{flex:1}}><Typography fontWeight={600}>Tema</Typography><Typography variant="body2" color="text.secondary">En esta fase se mantiene el tema claro profesional definido para Tareas.</Typography></Box><FormControl size="small" sx={{width:160}}><InputLabel>Tema</InputLabel><Select label="Tema" value="light"><MenuItem value="light">Claro</MenuItem></Select></FormControl></Stack></Paper>
      <Paper variant="outlined" sx={{ p: 2 }}><Stack direction="row" spacing={1.5} alignItems="center"><UiGlyph text="C" title="Configuración" /><Box sx={{flex:1}}><Typography fontWeight={600}>Recordar contexto</Typography><Typography variant="body2" color="text.secondary">Preparado para persistir filtros, columnas, pestañas y último contexto de trabajo cuando el backend exponga preferencias.</Typography></Box><FormControlLabel control={<Switch checked disabled />} label="Activo"/></Stack></Paper>
    </Stack>
  </Box>
}
