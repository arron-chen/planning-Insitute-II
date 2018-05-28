
import tabs from './components/tabs';

const components = [
  tabs,
]

const install = function (Vue, opts = {}) {
  if (install.installed) return
  components.map((component) => {
    Vue.component(component.name, component)
  })
}

// 自动注册
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '0.0.1',
  install,
  // 使用es6语法
  ...components
}
