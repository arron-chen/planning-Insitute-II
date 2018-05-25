<template>
  <div class="panel-content" id="toolKit">
    <!--布局，左边树列表-->
    <div data-options="region:'west',split:true,collapsible:true,tools:'#toolKitTt'" title="工具包列表" style="width:250px;">
      <div class="layout-box tool">
        <el-tree :default-expanded-keys="expanded" node-key="id" :data="data" v-loading.body="loadTree"
                 :props="defaultProps" highlight-current :render-content="renderContent" :expand-on-click-node="false"
                 @node-click="FormTreeNodeClick" :load="loadNode" lazy></el-tree>
      </div>
    </div>
    <div id="toolKitTt">
      <a href="javascript:void(0)" class="icon-add" @click="addprogramBtn=true" title="添加目录"></a>
      <a href="javascript:void(0)" class="icon-reload" @click="getCatalog" title="刷新"></a>
    </div>

    <!--布局，左边方案树列表-->
    <!--布局，右边方案详情，包括工具以及工具参数列表-->
    <div data-options="region:'center',split:true,collapsible:true" title="包信息" id='toolKitlList'>
      <el-tabs v-model="bagInfo" type="card" @tab-click='initLayout'>
        <el-tab-pane label="包信息" name="bagInfo">
          <div class="layout-box program">
            <div>
              <div v-if="addProgram">
                <el-button type="primary" icon="plus" @click.native="getToolData">添加工具</el-button>
                <el-button type="primary" icon="plus" @click.native="getToolDataGroup">添加工具包</el-button>
                <el-button type="primary" icon="delete2" @click="delToolModel">删除</el-button>
              </div>
              <div id="toolKitDetial">
                <div data-options="region:'west',split:true,collapsible:true" title="列表" style="width:250px;">
                  <!--   &lt;!&ndash;方案的工具列表&ndash;&gt; -->
                  <el-tree :data="programList" :props="defaultProps" @node-click="showProgramList" highlight-current
                           :render-content="paramsList" node-key="nodeGroup" :expand-on-click-node="false" ref="toolKitList"></el-tree>
                  <!-- <ul class="program-list">
                    <li v-for="(item,index) in programList" :key="index" :data-rid='item.rid' :data-name='item.name' @click="">{{item.name}}</li>
                  </ul> -->
                  <!--  &lt;!&ndash;方案的工具列表&ndash;&gt; -->
                </div>
                <div data-options="region:'center',split:true,collapsible:true" title='参数'>
                  <!--  &lt;!&ndash;工具的参数列表&ndash;&gt; -->
                  <div v-for="(item,index) in parameters1" :key="index" style="padding:0 10px;position:relative">
                    <!--<p style="margin-left:17px">{{item.displayName}}</p>-->
                    <div v-if="item.required == true">
                      <p v-if="item.valuess==''  && item.readonly==false" class="requiredRed"></p>
                      <p v-else class="requiredGreen"></p>
                      <p class="requiredList">{{item.displayName}}</p>
                    </div>
                    <div v-else ><p class="optionalList">{{item.displayName}}(选填)</p></div>

                    <el-select :disabled="item.readonly" allow-create filterable :multiple="item.multiValue"
                               v-model="item.valuess" type='large' placeholder="请选择"
                               @visible-change="getParametersList(item.rid)" @change="saveParamet($event,item.rid)"
                               @remove-tag="removeTag($event,item.rid)" style="display:block;padding-right:60px">
                      <el-option v-for="item in parametersList" :key="item.nodeRid" :label="item.text"
                                 :value="item.text"></el-option>
                    </el-select>
                    <el-button class="selectBtn" :disabled="item.readonly" size="small" type="primary" @click.native="select(item)">选择
                    </el-button>
                  </div>
                  <!--   &lt;!&ndash;工具的参数列表&ndash;&gt; -->
                  <div style="text-align:center;margin:8px 40px;" v-if="parameters1.length>0">
                    <el-button type="primary" @click.native="save">保存</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="包参数" name="bagList">
          <div id="bagList">
            <div data-options="region:'center'" title="参数">
              <div>
                <el-table :data="bagListTree" height="350" @row-click='showDescription'>
                  <el-table-column prop="name" label="名称" width="180"></el-table-column>
                  <el-table-column prop="displayName" label="别名" width="180"></el-table-column>
                  <el-table-column prop="dataType" label="类型" width="180"></el-table-column>
                  <el-table-column label="方向">
                    <template slot-scope="scope">
                      <span>{{scope.row.direction | status(scope.row.direction)}}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div data-options="region:'east',split:true,collapsible:true,tools:'#toolNagEdit'" title="工具说明"
                 style="width:150px;">
              <div class="description">{{description}}</div>
            </div>
            <div id="toolNagEdit">
              <a href="javascript:void(0)" class="icon-edit" @click="toolEdit" title="编辑"></a>
            </div>
            <el-dialog title="工具说明编辑" :visible.sync="dialogTableVisible">
              <el-input
                type="textarea"
                :rows="2"
                placeholder=""
                v-model="description">
              </el-input>
              <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </span>
            </el-dialog>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
    <!-- 修改方案弹窗 start-->
    <el-dialog title="修改方案目录" :visible.sync="dialogFormVisible4" size=tiny>
      <el-input size="small" placeholder="请输入节点名称" v-model="TreeLabelName"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRevise" size=small>取 消</el-button>
        <el-button type="primary" @click="submitRevise" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改方案节点" :visible.sync="dialogFormVisible3" size=tiny>
      <el-input size="small" placeholder="请输入节点名称" v-model="TreeLabelName"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRevise" size=small>取 消</el-button>
        <el-button type="primary" @click="submitReviseNode" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增加方案弹窗 start-->
    <el-dialog title="添加目录" :visible.sync="dialogFormVisible5" size=tiny>
      <el-input size="small" placeholder="请输入文件夹或者模型名称" v-model="TreeLabelName2"></el-input>
      <div class="addRatio">
        <el-radio v-model="radio" label="addFolder">添加文件夹</el-radio>
        <el-radio v-model="radio" label="addModel">添加工具箱</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAppend" size=small>取 消</el-button>
        <el-button type="primary" @click="submitAppend" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除方案弹窗 start-->
    <el-dialog title="删除工具包" :visible.sync="dialogFormVisible6" size=tiny>
      <p style="color:#ff4949">确定删除工具包？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDel" size=small>取 消</el-button>
        <el-button type="primary" @click="submitDel" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加目录弹窗 start-->
    <el-dialog title="添加文件夹" :visible.sync="addprogramBtn" size=tiny>
      <el-input size="small" placeholder="请输入文件夹名称" v-model="TreeLabelName3"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddContents" size=small>取 消</el-button>
        <el-button type="primary" @click="addContents" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加工具 -->
    <el-dialog title="添加工具" :visible.sync="addTool2" size="tiny">
      <div class="dialog-box">
        <el-tree :default-expanded-keys="expanded" node-key="id" v-loading.body="loadTree"
                 :data="toolData"
                 :highlight-current='true' @node-click="saveToolrid" :load="loadToolNode" lazy :props="defaultProps"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-form label-width="70px">
          <el-form-item label="节点名称">
            <el-input v-model="newNodeName"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addTool2 = false">取 消</el-button>
        <el-button type="primary" @click.native="addProgramTool">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加工具包 -->
    <el-dialog title="添加工具包" :visible.sync="addTool3" size="tiny">
      <div class="dialog-box">
        <el-tree :default-expanded-keys="expanded" node-key="id"  v-loading.body="loadTree"
                 :data="toolDataGroup" :highlight-current='true' @node-click="saveToolridBag" :load="loadToolBagNode" lazy :props="defaultProps" ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-form label-width="90px">
          <el-form-item label="节点名称">
            <el-input v-model="newNodeName1"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="addTool3 = false">取 消</el-button>
        <el-button type="primary" @click.native="addProgramToolBag">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 方案参数选择-->
    <el-dialog title="选择" :visible.sync="paraSelect">
      <div class="dialog-box" v-if="modelNodeParaDatasVisible">
      <el-tree :default-expanded-keys="expanded" node-key="bsm" v-if="type=='图层树'" :data="nodeParaDatas"
               :highlight-current='true' @node-click="paraSelectNode" :props="defaultProps"></el-tree>
      <el-tree :default-expanded-keys="expanded" node-key="bsm" v-else-if="type=='字段列表'" :data="nodeParaDatas"
               @node-click="paraSelectNode" :props="nodeParaDatasProp1"></el-tree>
      <el-tree :default-expanded-keys="expanded" node-key="bsm" v-else-if="type==''" :data="nodeParaDatas"
               :highlight-current='true' @node-click="paraSelectNode" :props="nodeParaDatasProp2"></el-tree>
      </div>
      <div class="dialog-box" v-else><p class="selectResult">无选择项</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="dataTag" style="text-align:left;">
          <!-- <span>年度：</span>
          <el-select v-model="yearValue" placeholder="请选择">
            <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-input-number v-model="yearValue" :min="-10" :max="10" label="年度"></el-input-number>
        </div>
        <el-button @click="paraSelect = false">取 消</el-button>
        <el-button type="primary" @click="paraSelectClick">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import api from "../../fetch/index";
  import treeItem from "./entiretyTableList/treeItem.vue"; //自定义树控件子组件
  import treeItem1 from "@/components/treeItem.vue"; //临时
  export default {
    name: "datatool",
    data() {
      return {
        yearOptions: [
          {
            value: "年度1",
            label: "年度1"
          },
          {
            value: "年度2",
            label: "年度2"
          },
          {
            value: "年度3",
            label: "年度3"
          },
          {
            value: "年度4",
            label: "年度4"
          },
          {
            value: "年度5",
            label: "年度5"
          },
          {
            value: "年度6",
            label: "年度6"
          },
          {
            value: "年度7",
            label: "年度7"
          },
          {
            value: "年度8",
            label: "年度8"
          },
          {
            value: "年度9",
            label: "年度9"
          },
          {
            value: "年度10",
            label: "年度10"
          }
        ],
        yearValue: 0,
        toolNode: {},
        toolData: [],
        dialogFormVisible3: false,
        dialogFormVisible4: false,
        dialogFormVisible5: false,
        dialogFormVisible6: false,
        TreeRidNum: "",
        TreeRidNum1: "",
        TreeLabelName: "", //修改的
        TreeLabelName2: "", //增加的
        TreeLabelName3: "",
        TreeLabelDescribe: "", //节点描述
        defaultProps: {
          children: "children",
          label: "label",
          isLeaf:"isLeaf"
        },
        nodeParaDatasProp1: {
          children: "children",
          label: "label"
        },
        nodeParaDatasProp2: {
          children: "children",
          label: "label"
        },
        bagListTreeProps: {
          children: "children",
          label: "name"
        },
        addTool: false,
        addProgram: false, //‘添加工具’，‘删除工具’开关
        data: [], //定义方案树数据容器
        data2: [],
        loadTree: false, //方案树加载中效果开关
        loadTree2: false,
        parameters: [],
        parameters1: [],
        showProgram: false,
        toolRid: "",
        value6: "",
        addTool2: false,
        programTitle: "",
        programList: [], //定义工具列表容器
        modelrid: "",
        toolrid: "",
        parameterRid: "",
        addprogramBtn: false,
        parametersList: [],
        paraSelect: false,
        nodeParaDatas: [],
        tempData: [],
        type: "",
        dataTag: false,
        temp: "",
        dataSource: [],
        newNodeName: "",
        newNodeName1: "",
        addTool3: false,
        toolDataGroup: [],
        bagInfo: "bagInfo",
        bagListTree: [],
        tempToolBagRid: "",
        tempDate: [], //临时存储树节点
        tempNode: [], //临时存储树节点
        tempId: 0, //临时树节点id
        expanded: [], //默认展开节点,
        description: '工具说明',
        dialogTableVisible: false,
        rid: '',          //保存说明上传的rid
        toolrid: '',     //保存完工具参数要刷新
        toolType: 0,         //0代编工具 ，1 代表工具参数
        checkedNode:null,//选中的节点
        modelNodeParaDatasVisible:false,
        radio:"addFolder",
      };
    },
    components: {
      treeItem,
      treeItem1
    },
    mounted() {
      /** 2017/11/3
       *author:huangjianhui
       *功能:点击方案管理，初始化easyui布局控件
       */
      $("#toolKit").layout();
      // $('#bagList').layout();
      /** 2017/11/3
       *author:huangjianhui
       *功能:初始化方案树
       */
      this.getCatalog();
    },
    filters: {
      status(statu) {
        if (statu == 0) {
          return "输入";
        }
        if (statu == 1) {
          return "输出";
        }
      }
    },
    methods: {
      initLayout(tab) {
        if (tab.name === 'bagList') {
          // $('#bagList').layout()
        }
      },
      getCatalog() {
        this.loadTree = true;
        api.getToolBagTree().then(res => {
          if (res.data.code == "200") {
            this.data = res.data.message;
           // this.expanded = [];
            this.expanded.push(this.tempId);
          }
          this.loadTree = false;
        });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:工具参数列表下拉获取下拉内容
       */
      getParametersList(rid) {
        this.parametersList = [];
        api
          .dataGetAvailablePreParas({params: {nodeParaRid: rid}})
          .then(res => {
            this.parametersList = res.data.message;
          });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:当select选择器内容改变时，将改工具的value保存到参数列表中对应位置
       */
      saveParamet(e, rid) {
        /* preNode:前面节点id
         prepara:前面节点参数id*/
        if (this.temp == "arcgisTool") {
          this.temp = "";
          return false;
        }
        if (this.temp == "delate") {
          this.temp = "";
          return false;
        }
        this.setValue(e, rid);
      },
      removeTag(e, rid) {
        this.temp = "delate";
        this.setValue(e, rid, "delate");
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:选中或者删除，对应的节点值改变
       */
      setValue(val, rid, temp) {
        debugger
        //遍历找到参数列表中当前的参数
        if (this.parameters1.length == 0) {
          return false;
        }
        //遍历找到操作的该条参数列表
        for (var i = 0, len = this.parameters1.length; i < len; i++) {
          //如果找到了这条参数列表
          if (this.parameters1[i].rid == rid) {
            //判断是单选的还是多选的
            if (this.parameters1[i].multiValue == false) {
              //multivalue为false为单选
              //如果是从选择按钮选中的话
              if (temp == "arcgisTool") {
                //当前工具参数的下拉选项
                var parmeters = this.toolNode;
                this.parameters1[i].values = [];
                this.parameters1[i].values.push(parmeters);
                if (this.type == "图层树") {
                  this.parameters1[i].valuess = this.toolNode.name;
                } else if (this.type == "字段列表") {
                  this.parameters1[i].valuess = this.toolNode.AliasName;
                } else {
                  this.parameters1[i].valuess = this.toolNode.name;
                }
                this.toolNode = {};
              } else {
                //如果不是从选择按钮选中的话，有两种可能，一种是列表选中，一种是手动输入
                //当前工具参数的下拉选项

                var parmeters = this.parametersList;
                if (parmeters == null || parmeters.length == 0) {
                  var obj = {};
                  obj.template = val;
                  this.parameters1[i].values = [];
                  this.parameters1[i].values.push(obj);
                  return false;
                }
                var tempArr = [];
                for (var j = 0, len = parmeters.length; j < len; j++) {
                  tempArr.push(parmeters[j].text);
                }
                if ($.inArray(val, tempArr) == -1) {
                  //如果选择的值不在列表中
                  var obj = {};
                  obj.template = val;
                  this.parameters1[i].values = [];
                  this.parameters1[i].values.push(obj);
                } else {
                  for (var j = 0, len = parmeters.length; j < len; j++) {
                    if (val == parmeters[j].text) {
                      //如果选中的值在列表中的位置,把该条列表信息插入列表的values中
                      var obj = {};
                      obj.preNode = this.parametersList[j].nodeRid;
                      obj.prePara = this.parametersList[j].rid;
                      this.parameters1[i].values = [];
                      this.parameters1[i].values.push(obj);
                    }
                  }
                }
              }
            } else if (this.parameters1[i].multiValue == true) {
              if (temp == "arcgisTool") {
                //当前工具参数的下拉选项
                var parmeters = this.toolNode;
                this.parameters1[i].values.push(parmeters);
                if (this.type == "图层树") {
                  this.parameters1[i].valuess.push(this.toolNode.name);
                } else if (this.type == "字段列表") {
                  this.parameters1[i].valuess.push(this.toolNode.AliasName);
                } else {
                  this.parameters1[i].valuess.push(this.toolNode.name);
                }
                this.toolNode = {};
              } else if (temp == "delate") {
                var parmeters = this.parameters1[i].values;
                for (var j = 0, len = parmeters.length; j < len; j++) {
                  if (val == parmeters[j].valueText) {
                    this.parameters1[i].values.splice(j, 1);
                  }
                }
              } else {
                //当前工具参数的下拉选项
                var parmeters = this.parametersList;
                if (parmeters == null || parmeters.length == 0) {
                  //如果下拉没有数据的话，这时候有可能是输入的
                  var value = val[val.length - 1];
                  var obj = {};
                  obj.template = value;
                  this.parameters1[i].values.push(obj);
                  return false;
                }

                var tempArr = [];
                for (var j = 0, len = parmeters.length; j < len; j++) {
                  tempArr.push(parmeters[j].text);
                }
                if ($.inArray(val[val.length - 1], tempArr) == -1) {
                  //如果选择的值不在列表中
                  var value = val[val.length - 1];
                  var obj = {};
                  obj.template = value;
                  this.parameters1[i].values.push(obj);
                } else {
                  for (var j = 0, len = parmeters.length; j < len; j++) {
                    if (val[val.length - 1] == parmeters[j].text) {
                      //多选时候val是数组
                      var obj = {};
                      obj.preNode = this.parametersList[j].nodeRid;
                      obj.prePara = this.parametersList[j].rid;
                      this.parameters1[i].values.push(obj);
                    }
                  }
                }
              }
            }
            break;
          }
        }
      },

      /** 2017/11/3
       *author:huangjianhui
       *功能:工具参数列表选择按钮，获取工具集合
       */
      // select(item) {
      //   debugger
      //   this.nodeParaDatas = [];
      //   this.tempData = item;
      //   this.paraSelect = true;
      //   var obj;
      //   if (item.obtainFrom != null) {
      //     for (var i = 0, len = this.parameters1.length; i < len; i++) {
      //       if (this.parameters1[i].name == item.obtainFrom) {
      //         obj = this.parameters1[i].values;
      //       }
      //     }
      //   } else {
      //     obj = null;
      //   }
      //   api
      //     .dataGetModelNodeParaDatas({
      //       params: {nodeParaRid: item.rid, paraValues: obj}
      //     })
      //     .then(res => {
      //       this.expanded = [];
      //       this.expanded.push(this.tempId);
      //       if (res.data.code == 200) {
      //         if (res.data.message != null) {
      //           this.modelNodeParaDatasVisible = true;
      //           if (res.data.message.type == "图层树") {
      //             this.type = "图层树";
      //             this.nodeParaDatas.push(res.data.message.data[0]);
      //             this.dataTag = true;
      //           } else if (res.data.message.type == "字段列表") {
      //             this.type = "字段列表";
      //             this.nodeParaDatas = res.data.message.data;
      //             this.dataTag = false;
      //           } else {
      //             this.nodeParaDatas = res.data.message.data;
      //             this.type = "";
      //             this.dataTag = false;
      //           }
      //         }else{
      //           this.modelNodeParaDatasVisible = false;
      //         }
      //       }
      //     });
      // },
      select(item) {
        // if(item.displayName==='横向关系树（字段累计关系）'){
        //   this.paraSelect = true;
        //   this.classList= [];
        //   api.GetGLZ()
        //     .then(res=>{
        //       this.modelNodeParaDatasVisible = true;
        //       this.type='归类组'
        //       this.classList=res.data;
        //
        //     })
        // }else {
          this.nodeParaDatas = [];
          this.tempData = item;
          this.paraSelect = true;
          var obj = [];
          if (item.obtainFrom != null) {
            for (var i = 0, len = this.parameters1.length; i < len; i++) {
              if (this.parameters1[i].name == item.obtainFrom) {
                obj.push(this.parameters1[i].values);
              }
            }
          } else {
            obj = [];
          }
          api
            .dataGetModelNodeParaDatas({
              params: {nodeParaRid: item.rid, paraValues: obj}
            })
            .then(res => {
              if (res.data.code == 200) {
                this.expanded = [];
                this.expanded.push(this.tempId);
                this.message = res.data.message;
                // console.log(this.expanded);
                if (res.data.message != null) {
                  this.modelNodeParaDatasVisible = true;
                  if (res.data.message.type == "图层树") {
                    this.type = "图层树";
                    let temp = res.data.message.data;
                    for (let i = 0; i < temp.length; i++) {
                      this.nodeParaDatas.push(res.data.message.data[i]);
                    }
                    this.dataTag = true;
                  } else if (res.data.message.type == "字段列表") {
                    this.type = "字段列表";
                    this.nodeParaDatas = res.data.message.data;
                    this.dataTag = false;
                  } else if (res.data.message.type == "字典列表") {
                    this.type = "字典列表";
                    var temp = res.data.message.data;
                    var arr = [];
                    for (i in temp) {
                      var obj = {};
                      obj.label = i;
                      obj.value = temp[i];
                      obj.children = [];
                      arr.push(obj);
                    }
                    this.nodeParaDatas = arr;
                    this.dataTag = false;
                  }else {
                    this.nodeParaDatas = res.data.message.data;
                    this.type = "";
                    this.dataTag = false;
                  }
                }else if (res.data.message == null) {
                  this.modelNodeParaDatasVisible = false;
                }
              }

            });
       // }
      },
      paraSelectNode(data, node) {
        this.tempId = node.data.bsm;
        if (node.isLeaf) {
          if (this.type == "图层树") {
            //选中工具树之后，数据保存到toolNode中
            this.toolNode.dataBSM = node.data.bsm;
            this.toolNode.template = node.data.template;
            this.toolNode.yearGap = this.yearValue;
            this.toolNode.name = node.data.name;
          } else if (this.type == "字段列表") {
            this.toolNode.dataBSM = node.data.tempalteBSM;
            this.toolNode.fieldBSM = node.data.bsm;
            this.toolNode.template = node.data.template;
            this.toolNode.AliasName = node.data.AliasName;
          } else {
            this.toolNode.name = node.data.label;
            this.toolNode.template = node.data.label;
          }
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:保存工具集合工具的选择
       */
      paraSelectClick() {
        debugger
        console.log(this.type);
        console.log(this.tempData.displayName);
        if (this.toolNode == {}) {
          this.$message({
            message: "请选择工具!!",
            type: "warning"
          });
        } else {
          this.temp = "arcgisTool";
          if (this.type == "图层树") {
            this.toolNode.yearGap = this.yearValue;
          }
          this.setValue(this.tempData, this.tempData.rid, "arcgisTool");
          this.paraSelect = false;
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:工具参数列表保存参数
       */
      save() {
        debugger
        var str = JSON.stringify(this.parameters1);
        api.dataSaveModelNodeParas({nodeParas: str}).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            api
              .getToolBagParas({params: {toolBagRid: this.tempToolBagRid}})
              .then(res => {
                if (res.data.code == 200) {
                  this.bagListTree = res.data.message;
                }
              });
          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          }
        });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:删除工具
       */
      deleteTool() {
        if (this.toolRid != "") {
          this.$confirm("此工具将被删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            api.deleteTool({params: {rid: this.toolRid}}).then(res => {
            });
          });
        } else {
          this.$message({
            message: "请选择工具，或者工具目录",
            type: "warning"
          });
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:点击工具时候，展示工具下的参数列表
       */
      showProgramList(data, node) {
        if (node.isLeaf) {
          this.TreeLabelName = data.label;
          this.parameterRid = data.rid;
          this.parameters1 = [];
          this.TreeRidNum1 = data.rid;
          api
            .dataGetModelNodeParas({params: {nodeRid: this.parameterRid}})
            .then(res => {
              if (res.data.code == 200) {
                this.parameters1 = res.data.message;
              }
            });
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:点击添加工具时，保存对应工具的rid
       */
      saveToolrid(data, node) {
        this.tempId = node.data.id;
        if (node.isLeaf) {
          this.toolrid = data.attributes.rid;
        }
        let params = {
          modelRid: this.TreeRidNum,
          originRid: this.toolrid,
          nodeType: 0
        };
        api.getNewNodeName({params: params}).then(res => {
          if (res.data.code == 200) {
            this.newNodeName = res.data.message;
          }
        });
      },
      //工具包
      saveToolridBag(data, node) {
        this.tempId = node.data.id;
        if (node.isLeaf) {
          this.toolrid = data.attributes.rid;
        }
        let params = {
          modelRid: this.TreeRidNum,
          originRid: this.toolrid,
          nodeType: 1
        };
        api.getNewNodeName({params: params}).then(res => {
          if (res.data.code == 200) {
            this.newNodeName1 = res.data.message;
          }
        });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:添加工具
       */
      addProgramTool() {
        if (this.toolrid == "") {
          this.$message({
            message: "请选择要添加的工具",
            type: "warning"
          });
          return false;
        }
        let params = {
          nodeName: this.newNodeName,
          originRid: this.toolrid,
          modelRid: this.TreeRidNum,
          nodeType: 0,
          nodeGroup: -1
        };
        api.dataAddTool(params).then(res => {
          if (res.data.code == 200) {
            this.programList.push(res.data.message)
            this.newNodeName=''
            this.toolrid=''
            setTimeout(() => {     //延时选中
              this.parameterRid = res.data.message.rid
              this.$refs.toolKitList.setCurrentNode(res.data.message)
              api
                .dataGetModelNodeParas({params: {nodeRid: res.data.message.rid}})
                .then(res => {
                  if (res.data.code == 200) {
                    this.parameters1 = res.data.message;
                  }
                });
            }, 200)
            this.addTool2 = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
          }
        });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:添加工具包
       */
      addProgramToolBag() {
        if (this.toolrid == "") {
          this.$message({
            message: "请选择要添加的工具包",
            type: "warning"
          });
          return false;
        }
        let params = {
          nodeName: this.newNodeName1,
          originRid: this.toolrid,
          modelRid: this.TreeRidNum,
          nodeType: 1,
          nodeGroup: -1
        };
        api.dataAddTool(params).then(res => {
          if (res.data.code == 200) {
            //遍历this.programList找到当前要插入的父节点
            this.programList.push(res.data.message)
            this.newNodeName1=''
            this.toolrid=''
            setTimeout(() => {     //延时选中
              this.$refs.toolKitList.setCurrentNode(res.data.message)
              this.parameterRid = res.data.message.rid
              api
                .dataGetModelNodeParas({params: {nodeRid: res.data.message.rid}})
                .then(res => {
                  if (res.data.code == 200) {
                    this.parameters1 = res.data.message;
                  }
                });
            }, 200)
              this.addTool3 = false;

          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
          }
        });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:删除工具
       */
      delToolModel() {
        if (this.parameterToolRid == "") {
          this.$message({
            message: "请选择要删除的工具",
            type: "warning"
          });
        }
        api
          .delToolModel({
            rid: this.parameterRid
          })
          .then(res => {
            if (res.data.code == 200) {
              for (let i = 0; i < this.programList.length; i++) {
                if (this.programList[i].rid == this.parameterRid) {
                  this.programList.splice(i, 1);
                  this.$message({
                    message: "删除成功",
                    type: "warning"
                  });
                  this.parameters1 = [];
                }
              }
            }
          });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:自定义树控件
       */
      renderContent(h, {node, data, store}) {
        return h(treeItem, {
          props: {
            value: data,
            treeNode: node
          },
          on: {
            input: node => {
              data = node;
            },
            OpenEdit: eve => {
              if (this.checkedNode.level === 1) {
                this.dialogFormVisible4 = true;
              }else if ((this.checkedNode.level === 2)) {
                this.dialogFormVisible3 = true;
              }
            },
            Append: () => {
              this.dialogFormVisible5 = true;
              this.tempDate = data;
            },
            //删除节点
            Delete: nodeData => {
              this.dialogFormVisible6 = true;
              this.tempDate = data;
              this.tempNode = node;

            }
          }
        });
      },
      paramsList(h, {node, data, store}) {
        return h(treeItem1, {
          props: {
            value: data,
            treeNode: node
          },
          on: {
            input: node => {
              data = node;
            },
            OpenEdit: eve => {
              this.dialogFormVisible3 = true;
            }
          }
        });
      },
      //取消节点修改
      cancelRevise() {
        this.dialogFormVisible4 = false;
        this.dialogFormVisible3 = false;
      },
      //确定方案目录修改
      submitRevise() {
        let RenameReportCata = {
          rid: this.TreeRidNum,
          newName: this.TreeLabelName
        };
        api.dataRenameModel(RenameReportCata).then(res => {
          if (res.data.rid) {
            this.$message({
              showClose: true,
              message: "修改节点成功",
              type: "success"
            });
            this.getCatalog();
            this.dialogFormVisible4 = false;

          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "success"
            });
            this.getCatalog();
            this.dialogFormVisible4 = false;

          }
        });

      },
      //确定节点修改
      submitReviseNode() {
        let RenameReportCata = {
          rid: this.TreeRidNum,
          newName: this.TreeLabelName
        };
        api.renameModelNode(RenameReportCata).then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "success"
            });
            this.getCatalog();
            this.dialogFormVisible3 = false;

          }
        });
      },
      //取消增加方案
      cancelAppend() {
        this.dialogFormVisible5 = false;
        this.dialogFormVisible3 = false;
      },
      //确定增加方案
      submitAppend() {
        if (this.radio ==="addModel") {
          let AddReportCata = {
            srid: this.TreeRidNum,
            name: this.TreeLabelName2
          };
          api.addToolBag(AddReportCata).then(res => {
            if (res.data.code == 200) {
              this.$message({
                showClose: true,
                message: "增加节点成功",
                type: "success"
              });
            //  this.append(this.tempDate);
              this.getCatalog();
              this.dialogFormVisible5 = false;
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
              this.dialogFormVisible5 = false;
            }
          });
        }else{
            this.addFolder();
          }
      },

      //取消删除节点
      cancelDel() {
        this.dialogFormVisible6 = false;
      },
      //确定删除方案
      submitDel() {
        let dataDelModel = {
          rid: this.TreeRidNum
        };
        if (this.tempNode.data.iconCls != 'icon-modelset') {
          api.dataDelModel(dataDelModel).then(res => {
            if (res.data.code == 200) {
              this.$message({
                showClose: true,
                message: "删除方案成功",
                type: "success"
              });
             // this.remove(this.tempNode, this.tempDate);
              this.getCatalog();
              this.dialogFormVisible6 = false;
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
              this.getCatalog();
              this.dialogFormVisible6 = false;
            }
          });
        } else {
          api.delModelset(dataDelModel).then(res => {
            if (res.data.code == 200) {
              this.$message({
                showClose: true,
                message: "删除工具包成功",
                type: "success"
              });
             // this.remove(this.tempNode, this.tempDate);  buxuyao
              this.getCatalog();
              this.dialogFormVisible6 = false;
            }
          })
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:点击方案树列表，展示方案工具列表
       */
      FormTreeNodeClick(eve, node) {
        this.checkedNode = node;
        this.description = eve.attributes.description
        this.toolType = 0
        this.rid = eve.attributes.rid
        this.toolrid = eve.attributes.rid
        this.tempId = node.data.id;
        this.addProgram = false;
        this.programList = [];
        this.parameters1 = [];
        this.TreeLabelName = node.label;
        if (eve.attributes == undefined) {
          //没有rid为新增s
          return false;
        }
        this.TreeRidNum = eve.attributes.rid;
        if (node.isLeaf) {
          this.addProgram = true;
          var h = $("#toolKitlList").height() - 160;
          var w = $("#toolKitlList").width() - 30;
          var pListW = 200;
          $("#toolKitDetial").css({
            width: w,
            height: h,
            "margin-top": "20px"
          });
          $("#bagList").css({
            width: w,
            height: h + 100
          });
          $("#toolKitDetial").layout();
          $('#bagList').layout()
          $('#bagList').layout('collapse', 'east');
          $('#bagList').layout('expand', 'east');
          api
            .getModelNodes({params: {modelRid: eve.attributes.rid}})
            .then(res => {
              if (res.data.code == 200) {
                this.programList = res.data.message;
              }
            });

          api
            .dataGetModelDatas({params: {modelRid: eve.attributes.rid}})
            .then(res => {
              if (res.data.code == 200) {
                this.dataSource = res.data.message;
              }
            });
          this.tempToolBagRid = eve.attributes.rid;
          setTimeout(() => {
            api
              .getToolBagParas({params: {toolBagRid: eve.attributes.rid}})
              .then(res => {
                if (res.data.code == 200) {
                  this.bagListTree = res.data.message;
                  // $('#bagList').layout()
                }
              }, 1000);
          });
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:确定添加目录
       */
      addContents() {
        let AddReportCata = {
          prid: "",
          name: this.TreeLabelName3
        };
        api.dataAddToolBagSet(AddReportCata).then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: "增加目录成功",
              type: "success"
            });
            this.getCatalog();
            this.addprogramBtn = false;
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
            this.addprogramBtn = false;
          }
        });
      },
      addFolder() {
        let AddReportCata = {
          prid: this.TreeRidNum,
          name: this.TreeLabelName2
        };
        api.dataAddToolBagSet(AddReportCata).then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: "增加目录成功",
              type: "success"
            });
            this.addprogramBtn = false;
            this.dialogFormVisible5 = false;
            this.getCatalog();

          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "error"
            });
            this.dialogFormVisible5 = false;
            this.addprogramBtn = false;
          }
        });
      },
      //取消选择添加目录
      cancelAddContents() {
        this.addprogramBtn = false;
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:添加工具
       */
      getToolData() {
        this.addTool2 = true;
        if(this.toolData.length===0){
          api.fetchCatalog().then(res => {
            this.expanded = [];
            this.expanded.push(this.tempId);
            this.toolData = res.data;
            this.loadTree = false;
          });
        }
      },
      //获取工具包
      getToolDataGroup() {
        this.addTool3 = true;
        if(this.toolDataGroup.length===0){
          api.getToolBagTree().then(res => {
            if (res.data.code == 200) {
              this.expanded = [];
              this.expanded.push(this.tempId);
              this.toolDataGroup = res.data.message;
              this.loadTree = false;
            }
          });
        }
      },
      //添加删除树节点
      append(data) {
        const newChild = {
          id: this.TreeRidNum,
          label: this.TreeLabelName2,
          children: []
        };
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      showDescription(row) {
        this.toolType = 1
        this.rid = row.rid
        if (row.description === null) {
          this.description = "工具说明";
        } else {
          this.description = row.description;
        }
      },
      toolEdit() {
        if (this.dialogTableVisible === []) {
          return
        }
        this.dialogTableVisible = true
        this.toolTextarea = this.description
      },
      saveEdit() {
        if (this.toolType === 0) { //如果是工具
          api.setToolBagDescription({rid: this.rid, description: this.description})
            .then(res => {
              if (res.data.code === '200') {
                this.dialogTableVisible = false
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
              } else {
                alert(res)
              }
            })
        } else {
          api.setToolBagParaDescription({rid: this.rid, description: this.description})
            .then(res => {
              if (res.data.code === '200') {
                this.dialogTableVisible = false
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                api.getToolBagParas({params: {trid: this.toolrid}}).then(res => {
                  this.parameters = res.data;
                });
              } else {
                alert(res)
              }
            })
        }
      },
      loadNode(node,resolve){
        //console.log(node);
        if(node.level == 0){
          return false;
        }
       // console.log(node.data.id);
        api.getToolBagTree({params : {prid:node.data.id}}).then(res => {
          console.log(res);
          if (res.data.code == "200") {
             console.log('-->'+JSON.stringify(res.data.message));
             resolve(res.data.message)
          }
        });
      },
      loadToolNode(node,resolve){
        console.log(node);
        if(node.level==0){
          return false;
        }
        //console.log(node.data.id);
        api.fetchCatalog({params : {prid:node.data.id}}).then(res => {
          //console.log(res);
          if (res.status == "200") {
            // console.log('-->'+JSON.stringify(res.data));
            resolve(res.data)
          }
        });
      },
      loadToolBagNode(node,resolve){
        // console.log(node);
        if(node.level == 0){
          return false;
        }
        // console.log(node.data.id);
        api.getToolBagTree({params : {prid:node.data.id}}).then(res => {
          console.log(res);
          if (res.data.code == "200") {
            console.log('-->'+JSON.stringify(res.data.message));
            resolve(res.data.message)
          }
        });
      },
    }

  };
</script>
<style lang="less">
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .span_icon {
    display: inline;
  }
  .requiredGreen{
    width: 8px;
    height: 8px;
    background: #008800;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    display: inline-block;
    vertical-align:middle
  }
  .requiredRed{
    width: 8px;
    height: 8px;
    background: #F56C6C;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    display: inline-block;
    vertical-align:middle
  }
  .requiredList{
    display: inline-block;
    margin-left:8px;
  }
  .optionalList{
    display: inline-block;
    margin-left:17px;
  }
  .selectBtn{
    position:absolute;
    top:43px;
    right:5px;
  }
  .selectResult{
    text-align:center;
  }
  .addRatio{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
</style>
