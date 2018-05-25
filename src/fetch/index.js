import axios from 'axios'
import qs from 'qs'
import store from '../store'
import router from "../router"

// axios 配置
axios.defaults.timeout = 100000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


/**
 * 请求之前可以做什么
 */
axios.interceptors.request.use((config) => {
  config.data = qs.stringify(config.data);
  if (window.localStorage.getItem("token")) {
    var lstoken = window.localStorage.getItem("token");
    config.headers.common['Authorization'] = "Bearer " + lstoken
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * 返回拦截，可以做些什么
 */
axios.interceptors.response.use((res) => {
    return res
  }, (error) => {
    if (error.response.status == 500) {
      window.localStorage.removeItem("token")
      store.commit('SET_TOKEN', '')
      router.replace('/login')
    }
    return Promise.reject(error)
  }
)


export default {

  //###首页
  //获取菜单接口
  fetchNavMenu: data => axios.post('/mainWeb/home/getMenu', data),
  //获取二级菜单接口
  fetchLeftNav: data => axios.get('/mainWeb/home/getMenu/other', data),
  //获取首页趋势分析模块
  fetchHomePageTrendChart: data => axios.get('/mainWeb/TrendChart/HomePageTrendChart', data),
  //获取首页趋势报表模块
  fetchHomePageReports: data => axios.get('/mainWeb/ReportTable/HomePageReports', data),

  //###系统管理
  //登录接口
  fetchToken: data => axios.post('/mainWeb/login', data),
  //获取用户列表，用户管理userManager
  fetchUsers: data => axios.get('/mainWeb/userManager/users', data),
  //用户角色分配userManager
  saveUserRole: data => axios.post('/mainWeb/userManager/saveUserRole', data),
  //获取所有角色信息rolemanager
  fetchRoleList: data => axios.get('/mainWeb/roleManager/getRoleList', data),
  //获取所有角色信息（角色列表）rolemanager
  fetchRoleListFindAllByPage: data => axios.get('/mainWeb/roleManager/findAllByPage', data),
  //获取资源列表rolemanager
  fetchPremission: data => axios.get('/mainWeb/roleManager/getPremission', data),
  //角色信息授权rolemanager
  savePremission: data => axios.post('/mainWeb/roleManager/savePremission', data),
  //日志管理，获取日志列表logManager
  fetchFindAllByPage: data => axios.get('/mainWeb/logManager/findAllByPage', data),
  //保存角色
  fetchSaveRole: data => axios.get('/mainWeb/roleManager/saveRole', data),
  //删除角色
  fetchDeleteRole: data => axios.get('/mainWeb/roleManager/deleteRole', data),


  //###数据处理
  //获取工具目录
 // fetchCatalog: data => axios.get('/mainWeb/dataprocess/tool/getCatalog', data),
  //获取工具目录(树的异步加载)
  fetchCatalog: data => axios.get('/mainWeb/dataprocess/tool/getCatalogHierarchy', data),
  //获取工具目录2
  fetchCatalog2: data => axios.get('/mainWeb/dataprocess/tool/getCatalog2', data),
  //获取工作集
  fetchToolSet: data => axios.get('/mainWeb/dataprocess/tool/getToolset', data),
  //获取工具信息
  fetchTool: data => axios.get('/mainWeb/dataprocess/tool/getTool', data),
  //保存更新工作集
  saveUpdateToolset: data => axios.get('/mainWeb/dataprocess/tool/saveUpdateToolset', data),
  //删除工作集
  deleteToolset: data => axios.get('/mainWeb/dataprocess/tool/deleteToolset/deleteToolset', data),
  //删除工作
  deleteTool: data => axios.get('/mainWeb/dataprocess/tool/deleteTool', data),
  //获取工具参数
  fetchParameter: data => axios.get('/mainWeb/dataprocess/tool/getParameter', data),
  //获取工具参数列表
  fetchParameter: data => axios.get('/mainWeb/dataprocess/tool/getParameters', data),
  //保存更新工具
  saveUpdateTool: data => axios.get('/mainWeb/dataprocess/tool/saveUpdateTool', data),
  //保存工具列表
  saveUpdateParameter: data => axios.post('/mainWeb/dataprocess/model/saveModelNode', data),
  //获取工具模型参数
  fetchModelParas: data => axios.post('/tool/getModelParas', data),
  //执行数据处理工具
  fetchExecute: data => axios.get('/task/execute', data),
  //获取任务列表
  fetchTasks: data => axios.get('/task/getTasks', data),
  //获取子任务列表
  getSubTasks: data => axios.get('/mainWeb/dataprocess/task/getSubTasks', data),
  //获取任务（工具）执行的行政区信息  (子任务详情)
  getTaskJobXZQs: data => axios.get('/mainWeb/dataprocess/task/getTaskJobXZQs', data),
  //获取工具实际参数值列表
  getJobParavalues: data => axios.get('/mainWeb/dataprocess/task/getJobParavalues', data),

  //获取任务信息
  fetchTask: data => axios.get('/task/getTask', data),
  //获取方案信息
  getModel: data => axios.get('/mainWeb/dataprocess/tool/getModel', data),
  //保存方案工具
  saveModelTool: data => axios.get('/mainWeb/dataprocess/tool/saveModelTool', data),
  //添加方案工具  /mainWeb/dataprocess/tool/delToolModel
  addModelTool: data => axios.post('/mainWeb/dataprocess/tool/addModelTool', data),
  //删除方案工具
  delToolModel: data => axios.post('/mainWeb/dataprocess/model/delModelNode', data),
  delModelset: data => axios.post('/mainWeb/dataprocess/model/delModelset', data),
  //归总分析
  //###原生表
  //获取搜索参数(设置)
  fetchSearchPara: data => axios.get('/mainWeb/ProResult/SearchPara', data),
  //获取批次列表
  fetchSearchParaGetSjpc: data => axios.get('/mainWeb/ProResult/SearchPara/GetSjpc', data),
  //获取原生表年份
  fetchSearchParaGetNds: data => axios.get('/mainWeb/ProResult/SearchPara/GetNds', data),
  //保存搜索参数设置
  fetchSearchParaSave: data => axios.post('/mainWeb/ProResult/SearchPara/Save', data),
  //获取数据分类列表
  fetchSearchParaGetSjdjfl: data => axios.get('/mainWeb/ProResult/SearchPara/GetSjdjfl', data),
  //搜索原生表
  fetchSearchSourceTable: data => axios.get('/mainWeb/ProResult/SearchSourceTable', data),

  fetchSearchShowTableByXZDM: data => axios.get('/mainWeb/ProResult/ShowTable', data),

  //获取原始数据
  fetchSearchShowTable: data => axios.get('/mainWeb/ProResult/ShowTable', data),

  //发布单张表
  fetchPublishTable: data => axios.post('/mainWeb/ProResult/PublishTable', data),
  //获取发布目录
  fetchGetPushReportCatas: data => axios.get('/mainWeb/ProResult/GetReportCatas?showType=SheetCata', data),
  //导出excel
  fetchGetExportExcel: data => axios.get('/mainWeb/ProResult/ExportExcel', data),
  //修改报表节点
  fetchGetRenameReportCata: data => axios.get('/mainWeb/ReportTable/RenameReportCata', data),
  //增加报表节点
  fetchGetAddReportCata: data => axios.get('/mainWeb/ReportTable/AddReportCata', data),
  //导入模板
  fetchGetImportTemplate: data => axios.post('/mainWeb/ProResult/ImportTemplate?srid=3&sType=sumTable', data),


  //导出模板
  fetchGetExportTemplate: data => axios.get('/mainWeb/ProResult/ExportTemplate', data),
  //批量导出
  fetchBatchExportExcel: data => axios.get('/mainWeb/ProResult/BatchExportExcel', data),


  //获取行政区划
  fetchGetXZDMs: data => axios.get('/mainWeb/ProResult/GetXZDMs', data),
  /* //获取行政级别
   fetchGetShowXZJB : data => axios.get('/mainWeb/ProResult/GetShowXZJB', data),*/
  //获取下拉行政级别
  fetchGetXZQRange: data => axios.get('/mainWeb/ProResult/GetXZQRange', data),

  /** 2017/10/31
   *author:gzk
   *功能:汇总表
   */
  //汇总表年份
  fetchGetProYears: data => axios.get('/mainWeb/ProResult/GetProYears', data),
  //汇总表数据区划
  fetchGetProSJQH: data => axios.get('/mainWeb/ProResult/GetProSJQH', data),
  //汇总表数据批次
  fetchGetProSJPC: data => axios.get('/mainWeb/ProResult/GetProSJPC', data),
  //汇总表汇总方案
  fetchGetProModels: data => axios.get('/mainWeb/ProResult/GetProModels', data),
  //搜索汇总表
  fetchGetFiterProTables: data => axios.get('/mainWeb/ProResult/fiterProTables', data),
  //获取趋势目录树
  fetchGetTrendChartCata: data => axios.get('/mainWeb/TrendChart/ExpanseReportCata', data),
  //发布趋势目录树修改
  fetchGetTrendChartRename: data => axios.get('/mainWeb/TrendChart/RenameReportCata', data),
  //发布趋势目录树节点增加
  fetchGetTrendChartAddReportCata: data => axios.get('/mainWeb/TrendChart/AddReportCata', data),
  //发布趋势目录树节点删除
  fetchGetTrendChartRemoveReportCata: data => axios.get('/mainWeb/TrendChart/RemoveReportCata', data),
  //发布趋势
  fetchGetPublishTrendChart: data => axios.post('/mainWeb/ProResult/PublishTrendChart', data),
  //展示趋势图
  fetchGetShowTrendChart: data => axios.get('/mainWeb/TrendChart/ShowTrendChart', data),
  //获取趋势分析行政区划
  fetchGetXZDMsByTrend: data => axios.get('/mainWeb/TrendChart/GetXZDMsByTrend', data),
  //获取趋势分析模型列表
  fetchGetTrendModels: data => axios.get('/mainWeb/TrendChart/GetTrendModels', data),
  //撤销已发布的报表
  fetchGetRevokePulishTable: data => axios.get('/mainWeb/ProResult/RevokePulishTable', data),
  //撤销已发布的趋势
  fetchGetRevokePulishTrendChart: data => axios.get('/mainWeb/ProResult/RevokePulishTrendChart', data),

  //###汇总表
  //获取汇总表 衍生表 过渡表
  fetchSearchProTable: data => axios.get('/mainWeb/ProResult/SearchProTable', data),


  //删除报表节点
  fetchGetRemoveReportCata: data => axios.get('/mainWeb/ReportTable/RemoveReportCata', data),


  //###汇总表
  //获取汇总表 衍生表 过渡表
  fetchSearchProTable: data => axios.get('/mainWeb/ProResult/SearchProTable', data),

  //###报表
  //获取报表展示
  fetchReportFrom: data => axios.get('/smartBIWebService/GetCatalogElementTree?resourceId=I8a808087015e60966096bea8015e60a97efb081a', data),



  //获取原生表展示
  fetchGetReportCatas: data => axios.get('/mainWeb/ProResult/GetReportCatas?showType=ReportSheet', data),
  //获取原生报告展示
  fetchGetReportWordCatas: data => axios.get('/mainWeb/ProResult/GetReportCatas?showType=ReportWord', data),
  //获取报表目录

   fetchGetExpanseReportCata: data => axios.post('/mainWeb/ReportTable/ExpanseReportCata', data),
  //fetchGetExpanseReportCata: data => axios.get('/mainWeb/ReportTable/getReportCatalogHierarchy', data),
  //报表搜索
  fetchGetSearchReports: data => axios.get('/mainWeb/ReportTable/SearchReports', data),

  //获取报告列表  2018/04/18 gzk
  fetchGetReportTree: data => axios.get('/mainWeb/ReportManage/getReportTree', data),
  //首页展示报告
  fetchGetReportFileName: data => axios.get('/mainWeb/ReportManage/getReportFileName', data),

  //模板管理 获取关联模板列表 2018/04/18 gzk
  fetchShowTemplateInfo: data => axios.get('/mainWeb/ProResult/showTemplateInfo', data),
  //删除模板
  fetchDeleteTemplate: data => axios.get('/mainWeb/ProResult/deleteTemplate', data),
  //启用模板
  fetchEnableTemplate: data => axios.get('/mainWeb/ProResult/enableTemplate', data),

  //###方案执行
  //获取不同状态的任务列表(区分状态)
  fetchTasks: data => axios.get('/mainWeb/dataprocess/task/getTasks', data),
  fetchAllTasks: data => axios.get('/mainWeb/dataprocess/task/getAllTasks', data),
  //获取任务
  fetchTask: data => axios.get('/mainWeb/dataprocess/task/getTask', data),
  //执行任务处理数据
  runTask: data => axios.post('/mainWeb/dataprocess/task/commitTask', data),

  //
  fetchGetModelYears: data => axios.post('/mainWeb/dataprocess/task/getModelYears', data),

  /** 2017/10/21
   *author:huangjianhui
   *功能:方案管理
   */
  //dataDetCatalog: data => axios.get('/mainWeb/dataprocess/model/getCatalog', data),
  //方案管理（异步加载）
  dataDetCatalog: data => axios.get('/mainWeb/dataprocess/model/getSchemeTreeHierarchy', data),
  dataGetModel: data => axios.get('/mainWeb/dataprocess/model/getModel', data),
  dataGetModelNodes: data => axios.get('/mainWeb/dataprocess/model/getModelNodeGroups', data),
  dataGetModelNodeParas: data => axios.get('/mainWeb/dataprocess/model/getModelNodeParas', data),
  dataGetAvailablePreParas: data => axios.get('/mainWeb/dataprocess/model/getAvailablePreParas', data), //下拉参数
  dataGetModelNodeParaDatas: data => axios.get('/mainWeb/dataprocess/model/getModelNodeParaDatas', data), //选择按钮弹窗数据
  dataRenameModel: data => axios.post('/mainWeb/dataprocess/model/renameModelset', data),
  renameProjectName: data => axios.post('/mainWeb/dataprocess/model/renameModelNode', data),
  renameModelNode:data => axios.post('/mainWeb/dataprocess/model/renameModel', data),
  dataAddModel: data => axios.post('/mainWeb/dataprocess/model/addModel', data),//添加模型
  dataAddToolBagSet: data => axios.post('/mainWeb/dataprocess/model/addToolBagSet', data),
  dataAddModelset: data => axios.post('/mainWeb/dataprocess/model/addModelset', data),//添加文件夹
  dataAddTool: data => axios.post('/mainWeb/dataprocess/model/addModelNode', data),
  dataSaveModelNodeParas: data => axios.post('/mainWeb/dataprocess/model/saveModelNodeParas', data),
  dataDelModel: data => axios.post('/mainWeb/dataprocess/model/delModel', data),
  dataGetModelDatas: data => axios.get('/mainWeb/dataprocess/model/getModelDatas', data),
  dataTemplateFields:data => axios.get('/mainWeb/ProResult/AdjustmentTool/getDataTemplateFields?rkmbbsm=599', data), //增加字段
  /** 2017/10/21
   *author:huangjianhui
   *功能: 用户管理
   */
  userDeleteUser: data => axios.get('/mainWeb/userManager/deleteUser', data),
  userSaveUser: data => axios.get('/mainWeb/userManager/saveUser', data),
  userGetUser: data => axios.get('/mainWeb/userManager/getUser', data),


  //获取工具包
  // getToolBagTree: data => axios.get('/mainWeb/dataprocess/model/getToolBagTree', data),
  //获取工具包(树的异步加载)
  getToolBagTree: data => axios.get('/mainWeb/dataprocess/model/getToolBagTreeHierarchy', data),

  addToolBag: data => axios.post('/mainWeb/dataprocess/model/addToolBag', data),
  getNewNodeName: data => axios.get('/mainWeb/dataprocess/model/getNewNodeName', data),
  getModelNodes: data => axios.get('/mainWeb/dataprocess/model/getModelNodes', data),
  getToolBagParas: data => axios.get('/mainWeb/dataprocess/model/getToolBagParas', data),


  //地图配置
  //基础信息关联接口
//地图基础信息获取
  fetchGetWebGisCatalog: data => axios.get('/webgisWebService/config/get/WebGisCatalog'),
//地图基础信息保存
  fetchSaveWebGisCatalog: data => axios.post('/webgisWebService/config/save/WebGisCatalog', data),


//###图层服务
//获取图层数据树形结构接口
  fetchGetLayerTree: data => axios.post('/webgisWebService/maplayer/layerTree'),
//获取图层目录结构树接口
  fetchGetDirTree: data => axios.post('/webgisWebService/maplayer/dirtree'),
//保存图层数据
  fetchSaveUpdateLayer: data => axios.post("/webgisWebService/maplayer/saveUpdateLayer", data),
//删除选中的图层节点接口
  fetchDeleteSelectedLayer: data => axios.get('/webgisWebService/maplayer/deleteSelectedLayer', data),
//获取arcgis server 根目录服务结构树(arcgis server根目录服务已经保存在syskey表）
  fetchGetServiceDir: data => axios.get('/webgisWebService/maplayer/getServiceDir', data),
//获取arcgis server 根目录服务结构树（传入服务根目录地址）
  fetchGetDirInfo: data => axios.get('/webgisWebService/maplayer/getDirInfo', data),

//###查询管理
//获取所有查询配置项
  fetchGetGlobalsearchAll: data => axios.get('/webgisWebService/globalsearch/all'),
//获取子图层的字段信息接口
  fetchGetGlobalsearchLayerfields: data => axios.get('/webgisWebService/globalsearch/layerfields', data),
//保存查询信息接口
  fetchGetGlobalsearchSave: data => axios.get('/webgisWebService/globalsearch/save', data),
//删除选中的记录
  fetchGetGlobalsearchDelete: data => axios.get('/webgisWebService/globalsearch/delete', data),

//根据任务名称获取任务列表
  getTasksByModel: data => axios.get('/mainWeb/dataprocess/task/getTasksByModel', data),
  //获取任务起始年度
  getTaskParaStartYears: data => axios.get('/mainWeb/dataprocess/task/getTaskParaStartYears', data),
  //获取任务年度
  getTaskParaYears: data => axios.get('/mainWeb/dataprocess/task/getTaskParaYears', data),
  //获取任务行政区
  getTaskParaXZQs: data => axios.get('/mainWeb/dataprocess/task/getTaskParaXZQs', data),
  //获取任务数据批次
  getTaskParaSJPC: data => axios.get('/mainWeb/dataprocess/task/getTaskParaSJPC', data),
  //工具管理，工具参数说明保存
  setToolParaDescription: data => axios.post('/mainWeb/dataprocess/tool/setToolParaDescription', data),
  //工具管理，工具说明保存
  setToolDescription: data => axios.post('/mainWeb/dataprocess/tool/setToolDescription', data),
  //工具包管理，工具包参数说明保存
  setToolBagDescription: data => axios.post('/mainWeb/dataprocess/model/setToolBagDescription', data),
  //工具包管理，工具包说明保存
  setToolBagParaDescription: data => axios.post('/mainWeb/dataprocess/model/setToolBagParaDescription', data),
  //列间合计关系树（字段关系树-横向关系）
  ColTree: data => axios.get('/mainWeb/ProResult/AdjustmentTool/ColTree', data),
  //停止任务
  stopTask: data => axios.post('/mainWeb/dataprocess/task/stopTask', data),
  //获取归类组
  GetGLZ: data => axios.get('/mainWeb/ProResult/AdjustmentTool/GetGLZ', data),
  //获取归类树
  GetGlTree: data => axios.get('/mainWeb/ProResult/AdjustmentTool/GetGlTree', data),


}
