'use client'
import React from 'react'

interface SliderProps {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  step?: number
  label?: string
}

export default function Slider({ min, max, value, onChange, step = 1, label }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {label}
          </span>
          <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {value}px
          </span>
        </div>
      )}
      <div className="relative h-5 flex items-center">
        <div
          className="w-full h-1 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, rgba(139,92,246,0.8), rgba(59,130,246,0.8))',
              transition: 'width 0.1s ease',
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '100%' }}
        />
        <div
          className="absolute w-3.5 h-3.5 rounded-full border-2"
          style={{
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            background: 'white',
            borderColor: 'rgba(139,92,246,0.8)',
            boxShadow: '0 0 8px rgba(139,92,246,0.4)',
            pointerEvents: 'none',
            transition: 'left 0.1s ease',
          }}
        />
      </div>
    </div>
  )
}
