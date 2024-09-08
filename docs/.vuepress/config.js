import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

import { backToTopPlugin } from '@vuepress/plugin-back-to-top'

export default defineUserConfig({
  lang: 'en-US',

  title: 'Structural Space',
  description: 'A Site for Structural Design',

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',

    // configure GitHub link on navbar
    repo: 'https://github.com/Yi-Chen89/structural-space-vuepress.git',

    // configure navbar
    navbar: [
      {
        text: 'Home',
        link: '/home/',
      },
      {
        text: 'Page',
        children: [
          '/steel/',
          '/concrete/'
        ],
      },
    ],

    // configure sidebar
    sidebar: {
      // home page
      '/home/': [
        {
          text: 'Home',
          children: [
            '',
            'release',
          ],
        }
      ],
      // steel page
      '/steel/': [
        {
          text: 'Steel',
          children: [
            '',
            'release',
            'development',
          ],
        }
      ],
      // concrete page
      '/concrete/': [
        {
          text: 'Concrete',
          children: [
            '',
            'release',
            'development',
          ],
        }
      ],
    },

    // configure 'Edit this page' link
    editLink: false,

    // configure 'Last Updated'
    lastUpdated: true,

    // configure 'Contributors'
    contributors: false,
  }),

  plugins: [
    backToTopPlugin(),
  ],

  bundler: viteBundler(),
})