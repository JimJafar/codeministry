import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faShoppingCart, faTrashAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)
