import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Renders textbook-grade mathematical expressions using KaTeX.
 * Supports both display (block) and inline modes with graceful fallback.
 */
export function MathView({ math = '', display = false, inline = false, className = '' }) {
  const isDisplay = display && !inline;
  const html = useMemo(() => {
    if (!math || typeof math !== 'string') return '';
    try {
      return katex.renderToString(math, {
        displayMode: isDisplay,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return `<span class="font-mono text-xs">${math}</span>`;
    }
  }, [math, isDisplay]);

  if (isDisplay) {
    return (
      <div
        className={`math-block py-2 overflow-x-auto text-slate-900 select-all ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-inline select-all ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
