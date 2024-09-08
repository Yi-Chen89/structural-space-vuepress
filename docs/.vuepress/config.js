import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

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
      '/home/': [
        {
          text: 'Home',
          children: [
            '',
            'release',
          ],
        }
      ],
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
  }),

  bundler: viteBundler(),
})