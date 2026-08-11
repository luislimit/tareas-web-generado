import { Box, MenuItem } from '@mui/material'
import type { MenuItemProps } from '@mui/material'
import type { ReactNode } from 'react'

interface Props extends Omit<MenuItemProps, 'value' | 'children' | 'sx'> {
  value: string
  selected: boolean
  children: ReactNode
}

export function MultiSelectMenuItem({ value, selected, children, ...menuItemProps }: Props) {
  return (
    <MenuItem
      {...menuItemProps}
      value={value}
      selected={selected}
      sx={{
        gap: 1,
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          width: 18,
          minWidth: 18,
          display: 'inline-flex',
          justifyContent: 'center',
          fontWeight: 800,
        }}
      >
        {selected ? '✓' : ''}
      </Box>
      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {children}
      </Box>
    </MenuItem>
  )
}
