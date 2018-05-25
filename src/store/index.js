import Vuex from "vuex"
import Vue from 'vue'
import * as types from './type'
import api from '../fetch/index'
import system from './module/systemManagement/index'
import analysis from  './module/analysis/index'
import reportform from  './module/reportForm/index'
import report from  './module/report/index'
import mapManager from  './module/mapManager/index' 
import home from  './module/home/index' 
import dataProgram from  './module/dataProgram/index'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',      //请求头的token
        menuList:'',     //一级菜单
    },
    mutations: {
        [types.SET_TOKEN](state, res) {
            state.token = res
            window.localStorage.setItem("token", res)
        },
        [types.SET_MENULIST](state, res) {
            state.menuList = res
        }
    },
    actions: {
        [types.FETCT_TOKEN]({ commit }, params) {
            return new Promise((resolve, reject) => {
                api.fetchToken(params)
                    .then((res) => {
                        if (res.data.code == 200) {
                            commit('SET_TOKEN', res.data.message)
                            resolve(res)
                        }else{
                            resolve(res)
                        }
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        [types.FETCT_NAVMENU]({ commit }, playload) {
            return new Promise((resolve, reject) => {
                api.fetchNavMenu()
                    .then((res) => {
                        commit('SET_MENULIST',res.data.mTree.children)
                        resolve(res.data)
                        // console.log(res.data)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    },
    modules: {
        system,
        analysis,
        reportform,
        report,
        mapManager,
        home,
        dataProgram
    }
})
