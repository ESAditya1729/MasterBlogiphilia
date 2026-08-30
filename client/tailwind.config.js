/** @type {import('tailwindcss').Config} */
const textStroke = require('tailwindcss-text-stroke');
const typography = require('@tailwindcss/typography');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      typography: (theme) => ({
        // Base is applied to everything; dark-mode uses .dark .prose-invert via css vars
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(var(--article-ink) / 1)',
            fontFamily: theme('fontFamily.sans'),
            '--tw-prose-body': 'rgb(var(--article-ink) / 1)',
            '--tw-prose-headings': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-lead': 'rgb(var(--article-ink) / 0.85)',
            '--tw-prose-links': 'rgb(var(--article-link) / 1)',
            '--tw-prose-bold': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-counters': 'rgb(var(--article-muted) / 1)',
            '--tw-prose-bullets': 'rgb(var(--article-muted) / 1)',
            '--tw-prose-hr': 'rgb(var(--article-border) / 1)',
            '--tw-prose-quotes': 'rgb(var(--article-ink) / 1)',
            '--tw-prose-quote-borders': 'rgb(var(--article-accent) / 1)',
            '--tw-prose-captions': 'rgb(var(--article-muted) / 1)',
            '--tw-prose-code': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-pre-code': 'rgb(var(--article-pre-ink) / 1)',
            '--tw-prose-pre-bg': 'rgb(var(--article-pre-bg) / 1)',
            '--tw-prose-th-borders': 'rgb(var(--article-border) / 1)',
            '--tw-prose-td-borders': 'rgb(var(--article-border-soft) / 1)',
            '--tw-prose-invert-body': 'rgb(var(--article-ink) / 1)',
            '--tw-prose-invert-headings': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-invert-lead': 'rgb(var(--article-ink) / 0.85)',
            '--tw-prose-invert-links': 'rgb(var(--article-link) / 1)',
            '--tw-prose-invert-bold': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-invert-counters': 'rgb(var(--article-muted) / 1)',
            '--tw-prose-invert-bullets': 'rgb(var(--article-muted) / 1)',
            '--tw-prose-invert-hr': 'rgb(var(--article-border) / 1)',
            '--tw-prose-invert-quotes': 'rgb(var(--article-ink) / 1)',
            '--tw-prose-invert-quote-borders': 'rgb(var(--article-accent) / 1)',
            '--tw-prose-invert-captions': 'rgb(var(--article-muted) / 1)',
            '--tw-prose-invert-code': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-invert-pre-code': 'rgb(var(--article-pre-ink) / 1)',
            '--tw-prose-invert-pre-bg': 'rgb(var(--article-pre-bg) / 1)',
            '--tw-prose-invert-th-borders': 'rgb(var(--article-border) / 1)',
            '--tw-prose-invert-td-borders': 'rgb(var(--article-border-soft) / 1)',
            lineHeight: 1.75,
            fontSize: '1.0625rem',
            // Headings
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: theme('fontFamily.serif'),
              fontWeight: '600',
              letterSpacing: '-0.02em',
              scrollMarginTop: '5rem',
            },
            h1: { fontSize: '2.25rem', lineHeight: '1.2' },
            h2: { fontSize: '1.875rem', lineHeight: '1.3' },
            h3: { fontSize: '1.5rem', lineHeight: '1.4' },
            h4: { fontSize: '1.25rem' },
            // Links
            a: {
              color: 'rgb(var(--article-link) / 1)',
              fontWeight: '500',
              textDecoration: 'underline',
              textDecorationColor: 'rgb(var(--article-link) / 0.4)',
              textUnderlineOffset: '4px',
              transition: 'color 0.15s ease',
            },
            'a:hover': {
              color: 'rgb(var(--article-link-hover) / 1)',
              textDecorationColor: 'rgb(var(--article-link-hover) / 1)',
            },
            strong: { fontWeight: '700' },
            // Blockquote
            blockquote: {
              fontWeight: '500',
              fontStyle: 'normal',
              quotes: 'none',
              borderInlineStartWidth: '0.25rem',
              borderInlineStartColor: 'rgb(var(--article-accent) / 1)',
              paddingInlineStart: '1.25rem',
              backgroundColor: 'rgb(var(--article-quote-bg) / 0.45)',
              borderRadius: '0.5rem',
              p: { padding: '0.125rem 0.5rem 0.125rem 0' },
            },
            // Inline code
            'code': {
              fontFamily: theme('fontFamily.mono'),
              fontWeight: '500',
              fontSize: '0.85em',
              borderRadius: '0.375rem',
              padding: '0.15em 0.4em',
              backgroundColor: 'rgb(var(--article-code-bg) / 1)',
              color: 'rgb(var(--article-code) / 1)',
              '&::before': { content: 'none' },
              '&::after': { content: 'none' },
            },
            // Code blocks
            pre: {
              fontFamily: theme('fontFamily.mono'),
              backgroundColor: 'rgb(var(--article-pre-bg) / 1)',
              color: 'rgb(var(--article-pre-ink) / 1)',
              borderRadius: '0.75rem',
              border: '1px solid rgb(var(--article-border-soft) / 1)',
              fontSize: '0.875rem',
              lineHeight: '1.7',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              color: 'inherit',
              fontSize: 'inherit',
              fontWeight: '400',
            },
            // Lists
            'ul > li::marker': { color: 'rgb(var(--article-accent) / 1)' },
            'ol > li::marker': {
              color: 'rgb(var(--article-muted) / 1)',
              fontWeight: '600',
            },
            // HR
            hr: {
              borderColor: 'rgb(var(--article-border) / 1)',
            },
            // Tables
            thead: {
              color: 'rgb(var(--article-heading) / 1)',
              fontWeight: '600',
            },
            'thead th': {
              borderBottom: '2px solid rgb(var(--article-border) / 1)',
            },
            // Images
            img: {
              borderRadius: '0.75rem',
            },
            // Task list checkboxes
            'input[type="checkbox"]': {
              accentColor: 'rgb(var(--article-accent) / 1)',
            },
          },
        },
        // Slightly smaller, tighter prose for card/preview snippets
        compact: {
          css: {
            maxWidth: 'none',
            '--tw-prose-body': 'rgb(var(--article-ink) / 1)',
            '--tw-prose-headings': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-links': 'rgb(var(--article-link) / 1)',
            '--tw-prose-bold': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-quotes': 'rgb(var(--article-ink) / 1)',
            '--tw-prose-quote-borders': 'rgb(var(--article-accent) / 1)',
            '--tw-prose-code': 'rgb(var(--article-heading) / 1)',
            '--tw-prose-pre-code': 'rgb(var(--article-pre-ink) / 1)',
            '--tw-prose-pre-bg': 'rgb(var(--article-pre-bg) / 1)',
            fontSize: '0.9375rem',
            lineHeight: '1.65',
            'h1, h2, h3': { fontFamily: theme('fontFamily.serif'), fontWeight: '600' },
            h2: { fontSize: '1.25rem' },
            h3: { fontSize: '1.1rem' },
          },
        },
      }),
    },
  },
  plugins: [
    textStroke,
    typography,
  ],
};
