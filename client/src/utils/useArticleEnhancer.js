import { useEffect, useRef } from 'react';

/**
 * useArticleEnhancer
 *
 * Adds shared reading chrome to rendered article content:
 *   • a "Copy" button on every <pre> code block
 *   • `loading="lazy"` on images that don't already specify it
 *
 * Works across BlogPostPage, the EditorSpace preview and the
 * BlogPostPreview modal — wherever the sanitized TipTap HTML is
 * injected via dangerouslySetInnerHTML.
 *
 * Usage:
 *   const contentRef = useRef(null);
 *   useArticleEnhancer(contentRef);
 *   <div ref={contentRef} dangerouslySetInnerHTML={{...}} />
 */
export default function useArticleEnhancer(containerRef) {
  const mutationRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const makeCopyButton = (pre) => {
      if (pre.dataset.blogCopy) return;
      pre.dataset.blogCopy = '1';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'article-copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code');

      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        const code = pre.querySelector('code');
        const text = code ? code.innerText : pre.innerText;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copied!';
        } catch {
          btn.textContent = 'Failed';
        }
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 1600);
      });

      pre.appendChild(btn);
    };

    const enhance = () => {
      root.querySelectorAll('pre').forEach(makeCopyButton);
      root.querySelectorAll('img:not([loading])').forEach((img) => {
        img.loading = 'lazy';
        if (!img.getAttribute('alt')) img.alt = '';
      });
    };

    enhance();

    // Re-apply when the injected HTML changes (e.g. editor preview updates)
    if (typeof MutationObserver !== 'undefined') {
      mutationRef.current = new MutationObserver(enhance);
      mutationRef.current.observe(root, { childList: true, subtree: true });
    }

    return () => {
      if (mutationRef.current) mutationRef.current.disconnect();
    };
  }, [containerRef]);
}
