/**
* @author gzk
* @time  01/19/2018
* @version 1.0
* @requires vuex
* @param 
*        { SET_MAPACTIVETABNAME }设置当前激活的tab页
*        { SET_ADDMAPTAB } 增加tab页处理
*        { SET_CLOSEMAPTAB } tab页关闭状态处理
* 
*/

import * as types from '../../type'
import api from '../../../fetch/index'

// const analysisHome = resolve => require(['../../../views/systemManagement/userManager'], resolve)

const state = {
    activeMapTabName: " ",
    tabMapList:[],
    mapMenu:[]
}

const getters = {
    [types.DONE_NAV_TABMAPLIST]: state => state.tabMapList       //获取首页选项卡配置
}


const mutations = {
    [types.SET_MAPACTIVETABNAME](state, name) {           
        state.activeMapTabName = name;
    },
    [types.SET_ADDMAPTAB](state, value) {
        let index = value.pageUrl;
        let title = value.name;
        if (state.tabMapList.filter(f => f.name == value.moduleId) == 0) {
            let component = resolve => require([`../../../views/${index}`], resolve)
            state.tabMapList.push({
                label: title,
                name:value.moduleId,
                disabled: false,
                closable: true,
                component: component
            })
        }
        state.activeMapTabName = value.moduleId;
        
    },
    [types.SET_CLOSEMAPTAB](state, name) {
        console.log(name)
        let tab = state.tabMapList.filter(f => f.name == name)[0];
        let index = state.tabMapList.indexOf(tab);
         if(index==0){
            if (index != state.tabMapList.length - 1) {
                state.activeMapTabName = state.tabMapList[index + 1].name;
            } else {
                state.activeMapTabName = '';
            } 
         }else{
            if (index != state.tabMapList.length - 1) {
                state.activeMapTabName = state.tabMapList[index + 1].name;
            } else {
                state.activeMapTabName = state.tabMapList[index - 1].name;
            }
        }
        state.tabMapList = state.tabMapList.filter(f => f.name != name);
    }
}




export default {
    state,
    getters,
    mutations
}