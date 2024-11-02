import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'

import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  lang: 'en-US',

  title: 'Structural Space',
  description: 'A Site for Structural Design',

  base: '/structural-space-vuepress/',

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
          // '/concrete/'
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
            'member-calculator',
            'release',
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
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
    googleAnalyticsPlugin({
      id: 'G-R88JJMTX06',
    }),
  ],

  bundler: viteBundler(),
})