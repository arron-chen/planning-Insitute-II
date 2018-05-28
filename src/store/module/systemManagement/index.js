/**
* @author gzk
* @time  08/14/2017
* @version 1.0
* @requires vuex
* @param 
*        { SET_ACTIVETABNAME }设置当前激活的tab页
*        { SET_ADDTAB } 增加tab页处理
*        { SET_CLOSETAB } tab页关闭状态处理
* 
*/

import * as types from '../../type'
import api from '../../../fetch/index'

// const analysisHome = resolve => require(['../../../views/systemManagement/userManager'], resolve)

const state = {
    activeTabName: " ",
    tabList:[],
    sysMenu:[]
}

const getters = {
    [types.DONE_NAV_TABLIST]: state => state.tabList       //获取首页选项卡配置
}


const mutations = {
    [types.SET_ACTIVETABNAME](state, name) {           
        state.activeTabName = name;
    },
    [types.SET_ADDTAB](state, value) {
        let index = value.pageUrl;
        let title = value.name;
        if (state.tabList.filter(f => f.name == value.moduleId) == 0) {
            let component = resolve => require([`../../../views/${index}`], resolve)
            state.tabList.push({
                label: title,
                name:value.moduleId,
                disabled: false,
                closable: true,
                component: component
            })
        }
        state.activeTabName = value.moduleId;
        
    },
    [types.SET_CLOSETAB](state, name) {
        // console.log(name)
        let tab = state.tabList.filter(f => f.name == name)[0];
        let index = state.tabList.indexOf(tab);
         if(index==0){
            if (index != state.tabList.length - 1) {
                state.activeTabName = state.tabList[index + 1].name;
            } else {
                state.activeTabName = '';
            } 
         }else{
            if (index != state.tabList.length - 1) {
                state.activeTabName = state.tabList[index + 1].name;
            } else {
                state.activeTabName = state.tabList[index - 1].name;
            }
        }
        state.tabList = state.tabList.filter(f => f.name != name);
    }
}




export default {
    state,
    getters,
    mutations
}