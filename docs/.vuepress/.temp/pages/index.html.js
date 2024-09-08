import comp from "/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"Home\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"title\":\"Home\",\"heroImage\":\"https://vuejs.press/images/hero.png\",\"actions\":[{\"text\":\"Home\",\"link\":\"/home/\",\"type\":\"primary\"}],\"features\":[{\"title\":\"Steel\",\"details\":\"Steel calcs\"},{\"title\":\"Concrete\",\"details\":\"Concrete calcs\"}],\"footer\":\"MIT Licensed | Copyright © 2024 Yi Chen\"},\"headers\":[],\"git\":{\"updatedTime\":1725816691000},\"filePathRelative\":\"index.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
