import Vue from 'vue'
import Vuex from 'vuex'

import dataSet from './modules/dataSet'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dataSet
  }
})