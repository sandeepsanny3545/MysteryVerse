import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon
}) {
  const variants = {
    default: 'bg-noir-800 text-slate-300 border-noir-700',
    easy: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
    medium: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
    hard: 'bg-crimson-950/70 text-crimson-300 border-crimson-800/80',
    crimson: 'bg-crimson-900/60 text-crimson-300 border-crimson-700/60',
    cyan: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/80',
    amber: 'bg-amber-950/70 text-amber-300 border-amber-700/60',
    purple: 'bg-purple-950/70 text-purple-300 border-purple-800/80',
    smokingGun: 'bg-red-900/80 text-red-200 border-red-500 animate-pulse font-bold'
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border shadow-sm ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
