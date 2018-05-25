import Vue from 'vue'
import { dateFormat } from '@/tools/date/format.js'


Vue.filter('date', v => {
  return dateFormat(new Date(v), 'YYYY-MM-DD HH:mm:ss')
})
