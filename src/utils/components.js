import Menuitem from '@/components/Menuitem'
import Menu from '@/components/Menu'


const components = {
    install: function (Vue) {
      Vue.component('Menuitem',Menuitem)
      Vue.component('Menu',Menu)
    }
}

export default components
