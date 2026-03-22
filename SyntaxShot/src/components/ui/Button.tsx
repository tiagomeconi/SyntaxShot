'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  variant = 'glass',
  size = 'md',
  className = '',
  disabled = false,
}: ButtonProps) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(59,130,246,0.9))',
      border: '1px solid rgba(139,92,246,0.3)',
      color: 'white',
    },
    ghost: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.6)',
    },
    glass: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.8)',
    },
  }

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '11px' },
    md: { padding: '8px 16px', fontSize: '12px' },
    lg: { padding: '12px 24px', fontSize: '13px' },
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: '8px',
        fontFamily: 'inherit',
        fontWeight: 500,
        letterSpacing: '0.02em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s ease',
      }}
      className={`relative overflow-hidden ${className}`}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  )
}
