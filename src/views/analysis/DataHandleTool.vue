<template>
  <div id="dataHandleTool" class="panel-content">
    <!--布局，左边方案树列表-->
    <div data-options="region:'west',split:true,collapsible:true,tools:'#tt'" title="方案列表" style="width:250px;">
      <div class="layout-box tool">
        <el-tree empty-text='' :default-expanded-keys="expanded" node-key="id" :data="data" v-loading.body="loadTree"
                 :props="defaultProps" highlight-current :render-content="renderContent" :expand-on-click-node="false"
                 @node-click="FormTreeNodeClick" :load="loadNode" lazy></el-tree>
      </div>
    </div>
    <div id="tt">
      <a href="javascript:void(0)" class="icon-add" @click="addprogramBtn=true" title="添加文件夹"></a>
      <a href="javascript:void(0)" class="icon-reload" @click="getCatalog" title="刷新"></a>
    </div>

    <!--布局，左边方案树列表-->
    <!--布局，右边方案详情，包括工具以及工具参数列表-->
    <div data-options="region:'center',split:true,collapsible:true" title="方案信息" id="modelList">
      <!--<div class="layout-box program">-->
      <!--<div>-->
      <div v-if="addProgram" class="btn-group" style="margin-left: 50px;margin-top: 15px">
        <el-button type="primary" icon="plus" @click.native="getToolData">添加工具</el-button>
        <el-button type="primary" icon="plus" @click.native="getToolDataGroup">添加工具包</el-button>
        <el-button type="primary" icon="delete2" @click="delToolModel">删除</el-button>
      </div>
      <div id="addProgramBox" class="easyui-layout layout-box program" fit="true" data-options="maxHeight:480">
        <div data-options="region:'west',split:true,collapsible:true" id="pList" title="列表">
          <!--   &lt;!&ndash;方案的工具列表&ndash;&gt; -->
          <el-tree empty-text='' :data="programList" :props="defaultProps" @node-click="showProgramList"
                   ref="toolParamsList"
                   highlight-current :render-content="paramsList" :expand-on-click-node="false"
                   default-expand-all node-key="nodeGroup"></el-tree>
          <!-- <ul class="program-list">
            <li v-for="(item,index) in programList" :key="index" :data-rid='item.rid' :data-name='item.name' @click="">{{item.name}}</li>
          </ul> -->
          <!--  &lt;!&ndash;方案的工具列表&ndash;&gt; -->
        </div>
        <div data-options="region:'center',split:true,collapsible:true,maxWidth:1217" id="paraList" title='参数'>
          <!--  &lt;!&ndash;工具的参数列表&ndash;&gt; -->
          <div v-for="(item,index) in parameters1" :key="index" style="padding:0 10px;position:relative">
            <!--如果参数字段为json类型，则要展示树状架构-->
            <div v-if="item.required == true">
              <p v-if="item.valuess=='' && item.readonly==false" class="requiredRed"></p>
              <p v-else class="requiredGreen"></p>
              <p class="requiredList">{{item.displayName}}</p>
            </div>
            <div v-else ><p class="optionalList">{{item.displayName}}(选填)</p></div>

            <el-tree v-if="item.displayStyle=='json' && item.valuess!==''" class="tiaoping-tree" :data="appendTree" :props="tiaopingTree" ref="tiaopingTree"
                     :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button type="text" size="mini" @click="() => tiaopingAppend(data)">Append</el-button>
                    <el-button type="text" size="mini" @click="() => tiaopingRemove(node, data)">Delete</el-button>
                  </span>
                </span>
            </el-tree>
            <div v-else>
              <el-select :disabled="item.readonly" clearable allow-create filterable :multiple="item.multiValue"
                         v-model="item.valuess" type='large' placeholder="请选择"
                         @focus="getParametersList(item.rid)" @change="saveParamet($event,item.rid)"
                         @remove-tag="removeTag($event,item.rid)" style="display:block;padding-right:60px;">
                <el-option v-for="item in parametersList" :key="item.nodeRid" :label="item.text"
                           :value="item.text"></el-option>
              </el-select>
            </div>
            <el-button class="selectBtn" :disabled="item.readonly" size="small" type="primary" @click.native="select(item)">选择
            </el-button>
          </div>
          <!--   &lt;!&ndash;工具的参数列表&ndash;&gt; -->
          <div style="text-align:center;margin:8px 40px;" v-if="parameters1.length>0">
            <el-button type="primary" @click.native="save">保存</el-button>
          </div>
        </div>
        <div data-options="region:'east',split:true,collapsible:true" title="数据源" style="width:200px;">
          <el-tree empty-text='' :data='dataSource' :props="defaultProps"></el-tree>
        </div>
      </div>
    </div>
    <!--</div>-->
    <!--</div>-->
    <!-- 修改方案弹窗 start-->
    <el-dialog title="修改方案" :visible.sync="dialogFormVisible4" size=tiny>
      <el-input size="small" placeholder="请输入节点名称" v-model="TreeLabelName"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRevise" size=small>取 消</el-button>
        <el-button type="primary" @click="submitRevise" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改方案名称" :visible.sync="dialogFormVisible3" size=tiny>
    <el-input size="small" placeholder="请输入节点名称" v-model="TreeLabelName"></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelRevise" size=small>取 消</el-button>
      <el-button type="primary" @click="submitReviseNode" size=small>确 定</el-button>
    </div>
  </el-dialog>
    <el-dialog title="修改节点名称" :visible.sync="projectRenameVisible" size=tiny>
      <el-input size="small" placeholder="请输入名称" v-model="TreeLabelName"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRevise" size=small>取 消</el-button>
        <el-button type="primary" @click="submitProjectRename" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增加方案弹窗 start-->
    <el-dialog title="添加目录" :visible.sync="dialogFormVisible5" size=tiny>
      <el-input size="small" placeholder="请输入文件夹或者模型名称" v-model="TreeLabelName2"></el-input>
      <div class="addRatio">
      <el-radio v-model="radio" label="addFolder">添加文件夹</el-radio>
      <el-radio v-model="radio" label="addModel">添加模型</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAppend" size=small>取 消</el-button>
        <el-button type="primary" @click="submitAppend" size=small>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除方案弹窗 start-->
    <el-dialog title="删除方案" :visible.sync="dialogFormVisible6" size=tiny>
      <p style="color:#ff4949">确定删除方案？</p>
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
        <el-tree :default-expanded-keys="expanded" node-key="id" ref="myTree" v-loading.body="loadTree" :data="toolData"
                 :highlight-current='true' @node-click="saveToolrid" :load="loadToolNode" lazy :props="defaultProps"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-form label-width="75px">
          <el-form-item label="节点名称">
            <el-input v-model="newNodeName"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="75px">
          <el-form-item label="节点环节">
            <el-select v-model="nodeGroup" placeholder="请选择" style="display:block;">
              <el-option key="预处理" label="预处理" value="0"></el-option>
              <el-option key="处理" label="处理" value="1"></el-option>
              <el-option key="汇总" label="汇总" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-button @click="addTool2 = false">取 消</el-button>
        <el-button type="primary" @click.native="addProgramTool">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加工具包 -->
    <el-dialog title="添加工具包" :visible.sync="addTool3" size="tiny">
      <div class="dialog-box">
        <el-tree ref="myTree1" :default-expanded-keys="expanded" node-key="id" v-loading.body="loadTree"
                 :data="toolDataGroup" :highlight-current='true' @node-click="saveToolridBag" :props="defaultProps" :load="loadToolBagNode" lazy ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-form label-width="90px">
          <el-form-item label="节点名称">
            <el-input v-model="newNodeNameBag"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="90px">
          <el-form-item label="节点环节">
            <el-select v-model="nodeGroupBag" placeholder="请选择" style="display:block;">
              <el-option key="预处理" label="预处理" value="0"></el-option>
              <el-option key="处理" label="处理" value="1"></el-option>
              <el-option key="汇总" label="汇总" value="2"></el-option>
            </el-select>
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
        <el-tree :default-expanded-keys="expanded" node-key="bsm" v-else-if="type=='字典列表'" :data="nodeParaDatas"
                 :highlight-current='true' @node-click="paraSelectNode" :props="nodeParaDatasProp1"></el-tree>
        <el-tree :default-expanded-keys="expanded" node-key="bsm" v-else-if="type==''" :data="nodeParaDatas"
                 :highlight-current='true' @node-click="paraSelectNode" :props="nodeParaDatasProp2"></el-tree>
        <ul v-for="(item,index) in classList" class="classList" v-if="type=='归类组'">
          <li :key="index"  @click="GetGlTree(item,$event)">{{item.GLZMC}}</li>
        </ul>
        <ul v-for="(item,index) in classList" class="classList" v-else>
        </ul>
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
    //增加字段
    <el-dialog title="增加字段" :visible.sync="dialogFormVisible7" size=tiny>
      <div>
        <el-tree :data="fieldData" :default-expanded-keys="expanded" node-key="label" :props="fieldProps" show-checkbox
                 v-loading.body="loadTree" ref="fieldTree"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAppend" size=small>取 消</el-button>
        <el-button type="primary" @click="fieldAppend" size=small>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import api from "../../fetch/index";
  //import treeItem from "./entiretyTableList/treeItem.vue"; //自定义树控件子组件
  import toolbagTreeItem from "../../components/toolbagTreeItem";//自定义树控件子组件
  // import jsPlumb from "@/libs/jsplumb.min.js"; //编辑方案拖拽效果插件
  // import initPlumb from "@/assets/scripts/dataHandleTool"; //编辑方案拖拽效果脚本
  import treeItem1 from "@/components/treeItem.vue"; //临时

  export default {
    name: "datatool",
    data() {
      return {
        tempId: "",
        classList:[],
        glTree:[],
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
        dialogFormVisible7: false,
        projectRenameVisible:false,
        modelNodeParaDatasVisible:false,
        c: false,
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
        fieldProps: {
          children: 'Childrens',
          label: 'label'
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
        nodeGroup: "0",
        nodeGroupBag: "0",
        newNodeName: "",
        newNodeNameBag: "",
        addTool3: false,
        toolDataGroup: [],
        tempDate: [], //临时存储树节点
        tempNode: [], //临时存储树节点
        tempId: 0, //临时树节点id
        expanded: [], //默认展开节点
        nodegroupexpanded: [],
        nodeexpandedid: '',
        tiaopingTree: {   //调平工具树
          children: "Childrens",
          label: "Header"
        },
        fieldData: null,
        appendTree: [],
        pushHeader: [],
        newChild: {},
        checkedNode:null,
        resolveData:null,
        radio:"addFolder",
        message:"",
        valuesTemplates:[]
      };
    },
    components: {
    //  treeItem,
      toolbagTreeItem
    },
    mounted() {
      /** 2017/11/3
       *author:huangjianhui
       *功能:点击方案管理，初始化easyui布局控件
       */
      $("#dataHandleTool").layout();
      /** 2017/11/3
       *author:huangjianhui
       *功能:初始化方案树
       */
      this.getCatalog();
      // initPlumb();
    },
    methods: {
      getCatalog() {
        this.loadTree = true;
        api.dataDetCatalog().then(res => {
          if (res.data.code == "200") {
            this.data = res.data.message;
            //this.expanded = [];
            this.expanded.push(this.tempId);
          }
          this.loadTree = false;
        });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:工具参数列表获取焦点时下拉获取下拉内容
       */
      getParametersList(rid) {
        this.parametersList = [];
        api
          .dataGetAvailablePreParas({params: {nodeParaRid: rid}})
          .then(res => {
            this.parametersList = res.data.message;
          });
      },
      //增加字段
      getDataTemplateFields() {
        api.dataTemplateFields().then(res => {
          this.fieldData = res.data;
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
      // removeTag(e, rid) {
      //   this.temp = "delate";
      //   this.setValue(e.value, rid, "delate");
      // },
      removeTag(e, rid) {
        debugger
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
            this.valuesTemplates = [];//输入框里的全部值，用于判断增加时有无相同的项
                for (var m = 0; m < this.parameters1[i].values.length; m++) {
                  //如果有template,则为其他类型.如果没template，就是前节点获取的，则是下拉选项
                  if (this.parameters1[i].values[m].template) {

                  this.valuesTemplates.push(this.parameters1[i].values[m].template);
                  }else{
                    this.valuesTemplates.push(this.parameters1[i].values[m].prePara);
                  }

                }

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
                } else if (this.type == "字典列表") {
                  this.parameters1[i].valuess = this.toolNode.valueText;
                } else {
                  this.parameters1[i].valuess = this.toolNode.name;
                }
                this.toolNode = {};
              } else {
                //如果不是从选择按钮选中的话，有两种可能，一种是列表选中，一种是手动输入
                //当前工具参数的下拉选项

                var parmeters = this.parametersList;
                debugger
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
                  debugger
                  this.parameters1[i].valuess.push(this.toolNode.name);
                } else if (this.type == "字段列表") {
                  this.parameters1[i].valuess.push(this.toolNode.AliasName);
                } else {
                  this.parameters1[i].valuess.push(this.toolNode.name);
                }
                this.toolNode = {};
              } else if (temp == "delate") {
                debugger
                var parmeters = this.parameters1[i].values;
                for (var j = 0, len = parmeters.length; j < len; j++) {
                 // if (val == parmeters[j].valueText) {
                  if (val == parmeters[j].template || val == parmeters[j].valueText||val == parmeters[j].name||val == parmeters[j].preText){
                    this.parameters1[i].values.splice(j, 1);
                    console.log(this.parameters1[i].values);
                  }
                }
                debugger
                this.temp = "";
              } else {
                debugger
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
                  //如果选择的值不在下拉列表中，有可能是输入的
                  var value = val[val.length - 1];
                  var obj = {};
                  obj.template = value;
                  //如果输入的值不在输入框内
                   debugger
                  if (this.valuesTemplates.indexOf(value)== -1) {
                    this.parameters1[i].values.push(obj);
                }
                } else {//如果选择的值在下拉列表中，就是下拉选择的
                  debugger
                  var value = val[val.length - 1];
                  for (var j = 0, len = parmeters.length; j < len; j++) {
                    if (value == parmeters[j].text) {
                      var prepraData = parmeters[j].rid;
                    if (this.valuesTemplates.indexOf(prepraData)== -1) {
                      //多选时候val是数组
                      var obj = {};
                      obj.preNode = this.parametersList[j].nodeRid;
                      obj.prePara = this.parametersList[j].rid;
                      obj.preText = this.parametersList[j].text;
                      this.parameters1[i].values.push(obj);

                    }
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
      select(item) {
        if(item.displayName==='横向关系树（字段累计关系）'){
          this.paraSelect = true;
          this.classList= [];
          api.GetGLZ()
            .then(res=>{
              this.modelNodeParaDatasVisible = true;
              this.type='归类组'
              this.classList=res.data;

            })
        }else {
          this.nodeParaDatas = [];
          this.tempData = item;
          this.paraSelect = true;
          var obj = "";
          if (item.obtainFrom != null) {
            for (var i = 0, len = this.parameters1.length; i < len; i++) {
              if (this.parameters1[i].name == item.obtainFrom) {
                obj=JSON.stringify(this.parameters1[i].values);
              }
            }
          } else {
            obj = "";
          }
          let GetModelNodeParaParams = {
            nodeParaRid: item.rid,
            paraValues: obj
          }
          api.dataGetModelNodeParaDatas({params:GetModelNodeParaParams}).then(res => {
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
        }
      },
      paraSelectNode(data, node) {
        this.tempId = node.data.bsm;
       // this.tempId = node.data.id;
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
          } else if (this.type == "字典列表") {
            this.toolNode.template = node.data.value;
            this.toolNode.valueText = node.data.label;
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

        //debugger
        if (this.message==null) {//message为null
          this.paraSelect = false;
        }else if(this.classList.length>0){//取到值的话
         // console.log(this.type);
          if (this.type=='归类组') {
          if(this.glTree.length==0){
            this.$message({
              message: "请选择归类组!!",
              type: "warning"
            });
          }else{
            api.GetGlTree({params:{bsm:this.glTree.BSM}})
              .then(res=>{
                this.parameters1[3].valuess=JSON.stringify(res.data)
                let arr=[]
                arr.push(JSON.parse(this.parameters1[3].valuess))
                this.appendTree = arr;
                this.paraSelect=false;

                let obj = {
                  template: this.parameters1[3].valuess
                }
                this.parameters1[3].values = [];
                this.parameters1[3].values.push(obj)
              })
          }
          }else if (this.type == "图层树") {
            this.temp = "arcgisTool";
            this.toolNode.yearGap = this.yearValue;
            this.setValue(this.tempData, this.tempData.rid, "arcgisTool");
            this.paraSelect = false;
          }else if (this.type == "字段列表"||this.type == "字典列表") {
            this.temp = "arcgisTool";
            this.setValue(this.tempData, this.tempData.rid, "arcgisTool");
            this.paraSelect = false;
          }else if (this.tempData.displayName === '原始表') {
              if (this.$refs.tiaopingTree === undefined) {

                let params = {
                  rkmbbsm: this.toolNode.dataBSM
                }
                api.ColTree({params: params})
                  .then(res => {
                    if (res.data.code == 99) {
                      this.$message({
                        message: res.data.message,
                        type: 'error'
                      });
                    } else {
                      for (let i = 0; i < this.parameters1.length; i++) {
                        if (this.parameters1[i].name === "input_horizontalRel") {
                          let jsonStr = JSON.stringify(res.data)
                          this.parameters1[i].valuess = jsonStr
                          let obj = {
                            template: jsonStr
                          }
                          this.parameters1[i].values = []
                          this.parameters1[i].values.push(obj)
                        }
                      }
                    }
                  })
              }
            }
        }else{
          if (this.toolNode == {}) {
            this.$message({
              message: "请选择工具!!",
              type: "warning"
            });
          } else {
            //如果调平树没有值，要请求接口，
            if (this.tempData.displayName === '原始表') {
              if (this.$refs.tiaopingTree === undefined) {

                let params = {
                  rkmbbsm: this.toolNode.dataBSM
                }
                api.ColTree({params: params})
                  .then(res => {
                    if (res.data.code == 99) {
                      this.$message({
                        message: res.data.message,
                        type: 'error'
                      });
                    } else {
                      for (let i = 0; i < this.parameters1.length; i++) {
                        if (this.parameters1[i].name === "input_horizontalRel") {
                          let jsonStr = JSON.stringify(res.data)
                          this.parameters1[i].valuess = jsonStr
                          let obj = {
                            template: jsonStr
                          }
                          this.parameters1[i].values = []
                          this.parameters1[i].values.push(obj)
                        }
                      }
                    }
                  })
              }
            }


            this.temp = "arcgisTool";
            if (this.type == "图层树") {
              this.toolNode.yearGap = this.yearValue;
            }
            this.setValue(this.tempData, this.tempData.rid, "arcgisTool");
            this.paraSelect = false;

          }
        }

      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:工具参数列表保存参数
       */
      save() {
        var str = JSON.stringify(this.parameters1);
          console.log('-save--: '+str+'----------------')
        api.dataSaveModelNodeParas({nodeParas: str}).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success"
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

        this.nodeGroup = data.nodeGroup.toString()
        this.nodeGroupBag = data.nodeGroup.toString()
//        this.nodeexpandedid = node.data.nodeGroup
        if (node.isLeaf) {
          this.parameterRid = data.rid;
          this.parameters1 = [];
          this.TreeRidNum1 = data.rid;
          this.TreeLabelName = data.label;
          api
            .dataGetModelNodeParas({params: {nodeRid: this.parameterRid}})
            .then(res => {
              if (res.data.code == 200) {
                this.parameters1 = res.data.message;
               // this.appendTree = [];
               // this.appendTree.push(JSON.parse(this.parameters1[3].valuess));

               // console.log(this.appendTree);
                // for (var i = 0; i < this.parameters1.length; i++) {
                //   if (this.parameters1[i].displayStyle == 'json' && this.parameters1[i].valuess !== '') {
                //     this.appendTree = this.parameters1[i].valuess
                //     this.appendTree = JSON.parse(this.appendTree)
                //
                //   }
                // }
               // console.log(this.appendTree);
                for (var i = 0; i < this.parameters1.length; i++) {
                  if (this.parameters1[i].displayStyle == 'json' && this.parameters1[i].valuess !== '') {
                    //this.parameters1 = res.data.message;
                    this.appendTree = [];
                    this.appendTree.push(JSON.parse(this.parameters1[i].valuess));
                    // this.appendTree = this.parameters1[i].valuess
                    // this.appendTree = JSON.parse(this.appendTree)

                  }
                }
              }
            });
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:点击添加工具时，保存对应工具的rid
       */
      saveToolrid(data, node) {
        // console.log(node.data.id)
        this.aa = node.data.id
        this.tempId = node.data.id;
        if (node.isLeaf) {
          this.toolrid = data.attributes.rid;
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
        }
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
            this.newNodeNameBag = res.data.message;
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
          originRid: this.toolrid,
          modelRid: this.TreeRidNum,
          nodeType: 0,
          nodeGroup: this.nodeGroup,
          nodeName: this.newNodeName
        };
        api.dataAddTool(params).then(res => {
          if (res.data.code == 200) {
            //遍历this.programList找到当前要插入的父节点
            for (let i = 0; i < this.programList.length; i++) {
              if (this.programList[i].nodeGroup == this.nodeGroup) {
                this.programList[i].children.push(res.data.message)
                setTimeout(() => {     //延时选中
                  this.$refs.toolParamsList.setCurrentNode(res.data.message)
                  this.parameterRid = res.data.message.rid
                }, 200)
                api
                  .dataGetModelNodeParas({params: {nodeRid: res.data.message.rid}})
                  .then(res => {
                    if (res.data.code == 200) {
                      this.parameters1 = res.data.message;
                    }
                  });
              }
            }
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
          nodeName: this.newNodeNameBag,
          originRid: this.toolrid,
          modelRid: this.TreeRidNum,
          nodeType: 1,
          nodeGroup: this.nodeGroupBag
        };
        api.dataAddTool(params).then(res => {
          if (res.data.code == 200) {
            //遍历this.programList找到当前要插入的父节点
            for (let i = 0; i < this.programList.length; i++) {
              if (this.programList[i].nodeGroup == this.nodeGroupBag) {
                this.programList[i].children.push(res.data.message)
                setTimeout(() => {     //延时选中
                  this.$refs.toolParamsList.setCurrentNode(res.data.message)
                  this.parameterRid = res.data.message.rid
                }, 200)
                api
                  .dataGetModelNodeParas({params: {nodeRid: res.data.message.rid}})
                  .then(res => {
                    if (res.data.code == 200) {
                      this.parameters1 = res.data.message;
                    }
                  });
              }
            }

            this.addTool3 = false;
          } else {

          }
        });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:删除工具
       */
      delToolModel() {
        if (this.parameterRid === undefined) {
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
              this.$message({
                message: "删除成功",
                type: "warning"
              });
              api
                .dataGetModelNodes({params: {modelRid: this.TreeRidNum}})
                .then(res => {
                  if (res.data.code == 200) {
                    this.programList = res.data.message;
                    this.parameters1 = []
                  }
                });
            }
          });
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:自定义树控件
       */
      renderContent(h, {node, data, store}) {
            return h(toolbagTreeItem, {
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
              if (node.isLeaf == false) {
                this.$message("此节点不可修改");
                return false;
              }
              this.projectRenameVisible = true;
            }

          }
        });

      },
      //取消节点修改
      cancelRevise() {
        this.dialogFormVisible4 = false;
        this.dialogFormVisible3 = false;
        this.projectRenameVisible = false;
      },
      //确定节点修改
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
            this.dialogFormVisible4 = false;
            this.getCatalog();
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "success"
            });
            this.dialogFormVisible4 = false;
            this.getCatalog();
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
            this.dialogFormVisible3 = false;
            this.getCatalog();
          }
        });
      },
      //确定节点修改
      submitProjectRename() {
        let RenameReportCata = {
          rid: this.parameterRid,
          newName: this.TreeLabelName
        };
        api.renameProjectName(RenameReportCata).then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: "success"
            });
            this.projectRenameVisible = false;
            this.getModelNodeGroups();//刷新列表
          }
        });
      },

      //取消增加方案
      cancelAppend() {
        this.dialogFormVisible5 = false;
        this.dialogFormVisible3 = false;
        this.dialogFormVisible7 = false;
      },

      //确定增加方案
      submitAppend() {
        if (this.radio ==="addModel") {
        let AddReportCata = {
          srid: this.TreeRidNum,
          name: this.TreeLabelName2
        };
        api.dataAddModel(AddReportCata).then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: "增加节点成功",
              type: "success"
            });
            this.loadTree = true;
            // api.dataDetCatalog().then(res => {
            //   if (res.data.code == "200") {
            //     this.data = res.data.message;
            //   }
            //   this.loadTree = false;
            // });
            this.getCatalog();
           // this.append(this.tempDate);
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
        console.log("------------> "+this.tempNode.data.iconCls)
        let dataDelModel = {
          rid: this.TreeRidNum
        };
        if (this.tempNode.data.iconCls != "icon-modelset") {
          api.dataDelModel(dataDelModel).then(res => {
            if (res.data.code == 200) {
              this.remove(this.tempNode, this.tempDate);
              this.$message({
                showClose: true,
                message: "删除方案成功",
                type: "success"
              });
              this.getCatalog();
              this.dialogFormVisible6 = false;
            } else {
              this.remove(this.tempNode, this.tempDate);
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
              this.dialogFormVisible6 = false;
              this.getCatalog();
            }
          });
        } else {
          api.delModelset(dataDelModel).then(res => {
            console.log(res)
            　if (res.data.code == 200) {
              this.$message({
                showClose: true,
                message: "删除方案成功",
                type: "success"
              });
               //this.remove(this.tempNode, this.tempDate);　buxuyao
              this.dialogFormVisible6 = false;
              this.getCatalog();
            }　
          });
        }
      },
      /** 2017/11/3
       *author:huangjianhui
       *功能:点击方案树列表，展示方案工具列表
       */
      FormTreeNodeClick(eve, node) {
        this.checkedNode = node;
        this.tempId = node.data.id;
      //  this.tempId = node.id;
        this.addProgram = false;
        this.programList = [];
        this.parameters1 = [];
        this.TreeLabelName = node.label;
        this.TreeRidNum = eve.attributes.rid;
        if (node.isLeaf) {
          this.addProgram = true;
          var h = $("#modelList").height() - 120;
          var w = $("#modelList").width() - 50;
          var pListW = 200;
          var paraListW = w - pListW;
          $("#addProgramBox").css({
            // width: w,
            height: h,

            "margin-top": "20px",
            // "margin-bottom": "-15px",
            "margin": "20px 50px",
          });
          $("#pList").css({
            width: pListW,
            height: h
          });
          $("#paraList").css({
            width: paraListW,
            height: h
          });
          $("#addProgramBox").layout();
          this.getModelNodeGroups();//获取列表
          // api
          //   .dataGetModelNodes({params: {modelRid: eve.attributes.rid}})
          //   .then(res => {
          //     if (res.data.code == 200) {
          //       this.programList = res.data.message;
          //
          //       // console.log('ss+' + JSON.stringify(this.programList))
          //     }
          //   });
          setTimeout(() => {
            api
              .dataGetModelDatas({params: {modelRid: eve.attributes.rid}})
              .then(res => {
                if (res.data.code == 200) {
                  this.dataSource = res.data.message;
                }
              });
          }, 1000);
        }
      },
      //刷新列表
      getModelNodeGroups(){
        api
          .dataGetModelNodes({params: {modelRid: this.TreeRidNum}})
          .then(res => {
            if (res.data.code == 200) {
              this.programList = res.data.message;

              // console.log('ss+' + JSON.stringify(this.programList))
            }
          });
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
        api.dataAddModelset(AddReportCata).then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: "增加目录成功",
              type: "success"
            });
            this.addprogramBtn = false;
            this.getCatalog();
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
        api.dataAddModelset(AddReportCata).then(res => {
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
        this.newNodeName = ''
        this.toolrid = ""
        if (this.$refs.myTree) {
          this.$refs.myTree.setCurrentKey([]);
        }
        if (this.toolData.length === 0) {
          api.fetchCatalog().then(res => {
          //  this.expanded = [];
            this.expanded.push(this.tempId);
            this.toolData = res.data;
            this.loadTree = false;
          });
        }
      },
      //获取工具包
      getToolDataGroup() {
        this.addTool3 = true;
        this.newNodeNameBag = ''
        this.toolrid = ""
        if (this.$refs.myTree1) {
          this.$refs.myTree1.setCurrentKey([]);
        }
        if (this.toolDataGroup.length === 0) {
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
      traverseTree(node) {
        if (!node) {
          return;
        }

        for (var item in node) {
          this.traverse(node[item]);
        }
        ;
      },
      traverse(f) {//递归
        if (f.Childrens && f.Childrens.length > 0) {
          var i = 0;
          for (i = 0; i < f.Childrens.length; i++) {
            if (this.appenddata.Name == f.Childrens[i].Name) {
              f.Childrens[i].Childrens.push(this.newChild)
            }
            this.traverse(f.Childrens[i]);
          }
        }
      },
      fieldAppend() {  //确认键添加节点
        this.dialogFormVisible7 = false;
        this.pushHeader = this.$refs.fieldTree.getCheckedKeys()
        for (var i = 0; i < this.pushHeader.length; i++) {

          this.newChild[i] = {
            id: this.TreeRidNum,
            Name: this.pushHeader[i],
            Header: this.pushHeader[i],
            Childrens: []
          }
          this.newChild = this.newChild[i];
          for (var k = 0; k < this.appendTree.length; k++) {
            if (this.appenddata.Name == this.appendTree[k].Name) {

              this.appendTree[k].Childrens.push(this.newChild)
            }

          }
          this.traverseTree(this.appendTree, this.newChild);
        }

      },
      //调平工具添加删除树节点
      //添加删除树节点
      tiaopingAppend(data) {
        this.appenddata = data;
        this.dialogFormVisible7 = true;
        this.getDataTemplateFields();
      },


      tiaopingRemove(node, data) {
        const parent = node.parent;
        const children = parent.data.Childrens || parent.data;
        const index = children.findIndex(d => d.Header === data.Header);
        children.splice(index, 1);

      },
      //获取归类树
      GetGlTree(item,event){
        $('.classList li').css('background-color','#fff')
        $(event.target).css('background-color','#ccc')
        this.glTree=item;
      },
      loadNode(node,resolve){
       // console.log("resolvenode");
        //console.log(node)
        if (node.level==0) {
          return false;
        }
        // if(node.level == 0||node.data.iconCls==="icon-model"){
        //   return false;
        // }
        // if(node.data.iconCls==="icon-toolbag"||node.data.iconCls==="icon-model"){
        //
        //   return false;
        // }
        api.dataDetCatalog({params : {prid:node.data.id}}).then(res => {
          if (res.data.code == "200") {
            resolve(res.data.message);

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
      }

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

  .tiaoping-tree {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    min-height: 40px;
    margin-right: 60px;
  }
  .addRatio{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  .classList{
    >li{
      cursor: pointer;
      &:hover{
        background-color: #ccc;
      }
    }
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
</style>
