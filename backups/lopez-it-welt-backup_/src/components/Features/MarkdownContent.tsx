import React from 'react';
import { twMerge } from 'tailwind-merge';

interface MarkdownContentEigenschaften {
  children: React.ReactNode;
  className?: string;
  seitenTitel?: string;
}

export const MarkdownContent: React.FC<MarkdownContentEigenschaften> = ({
  children,
  className,
  seitenTitel,
}) => {
  const baseClasses = 'prose prose-lg max-w-none text-textfarbe';

  const classes = twMerge(
    baseClasses,
    // Deutsche Typografie-Klassen
    'prose-headings:text-textfarbe prose-headings:schrift-fett',
    'prose-h1:text-ueberschrift-2xl prose-h1:margin-unten-8',
    'prose-h2:text-ueberschrift-xl prose-h2:margin-unten-6',
    'prose-h3:text-ueberschrift-gross prose-h3:margin-unten-4',
    'prose-h4:text-ueberschrift-mittel prose-h4:margin-unten-3',
    'prose-p:text-basis prose-p:margin-unten-4',
    'prose-strong:schrift-fett prose-strong:text-textfarbe',
    'prose-em:schrift-normal prose-em:text-textfarbe',
    'prose-a:text-hauptfarbe prose-a:hover:text-hauptfarbe/80 prose-a:uebergang-farben',
    'prose-blockquote:rahmen-links rahmen-hauptfarbe rahmen-4 padding-links-4 margin-unten-6',
    'prose-blockquote:text-texthell prose-blockquote:schrift-normal',
    'prose-code:text-nebenfarbe prose-code:hintergrund-grau-100 prose-code:padding-1 prose-code:abgerundet-klein',
    'prose-pre:hintergrund-grau-900 prose-pre:text-textweiss prose-pre:padding-4 prose-pre:abgerundet-gross prose-pre:overflow-x-auto',
    'prose-ul:margin-unten-4 prose-ul:padding-links-6',
    'prose-ol:margin-unten-4 prose-ol:padding-links-6',
    'prose-li:margin-unten-2',
    'prose-table:rahmen rahmen-grau-300 prose-table:abgerundet-gross prose-table:overflow-hidden',
    'prose-th:hintergrund-grau-100 prose-th:padding-3 prose-th:schrift-fett prose-th:text-textfarbe',
    'prose-td:padding-3 prose-td:rahmen-oben rahmen-grau-200',
    'prose-img:abgerundet-gross prose-img:schatten-mittel',
    className
  );

  return (
    <article
      className={classes}
      role='article'
      aria-label={seitenTitel || 'Markdown Inhalt'}
    >
      {children}
    </article>
  );
};
