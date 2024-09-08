export const themeData = JSON.parse("{\"logo\":\"https://vuejs.press/images/hero.png\",\"repo\":\"https://github.com/Yi-Chen89/structural-space-vuepress.git\",\"navbar\":[{\"text\":\"Home\",\"link\":\"/home/\"},{\"text\":\"Page\",\"children\":[\"/steel/\",\"/concrete/\"]}],\"sidebar\":{\"/home/\":[{\"text\":\"Home\",\"children\":[\"\",\"release\"]}],\"/steel/\":[{\"text\":\"Steel\",\"children\":[\"\",\"release\",\"development\"]}],\"/concrete/\":[{\"text\":\"Concrete\",\"children\":[\"\",\"release\",\"development\"]}]},\"editLink\":false,\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
