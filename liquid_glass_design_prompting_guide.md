# Guía Directiva y Master Prompt: Estilo "Liquid Glass" en React

Esta guía define las especificaciones técnicas, estéticas y arquitectónicas para construir componentes de interfaz bajo el estilo **Liquid Glass** utilizando **React**, **Tailwind CSS**, **Framer Motion** y **Filtros SVG de Refracción**.

---

## 1. Conceptos Fundamentales de Liquid Glass

Diferencias clave frente al *Glassmorphism* convencional:

| Característica | Glassmorphism Clásico | Liquid Glass |
| :--- | :--- | :--- |
| **Fondo** | Blur estático + Opacidad baja | Blur multinivel + Refracción fluida |
| **Bordes** | Borde de 1px blanco semi-transparente | Bisel óptico, reflejos direccionales y aberración cromática |
| **Saturación** | Normal / Elevada | Elevada (`saturate(180%) contrast(105%)`) con dispersión de luz |
| **Interacción** | Hover suave o escala | Física fluida (*springs*), deformación visual al arrastrar o pulsar |
| **Física Visual** | Plana | Sensación de volumen esférico o lente líquida flotante |

---

## 2. Tokens de Diseño y Reglas CSS / Tailwind

### 2.1. Filtro de Refracción Líquida (SVG Filter)
Para lograr la distorsión orgánica del fondo sin WebGL pesado, se utiliza un filtro SVG inyectado en el DOM:

```html
<svg class="sr-only">
  <defs>
    <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
      <feGaussianBlur in="displaced" stdDeviation="1" result="blurred" />
      <feBlend in="SourceGraphic" in2="blurred" mode="overlay" />
    </filter>
  </defs>
</svg>
```

### 2.2. Capas y Estilos Visuales (CSS / Tailwind)
Un contenedor Liquid Glass perfecto consta de 3 capas superpuestas:

1. **Capa Base Translúcida:**
   - `background: rgba(255, 255, 255, 0.08)` (Modo oscuro) o `rgba(255, 255, 255, 0.4)` (Modo claro).
   - `backdrop-filter: blur(16px) saturate(180%) contrast(105%)`.

2. **Borde Biselado e Iluminación Especular:**
   - `border: 1px solid rgba(255, 255, 255, 0.25)`.
   - `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -1px 2px rgba(0, 0, 0, 0.2), 0 12px 32px rgba(0, 0, 0, 0.12)`.

3. **Reflejo de Borde (Edge Lensing):**
   - Un degradado radial superior o pseudoelemento `::before` con un destello blanco opaco muy tenue (`linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`).

---

## 3. Implementación de Referencia en React

```tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  enableRefraction?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = "",
  enableRefraction = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group p-[1px] rounded-3xl overflow-hidden backdrop-gpu">
      {/* SVG Refraction Filter Def (Renderizado una sola vez o global) */}
      {enableRefraction && (
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <filter id="liquid-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={isHovered ? "18" : "8"}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* Resplandor exterior adaptativo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Contenedor Cristal Líquido */}
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.015, y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`relative z-10 rounded-3xl border border-white/30 dark:border-white/15 bg-white/10 dark:bg-black/20 backdrop-blur-2xl backdrop-saturate-180 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_20px_40px_rgba(0,0,0,0.2)] p-6 transition-all duration-300 ${className}`}
        style={{
          backdropFilter: enableRefraction
            ? "blur(20px) saturate(190%) contrast(105%) url(#liquid-filter)"
            : "blur(20px) saturate(190%)",
        }}
      >
        {/* Destello de luz biselado en la esquina superior */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Contenido */}
        <div className="relative z-20 text-slate-800 dark:text-slate-100">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
```

---

## 4. Master Prompt para Generar Componentes Liquid Glass con Inteligencia Artificial

> **Instrucciones para la IA:** Copia y pega la caja de texto inferior como prompt de sistema o instrucción para cualquier IA desarrolladora.

```text
Actúa como un Ingeniero Senior de UI/UX especializado en interfaces de vanguardia con React, Tailwind CSS y Framer Motion. 

Tu objetivo es crear componentes en el estilo visual "Liquid Glass" (Glassmorphism fluido con refracción óptica).

REGLAS OBLIGATORIAS DE DISEÑO Y CÓDIGO:
1. ESTÉTICA VISUAL:
   - Aplica un fondo translúcido con alta saturación (`backdrop-blur-xl`, `backdrop-saturate-180`).
   - Añade un doble resplandor/sombra interna (`shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_20px_50px_rgba(0,0,0,0.25)]`).
   - Diseña bordes biselados usando gradientes sutiles semi-transparentes (`border-white/30`).
   - Incorpora una capa de refracción líquida usando un filtro SVG con `<feTurbulence>` y `<feDisplacementMap>` para dar la ilusión de líquido o cristal grueso flotante.

2. ANIMACIONES Y FÍSICA:
   - Utiliza Framer Motion con física de resortes (`type: "spring", stiffness: 300, damping: 20`).
   - Las interacciones de hover o clic deben distorsionar ligeramente la refracción o modificar el bisel luminoso.

3. ESTÁNDARES TÉCNICOS:
   - Código escrito en TypeScript (`.tsx`) limpio y reusable.
   - Totalmente responsivo y compatible con Modo Claro/Oscuro.
   - Garantiza accesibilidad (contraste de texto WCAG AA) y optimización mediante aceleración GPU (`backdrop-gpu` / `will-change-transform`).
   - Incluye fallback para navegadores o dispositivos que prefieran reducir el movimiento (`prefers-reduced-motion`).

POR FAVOR, CREA EL SIGUIENTE COMPONENTE EN STYLE LIQUID GLASS:
[Insertar aquí la descripción del componente deseado, ej: "Un menú de navegación flotante estilo Dock / Navbar", "Un cuadro de diálogo modal de confirmación", "Una tarjeta de analíticas con gráfico interactivo"].
```