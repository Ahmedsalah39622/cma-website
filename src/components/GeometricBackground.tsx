'use client';

import React from 'react';

type PatternType = 'waves' | 'grid' | 'circles' | 'dots' | 'lines' | 'mesh' | 'hexagon' | 'marketing';

interface GeometricBackgroundProps {
    pattern?: PatternType;
    position?: 'left' | 'right' | 'center' | 'full';
    opacity?: number;
    color?: string;
    className?: string;
}

const GeometricBackground: React.FC<GeometricBackgroundProps> = ({
    pattern = 'waves',
    position = 'right',
    opacity = 0.03,
    color = '#000',
    className = '',
}) => {
    const positionClasses = {
        left: 'left-0 top-0 w-1/2 h-full',
        right: 'right-0 top-0 w-1/2 h-full',
        center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4',
        full: 'inset-0 w-full h-full',
    };

    const renderPattern = () => {
        switch (pattern) {
            case 'waves':
                return (
                    <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="w-full h-full">
                        {[...Array(12)].map((_, i) => (
                            <path
                                key={i}
                                d={`M0 200 Q 100 ${i * 10} 200 200`}
                                fill="none"
                                stroke={color}
                                strokeWidth="0.4"
                            />
                        ))}
                        {[...Array(4)].map((_, i) => (
                            <path
                                key={`cross-${i}`}
                                d={`M${200 - i * 20} 0 Q ${-i * 20} 100 ${200 - i * 20} 200`}
                                fill="none"
                                stroke={color}
                                strokeWidth="0.4"
                            />
                        ))}
                    </svg>
                );

            case 'grid':
                return (
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        {/* Vertical lines */}
                        {[...Array(20)].map((_, i) => (
                            <line
                                key={`v-${i}`}
                                x1={i * 5}
                                y1="0"
                                x2={i * 5}
                                y2="100"
                                stroke={color}
                                strokeWidth="0.15"
                            />
                        ))}
                        {/* Horizontal lines */}
                        {[...Array(20)].map((_, i) => (
                            <line
                                key={`h-${i}`}
                                x1="0"
                                y1={i * 5}
                                x2="100"
                                y2={i * 5}
                                stroke={color}
                                strokeWidth="0.15"
                            />
                        ))}
                        {/* Diagonal accent lines */}
                        <line x1="0" y1="0" x2="100" y2="100" stroke={color} strokeWidth="0.3" />
                        <line x1="100" y1="0" x2="0" y2="100" stroke={color} strokeWidth="0.3" />
                    </svg>
                );

            case 'circles':
                return (
                    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                        {[...Array(8)].map((_, i) => (
                            <circle
                                key={i}
                                cx="100"
                                cy="100"
                                r={15 + i * 12}
                                fill="none"
                                stroke={color}
                                strokeWidth="0.5"
                            />
                        ))}
                        {/* Decorative dots */}
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const radius = 60;
                            return (
                                <circle
                                    key={`dot-${i}`}
                                    cx={100 + Math.cos(angle) * radius}
                                    cy={100 + Math.sin(angle) * radius}
                                    r="2"
                                    fill={color}
                                />
                            );
                        })}
                    </svg>
                );

            case 'dots':
                return (
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        {[...Array(10)].map((_, row) =>
                            [...Array(10)].map((_, col) => (
                                <circle
                                    key={`${row}-${col}`}
                                    cx={5 + col * 10}
                                    cy={5 + row * 10}
                                    r="1"
                                    fill={color}
                                />
                            ))
                        )}
                    </svg>
                );

            case 'lines':
                return (
                    <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="w-full h-full">
                        {/* Diagonal lines going one direction */}
                        {[...Array(15)].map((_, i) => (
                            <line
                                key={`d1-${i}`}
                                x1={i * 15}
                                y1="0"
                                x2={i * 15 + 200}
                                y2="200"
                                stroke={color}
                                strokeWidth="0.4"
                            />
                        ))}
                        {/* Diagonal lines going opposite direction */}
                        {[...Array(15)].map((_, i) => (
                            <line
                                key={`d2-${i}`}
                                x1={200 - i * 15}
                                y1="0"
                                x2={-i * 15}
                                y2="200"
                                stroke={color}
                                strokeWidth="0.4"
                            />
                        ))}
                    </svg>
                );

            case 'mesh':
                return (
                    <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="w-full h-full">
                        {/* Curved mesh lines */}
                        {[...Array(8)].map((_, i) => (
                            <React.Fragment key={i}>
                                <path
                                    d={`M0 ${i * 25} Q 100 ${i * 25 + 50} 200 ${i * 25}`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="0.4"
                                />
                                <path
                                    d={`M${i * 25} 0 Q ${i * 25 + 50} 100 ${i * 25} 200`}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="0.4"
                                />
                            </React.Fragment>
                        ))}
                    </svg>
                );

            case 'hexagon':
                return (
                    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
                        {[...Array(5)].map((_, row) =>
                            [...Array(4)].map((_, col) => {
                                const x = 25 + col * 50 + (row % 2 === 0 ? 0 : 25);
                                const y = 20 + row * 35;
                                const size = 20;
                                return (
                                    <polygon
                                        key={`${row}-${col}`}
                                        points={`
                                            ${x},${y - size}
                                            ${x + size * 0.866},${y - size / 2}
                                            ${x + size * 0.866},${y + size / 2}
                                            ${x},${y + size}
                                            ${x - size * 0.866},${y + size / 2}
                                            ${x - size * 0.866},${y - size / 2}
                                        `}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="0.5"
                                    />
                                );
                            })
                        )}
                    </svg>
                );

            case 'marketing':
                return (
                    <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="w-full h-full">
                        <style>
                            {`
                                @keyframes growBar {
                                    0% { transform: scaleY(0); opacity: 0; }
                                    100% { transform: scaleY(1); opacity: 1; }
                                }
                                .marketing-bar {
                                    transform-origin: bottom center;
                                    transform-box: fill-box;
                                    animation: growBar 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                                    opacity: 0;
                                }
                            `}
                        </style>

                        {/* 3D Isometric Bar Chart */}

                        {/* Bar 1 (Left) */}
                        <g className="marketing-bar" style={{ animationDelay: '0.2s' }}>
                            {/* Top Face */}
                            <path d="M40 130 L60 120 L80 130 L60 140 Z" fill={color} fillOpacity="0.4" stroke="none" />
                            {/* Side Face (Right) */}
                            <path d="M80 130 L80 170 L60 180 L60 140 Z" fill={color} fillOpacity="0.3" stroke="none" />
                            {/* Front Face (Left) */}
                            <path d="M40 130 L60 140 L60 180 L40 170 Z" fill={color} fillOpacity="0.2" stroke="none" />
                        </g>

                        {/* Bar 2 (Middle) - Taller */}
                        <g className="marketing-bar" style={{ animationDelay: '0.4s' }}>
                            {/* Top Face */}
                            <path d="M90 100 L110 90 L130 100 L110 110 Z" fill={color} fillOpacity="0.6" stroke="none" />
                            {/* Side Face (Right) */}
                            <path d="M130 100 L130 160 L110 170 L110 110 Z" fill={color} fillOpacity="0.5" stroke="none" />
                            {/* Front Face (Left) */}
                            <path d="M90 100 L110 110 L110 170 L90 160 Z" fill={color} fillOpacity="0.4" stroke="none" />
                        </g>

                        {/* Bar 3 (Right) - Tallest */}
                        <g className="marketing-bar" style={{ animationDelay: '0.6s' }}>
                            {/* Top Face */}
                            <path d="M140 60 L160 50 L180 60 L160 70 Z" fill={color} fillOpacity="0.8" stroke="none" />
                            {/* Side Face (Right) */}
                            <path d="M180 60 L180 150 L160 160 L160 70 Z" fill={color} fillOpacity="0.7" stroke="none" />
                            {/* Front Face (Left) */}
                            <path d="M140 60 L160 70 L160 160 L140 150 Z" fill={color} fillOpacity="0.6" stroke="none" />
                        </g>

                        {/* Optional Grid/Platform base for context can be added here if needed, keeping it clean for now */}
                    </svg>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className={`absolute pointer-events-none ${positionClasses[position]} ${className}`}
            style={{ opacity }}
        >
            {renderPattern()}
        </div>
    );
};

export default GeometricBackground;
