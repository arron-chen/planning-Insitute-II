//mutations
export const  SET_ACTIVETABNAME = "SET_ACTIVETABNAME"           //设置当前选中功能模块
export const  SET_ADDTAB = "SET_ADDTAB"                         //增加菜单tab
export const  SET_CLOSETAB = "SET_CLOSETAB"                     //关闭菜单tab
export const  SET_TOKEN = "SET_TOKEN"                           //保存token到state以及localStorage中，同一浏览器第二次打开系统不需要登录（已登录过）

export const  SET_MAPACTIVETABNAME = "SET_MAPACTIVETABNAME"           //地图配置设置当前选中功能模块
export const  SET_ADDMAPTAB = "SET_ADDMAPTAB"                         //地图配置增加菜单tab
export const  SET_CLOSEMAPTAB = "SET_CLOSEMAPTAB"                     //地图配置关闭菜单tab
 

export const  SET_ANALYSISMENU = "SET_ANALYSISMENU"  					 //保存分析二级菜单
export const  SET_ANALYSISACTIVETABNAME = "SET_ANALYSISACTIVETABNAME"    //设置分析当前选中功能模块
export const  SET_ANALYSISADDTAB = "SET_ANALYSISADDTAB"         //增加分析菜单tab
export const  SET_ANALYSISCLOSETAB = "SET_ANALYSISCLOSETAB"     //关闭分析菜单tab
export const  SET_MENULIST = "SET_MENULIST"     //保存一级菜单

export const  SET_REPORTFORMMENU = "SET_REPORTFORMMENU"                        //保存报表二级菜单
export const  SET_REPORTFORMACTIVETABNAME = "SET_REPORTFORMACTIVETABNAME"      //设置报表当前选中功能模块
export const  SET_REPORTFORMADDTAB = "SET_REPORTFORMADDTAB"                    //增加报表菜单tab
export const  SET_REPORTFORMCLOSETAB = "SET_REPORTFORMCLOSETAB"                //关闭报表菜单tab

export const  SET_REPORTMENU = "SET_REPORTMENU"                        //保存报告二级菜单
export const  SET_REPORTACTIVETABNAME = "SET_REPORTACTIVETABNAME"      //设置报告当前选中功能模块
export const  SET_REPORTADDTAB = "SET_REPORTADDTAB"                    //增加报告菜单tab
export const  SET_REPORTCLOSETAB = "SET_REPORTCLOSETAB"                //关闭报告菜单


               
  


export const  SET_USERS = "SET_USERS"                                           //系统管理，保存用户列表(用户分配角色)
export const  SET_ROLE = "SET_ROLE" 	                                        //系统管理，保存角色列表  
export const  SET_ROLESLIST = "SET_ROLESLIST" 	                                //系统管理，保存角色列表
export const  SET_PREMISSION = "SET_PREMISSION" 	                            //系统管理，保存权限列表  
export const  SET_LOGS = "SET_LOGS"                                             //系统管理，保存日志表格
//export const  SET_NATIVENAV = "SET_NATIVENAV"    								//归总分析，保存原生表目录
export const  SET_DATAHANDLETOOL = "SET_DATAHANDLETOOL"    						//归总分析，保存工具列表



//actions
export const  FETCT_NAVMENU = "FETCT_NAVMENU"                   //动态获取菜单
export const  FETCT_TOKEN = "FETCT_TOKEN"                       //登录，获取token

export const  FETCT_ANALYSISMENU = "FETCT_ANALYSISMENU" 	    //获取分析二级菜单
export const  FETCT_REPORTFORMMENU = "FETCT_REPORTFORMMENU"     //获取报表二级菜单

export const  FETCT_USERS = "FETCT_USERS"                                       //系统管理，获取用户列表
export const  FETCT_ROLE = "FETCT_ROLE" 	                                    //系统管理，获取角色列表(用户分配角色)
export const  FETCT_SAVEUSERS = "FETCT_SAVEUSERS" 	                            //系统管理，保存角色分配
export const  FETCT_ROLESLIST = "FETCT_ROLESLIST" 	                            //系统管理，获取角色列表
export const  FETCT_PREMISSION = "FETCT_PREMISSION" 	                        //系统管理，获取资源列表
export const  FETCT_SAVEPREMISSION = "FETCT_SAVEPREMISSION" 	                //系统管理，保存权限
export const  FETCT_LOGS = "FETCT_LOGS"                                         //系统管理，获取日志表格

//export const  FETCT_ENTIRETYNAV  = 	"FETCT_ENTIRETYNAV"						//归总分析，获取归总目录



//getters
export const DONE_NAV_TABLIST="DONE_NAV_TABLIST"                //首页主页选项配置

export const DONE_NAV_ANALYSIS_TABLIST="DONE_NAV_ANALYSIS_TABLIST"                //分析首页选项配置

export const DONE_NAV_REPORTFORM_TABLIST="DONE_NAV_REPORTFORM_TABLIST"                //报表首页选项配置

export const DONE_NAV_REPORT_TABLIST="DONE_NAV_REPORT_TABLIST"                //报告首页选项配置

             

export const DONE_NAV_TABMAPLIST="DONE_NAV_TABMAPLIST" 