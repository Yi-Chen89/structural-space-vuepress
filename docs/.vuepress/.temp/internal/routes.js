export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"Get Started"} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Home"} }],
  ["/steel/development.html", { loader: () => import(/* webpackChunkName: "steel_development.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/steel/development.html.js"), meta: {"title":"Development"} }],
  ["/steel/", { loader: () => import(/* webpackChunkName: "steel_index.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/steel/index.html.js"), meta: {"title":"Steel"} }],
  ["/steel/release.html", { loader: () => import(/* webpackChunkName: "steel_release.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/steel/release.html.js"), meta: {"title":"Release"} }],
  ["/concrete/development.html", { loader: () => import(/* webpackChunkName: "concrete_development.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/concrete/development.html.js"), meta: {"title":"Development"} }],
  ["/concrete/", { loader: () => import(/* webpackChunkName: "concrete_index.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/concrete/index.html.js"), meta: {"title":"Concrete"} }],
  ["/concrete/release.html", { loader: () => import(/* webpackChunkName: "concrete_release.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/concrete/release.html.js"), meta: {"title":"Release"} }],
  ["/home/", { loader: () => import(/* webpackChunkName: "home_index.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/home/index.html.js"), meta: {"title":"Overview"} }],
  ["/home/release.html", { loader: () => import(/* webpackChunkName: "home_release.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/home/release.html.js"), meta: {"title":"Release"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/yichen/Projects/structural-space-vuepress/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
