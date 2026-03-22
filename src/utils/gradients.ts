export interface Gradient {
  id: string
  name: string
  value: string
  preview: string
}

export const gradients: Gradient[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    preview: 'from-[#0f0c29] via-[#302b63] to-[#24243e]',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    value: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a4a 30%, #0d3b2e 60%, #1a2a0d 100%)',
    preview: '',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    value: 'linear-gradient(135deg, #1a0533 0%, #4a0e3c 40%, #8b1a4a 70%, #c4472a 100%)',
    preview: '',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    value: 'linear-gradient(135deg, #0a1628 0%, #0e2a4a 40%, #0a3d62 70%, #0e5b8a 100%)',
    preview: '',
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    value: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #1e2a4a 60%, #0a1a3a 100%)',
    preview: '',
  },
  {
    id: 'volcanic',
    name: 'Volcanic',
    value: 'linear-gradient(135deg, #1a0a00 0%, #3d1500 40%, #5c2000 70%, #2d0a00 100%)',
    preview: '',
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    value: 'linear-gradient(135deg, #0a1a0a 0%, #0a2a1a 30%, #0a1a2a 60%, #1a0a2a 100%)',
    preview: '',
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    value: 'linear-gradient(135deg, #1a0a14 0%, #2e1020 40%, #3d1530 70%, #1a0a1a 100%)',
    preview: '',
  },
  {
    id: 'void',
    name: 'Void',
    value: 'linear-gradient(135deg, #050508 0%, #0a0a12 50%, #050508 100%)',
    preview: '',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    value: 'linear-gradient(135deg, #0d0221 0%, #1a0a3d 30%, #0d1a3d 60%, #210d30 100%)',
    preview: '',
  },
]

export const gradientColors: Record<string, string[]> = {
  midnight: ['#0f0c29', '#302b63', '#24243e'],
  aurora: ['#0d1b2a', '#1a3a4a', '#0d3b2e'],
  sunset: ['#1a0533', '#4a0e3c', '#c4472a'],
  ocean: ['#0a1628', '#0e2a4a', '#0e5b8a'],
  'cotton-candy': ['#1a0a2e', '#2d1b4e', '#0a1a3a'],
  volcanic: ['#1a0a00', '#3d1500', '#5c2000'],
  'northern-lights': ['#0a1a0a', '#0a2a1a', '#1a0a2a'],
  'rose-quartz': ['#1a0a14', '#2e1020', '#1a0a1a'],
  void: ['#050508', '#0a0a12', '#050508'],
  nebula: ['#0d0221', '#1a0a3d', '#0d1a3d'],
}
