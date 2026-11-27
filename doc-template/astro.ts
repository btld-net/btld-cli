import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import favicons from 'astro-favicons';
import icon from 'astro-icon';
import robotsTxt from 'astro-robots-txt';
import type { AstroUserConfig } from 'astro';
import { fontProviders } from 'astro/config';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { fileURLToPath } from 'node:url';

export interface BaseDocConfigOptions {
  name: string;
  shortName?: string;
  faviconPath?: string;
}

export function createBaseDocConfig(options: BaseDocConfigOptions): AstroUserConfig {
  const defaultFavicon = fileURLToPath(import.meta.resolve('@btld/utils-doc-template/favicon.svg'));

  return {
    srcDir: 'docs',
    output: 'static',
    devToolbar: { enabled: false },
    integrations: [
      sitemap({ filter: (page) => !page.includes('/hidden/') }),
      robotsTxt({
        policy: [{ userAgent: '*', allow: '/', disallow: ['/hidden/'] }],
      }),
      favicons({
        name: options.name,
        short_name: options.shortName ?? options.name,
        input: {
          favicons: [options.faviconPath ?? defaultFavicon],
        },
      }),
      mdx(),
      icon(),
    ],
    build: {
      inlineStylesheets: 'always',
    },
    vite: {
      plugins: [tailwindcss()],
      css: {
        transformer: 'lightningcss',
        lightningcss: {
          targets: browserslistToTargets(browserslist('baseline widely available')),
        },
      },
      build: {
        rolldownOptions: {
          output: {
            assetFileNames: 'file/[name][extname]',
          },
        },
      },
      resolve: { tsconfigPaths: true },
    },
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'JetBrains Mono',
        cssVariable: '--font-jetbrains-mono',
        weights: [500],
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Plus Jakarta Sans',
        cssVariable: '--font-jakarta-sans',
        weights: [400, 500, 700],
      },
    ],
  };
}