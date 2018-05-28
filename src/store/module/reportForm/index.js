import * as types from '../../type'
import api from '../../../fetch/index'

// const analysisHome = resolve => require(['../../../views/analysis/home'], resolve)

const state = {
    reportFormId: '',
    sourceTable:'',
    reportFormActiveTabName: "",
    reportFormMenu: [],
    reportFormTabList: []
}

const getters = {
    reportFormMenu: state=>state.reportFormMenu,
    [types.DONE_NAV_REPORTFORM_TABLIST]: state => state.reportFormTabList         //报表首页选项配置
}

const mutations = {
      [types.SET_REPORTFORMMENU](state, res) {   //左侧菜单选中
          state.reportFormMenu = res;
     },
    [types.SET_REPORTFORMACTIVETABNAME](state, name){  //选中
        state.reportFormActiveTabName = name
        state.reportFormId = name
    },
    [types.SET_REPORTFORMADDTAB](state, value){  //增加
        if(value.RID){
          var index = value.SRID;
          var title = value.F_LABEL;
          state.sourceTable = value.STYPE;
        }else if(value.rid){
            var index = value.sRid;
            var title = value.label;
            state.sourceTable = value.stype;
        }else{
            var index = value.id;
        }
       // let title = value.label;
        // console.log('value:'+value)
        state.reportFormId = index;

        if(state.reportFormTabList.filter(f => f.name == index) == 0) {
            let component = resolve => require([`../../../views/reportform/home`], resolve)
            state.reportFormTabList.push({
                label: title,
                name: index,
                disabled: false,
                closable: true,
                component: component
            })
        }
        state.reportFormActiveTabName = index;
    },
  // [types.SET_REPORTFORMADDTAB](state, value){  //增加
  //   debugger
  //   if(value.rid){
  //     var index = value.sRid;
  //   }else{
  //     var index = value.id;
  //   }
  //   let title = value.label;
  //   // console.log('value:'+value)
  //   state.reportFormId = value.sRid;
  //   state.sourceTable = value.stype;
  //   if(state.reportFormTabList.filter(f => f.name == index) == 0) {
  //     let component = resolve => require([`../../../views/reportform/home`], resolve)
  //     state.reportFormTabList.push({
  //       label: title,
  //       name: index,
  //       disabled: false,
  //       closable: true,
  //       component: component
  //     })
  //   }
  //   state.reportFormActiveTabName = index;
  // },
    [types.SET_REPORTFORMCLOSETAB](state, name){  //关闭
        let tab = state.reportFormTabList.filter(f => f.name == name)[0];
        let index = state.reportFormTabList.indexOf(tab);
        if(index==0){
            if (index != state.reportFormTabList.length - 1) {
                state.reportFormActiveTabName = state.reportFormTabList[index + 1].name;
            } else {
                state.reportFormActiveTabName ='';
            }
        }else{
            if (index != state.reportFormTabList.length - 1) {
                state.reportFormActiveTabName = state.reportFormTabList[index + 1].name;
            } else {
                state.reportFormActiveTabName = state.reportFormTabList[index - 1].name;
            }
        }
        state.reportFormTabList = state.reportFormTabList.filter(f => f.name != name);
    }
}

export default {
    state,
    getters,
    mutations
}
