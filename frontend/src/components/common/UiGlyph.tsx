import { Box } from '@mui/material'

interface UiGlyphProps {
  text: string
  title?: string
  size?: number
}

export function UiGlyph({ text, title, size = 22 }: UiGlyphProps) {
  return (
    <Box
      component="span"
      title={title}
      aria-label={title}
      sx={{
        width: size,
        height: size,
        minWidth: size,
        display: 'inline-grid',
        placeItems: 'center',
        fontSize: Math.max(11, Math.round(size * 0.55)),
        lineHeight: 1,
        fontWeight: 700,
        color: 'inherit',
        userSelect: 'none',
      }}
    >
      {text}
    </Box>
  )
}
