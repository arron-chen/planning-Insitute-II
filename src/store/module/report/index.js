import * as types from '../../type'
import api from '../../../fetch/index'

// const analysisHome = resolve => require(['../../../views/analysis/home'], resolve)

const state = {
    reportId: '',
 //   sourceTable:'',
    reportActiveTabName: "",
    reportMenu: [],
    reportTabList: [],
    reportUrl:''
}

const getters = {
    reportMenu: state=>state.reportMenu,
    [types.DONE_NAV_REPORT_TABLIST]: state => state.reportTabList         //报表首页选项配置
}

const mutations = {
      [types.SET_REPORTMENU](state, res) {   //左侧菜单选中
          state.reportMenu = res;
     },
    [types.SET_REPORTACTIVETABNAME](state, name){  //选中
        state.reportActiveTabName = name
        state.reportId = name
    },
    [types.SET_REPORTADDTAB](state, value){  //增加
        // console.log(value)
        let index = value.rid;
        index = index.toString();
        let title = value.label;
        state.reportId = value.rid;
        state.reportUrl = value.url;
        if(state.reportTabList.filter(f => f.name == index) == 0) {
            let component = resolve => require([`../../../views/report/home`], resolve)
            state.reportTabList.push({
                label: title,
                name: index,
                disabled: false,
                closable: true,
                component: component
            })
        }
        state.reportActiveTabName = index;

    },
    [types.SET_REPORTCLOSETAB](state, name){  //关闭
        let tab = state.reportTabList.filter(f => f.name == name)[0];
        let index = state.reportTabList.indexOf(tab);
        if(index==0){
            if (index != state.reportTabList.length - 1) {
                state.reportActiveTabName = state.reportTabList[index + 1].name;
            } else {
                state.reportActiveTabName ='';
            }
        }else{
            if (index != state.reportTabList.length - 1) {
                state.reportActiveTabName = state.reportTabList[index + 1].name;
            } else {
                state.reportActiveTabName = state.reportTabList[index - 1].name;
            }
        }
        state.reportTabList = state.reportTabList.filter(f => f.name != name);
    }
}

export default {
    state,
    getters,
    mutations
}