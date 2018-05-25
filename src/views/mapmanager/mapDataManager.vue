<template>
	<div id="mapDataManager">
		<div class="map-data-tool">
			 <el-button type="primary" icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
			 <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="addTeeNode">新建目录</el-button>
			 <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="addNewService">新建服务</el-button>
			 <el-button type="primary" icon="el-icon-document" size="small" @click="saveAll">保存</el-button>
			 <el-button type="primary" icon="el-icon-delete" size="small" @click="deleteSelectedLayer">删除</el-button>
		</div>
		<div  id="mapDataManagerContent" class="panel-content" >
			 <div  data-options="region:'west',split:true"  title="地图数据" style="width:250px;">
			 	 <el-tree :data="layerTree" :props="defaultProps" @node-click="layerTreeNodeClick"  highlight-current :expand-on-click-node="false" v-loading="loadTree">
			 	 </el-tree>
			 </div>
			 <div data-options="region:'center',split:true" style="padding:15px 15px 15px 5px;border-left:none">
			 	<el-form ref="form" :model="form" label-width="90px">
					<el-form-item label="服务名称：">
    					<el-input v-model="form.layerName"></el-input>
  					</el-form-item>
  					<el-row>
  					<el-col :span="10">
  						<el-form-item label="上级图层:">
    					<el-select v-model="form.dirTreeSelectCN" placeholder="请选择上级图层">
      						 <div id="customizeSelect">
      						 	  <el-tree :data="dirTree" :props="defaultProps" @node-click="dirTreeNodeClick" default-expand-all highlight-current 
      						 	  :expand-on-click-node="false"></el-tree>
      						 </div>
    					</el-select>
  					</el-form-item>
  					</el-col>
  					<el-col :span="14"> 
  						 <el-form-item label="是快捷图层:">
    						<el-switch v-model="form.isQuickLayer"></el-switch>
  						</el-form-item>
  					</el-col>
				</el-row>
				<el-row>
  					<el-col :span="20">
  					 	<el-form-item label="服务地址：">
    						<el-input v-model="form.restURL" :disabled="restURLDisabled"></el-input>
  						</el-form-item>
  					</el-col>
  					<el-col :span="4"> 
  						<el-button type="primary" size="small" v-if="!restURLDisabled" @click="getServerAdd"  style="float:left;margin:3px 12px" >获取服务地址</el-button>
  					</el-col>
				</el-row>
				<el-row>
  					<el-col :span="10">
  					 	<el-form-item label="服务类型：">
    						<el-select v-model="form.serviceType" placeholder="请选择服务类型" :disabled="restURLDisabled">
      						  <el-option v-for="item in serviceTypeOptions" :key="item.value" :label="item.label" :value="item.value">
    						 </el-option> 
    					</el-select>
  						</el-form-item>
  					</el-col>
  					<el-col :span="14"> 
  						<el-form-item label="排列顺序:">
  						  <el-input-number v-model="form.layerSort" controls-position="right" @change="handleChange" :min="0" :max="10000"></el-input-number>
  						</el-form-item>
  					</el-col>
				</el-row>
				<el-row>
  					<el-col :span="12">
  					 	<el-form-item label="其他：">
    						<el-input v-model="form.token"></el-input>
  						</el-form-item>
  					</el-col>
  					<el-col :span="12"> 
  						<el-form-item label="唯一标识：" style="padding-left:20px">
    						<el-input v-model="form.layerURID"></el-input>
  						</el-form-item>
  					</el-col>
				</el-row>
				<el-form-item label="包含项：" class="group-box">
    					<el-checkbox-group v-model="form.desc"  class="group">
    					<el-checkbox v-for="item in form.children" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
  					</el-checkbox-group>
  				</el-form-item>
  				</el-form>	
			 </div>
		</div>
		<el-dialog title="选择服务" :visible.sync="serveSelect" size=tiny >
			<el-form ref="form" :model="dialogForm" label-width="90px">
			<el-row>
  					<el-col :span="21">
  					 	<el-form-item label="基础地址:" style="margin-bottom:10px">
    						<el-input v-model="dialogForm.input" size="small"></el-input>
  						</el-form-item>
  					</el-col>
  					<el-col :span="3"> 
  						<el-button type="primary" size="small"  @click="getDirInfo"  style="float:left;margin:5px 12px" >提取</el-button>
  					</el-col>
				</el-row>
			</el-form>
			<div style="min-height:80px;max-height:200px;overflow:auto;padding:10px;border:1px solid #e6e6e6;border-radius:4px">
			 <el-tree :data="serveTree" :props="defaultProps" @node-click="serveTreeNodeClick"  highlight-current   default-expand-all  @check-change="handleCheckChange" v-loading="laodServeTree">
			 </el-tree>
			</div>

      		<div slot="footer" class="dialog-footer">
        		<el-button @click="serveSelect=false" size=small>取 消</el-button>
        		<el-button type="primary" @click="submitServeTreeSelect" size=small>确 定</el-button>
        		 
        	</div>
    	</el-dialog>
	</div>
</template>

<script>
	import api from '../../fetch/index'
	export default{
		 data(){
		 	return {
		 		loadTree :false,
		 		laodServeTree:false,
		 		layerTree:[],
		 		dirTree:[],
		 		serveTree:[],
		 		serviceTypeOptions:[
		 		{value:'ArcGISDynamicMapServiceLayer',label:'动态服务'},
		 		{value:'ArcGISTiledMapServiceLayer',label:'切片服务'},
		 		{value:'ArcGISImageServiceLayer',label:'影像服务'},
		 		{value:'FeatureLayer',label:'要素服务'},
		 		{value:'WebTiledLayer',label:'天地图服务'},
		 		{value:'UnKnowLayer',label:'非地图服务'},
		 		{value:'ArcGISSubLayer',label:'地图服务子图层'}
		 		], 
		 	 
		 		defaultProps: {
          			children: 'children',
          			label: 'text'
        		},
        		form:{
        			layerName:'',
        			restURL:'',
        			layerSort:'',
        			serviceType:'ArcGISDynamicMapServiceLayer',
        			layerURID:'',
        			dirTreeSelect:'',
        			dirTreeSelectCN:'',
        			isQuickLayer:true,
        			children:[],
        			desc:[],
        			token:''
        		},
        		layerTreeRid:'',
        		restURLDisabled:false,
        		serveSelect:false,
        		dialogForm:{
        			input:''
        		},
        		serveTreeSelect:''
		 	}
		 },
		 mounted(){
		 	$('#mapDataManagerContent').layout();
		 	this.getLayerTree()
		 	this.getDirTree();
		 	 
		 	$('#customizeSelect').parents('.el-scrollbar').css('display','block');
		 	$('#customizeSelect').parents('.el-scrollbar').siblings('.el-select-dropdown__empty').css('display','none');

		 },
		 methods:{
		 	//获取图层数据树形结构
		 	getLayerTree(){
		 		this.loadTree = true;
		 		api.fetchGetLayerTree()
        		.then(res=>{
          			 this.loadTree = false
          			 console.log(res.data)
          			 this.layerTree = res.data

        		})
		 	},
		 	//获取图层目录结构树
		 	getDirTree(){
		 		api.fetchGetDirTree()
		 		.then(res=>{
		 			 this.dirTree = res.data
		 			 console.log('this.dirTree:'+JSON.stringify(this.dirTree))
		 		})
		 	},
		 	//获取arcgis server 根目录服务结构树(arcgis server根目录服务已经保存在syskey表）
		 	getServiceDir(){
		 		this.laodServeTree = true
		 		api.fetchGetServiceDir({rid:this.layerTreeRid})
		 		.then(res=>{
		 			this.laodServeTree = false
		 			this.serveTree = res.data
		 			//currentServicePath
		 			//console.log('sss:'+JSON.stringify(res.data))
		 		})
		 	},
		 	//layTree节点点击
		 	layerTreeNodeClick(eve,node){

		 		console.log('node:'+node)
		 		if(node.isLeaf){
		 			this.restURLDisabled = false
		 		} else{
		 			this.restURLDisabled = true
		 		}
		 		console.log(eve)
		 		console.log('eve.attributes.token:'+eve.attributes.token);
		 		this.layerTreeRid = eve.id
		 		this.form.layerName = eve.attributes.layerName
		 		this.form.restURL = eve.attributes.restURL 
		 		this.form.layerSort = eve.attributes.layerSort
		 		this.form.serviceType = eve.attributes.serviceType
		 		this.form.layerURID = eve.attributes.layerURID
		 		this.form.dirTreeSelect = eve.attributes.parentId
		 		this.form.token = eve.attributes.token
		 		console.log(this.form.dirTreeSelect)
		 		this.dirTreeSelectToCn(this.dirTree)
		 		if(eve.attributes.isQuickLayer == '1'){
		 			this.form.isQuickLayer = true
		 		} else {
		 			this.form.isQuickLayer = false
		 		}
		 		//包含项
		 		this.form.children = '';
		 		var arr = [];
		 		if(eve.children){
		 			for(var j = 0;j<eve.children.length;j++){
		 				console.log(eve.children[j].text)
		 				arr.push(eve.children[j]) 
		 			}
		 		}
		 		this.form.children = arr; 
		 	},
		 	handleChange(){

		 	},
		 	//dirTree节点点击
		 	dirTreeNodeClick(eve){
		 		this.form.dirTreeSelect = eve.id
		 		console.log(this.form.dirTreeSelect)
		 		this.dirTreeSelectToCn(this.dirTree)
		 	},

		 	//dirTreeSelect与dirTreeSelectCN映射关系
		 	dirTreeSelectToCn(data){
		 		for(var i=0;i<data.length;i++){
		 			var getChild = data[i].children
		 			if(this.form.dirTreeSelect == data[i].id ){
		 				this.form.dirTreeSelectCN = data[i].text
		 			} else if(data[i].children){ 
            			this.dirTreeSelectToCn(data[i].children);  
        			}
		 	 	}
		 	},
		 	//获取服务地址
		 	getServerAdd(){
		 		this.serveSelect = true
		 		this.getServiceDir()
		 	},
		 	//服务树点击
		 	serveTreeNodeClick(eve){
		 		console.log(eve.attributes.currentServicePath)
		 		this.serveTreeSelect  = eve.attributes.currentServicePath 
		 	},
		 	//服务树确定
		 	submitServeTreeSelect(){
		 		this.form.restURL = this.serveTreeSelect;
		 		this.serveSelect = false;
		 	},
		 	//提取
		 	getDirInfo(){
		 		if(this.dialogForm.input == ''){
		 			this.$message({
          				message: '服务路径不能为空',
          				type: 'warning'
        			});
		 		} else{
		 			this.laodServeTree = true
		 			api.fetchGetDirInfo({params : {servicePath:this.dialogForm.input}})
		 			.then(res=>{
		 				this.laodServeTree = false
		 				console.log(res.data)
		 			if(res.data!=''){
		 				this.serveTree = res.data
		 			} else{
		 				this.serveTree =[]
		 			}  
		 		})
		 		}
		 		 
		 	},
		 	 
		 	//
		 	handleCheckChange(){

		 	},
		 	//刷新
		 	refresh(){
		 		this.getLayerTree();
		 		this.getDirTree();
		 	 
		 	},
		 	//新建目录
		 	addTeeNode(){
		 		this.layerTreeRid = ''
		 		this.restURLDisabled = true 
        		this.serveSelect = false 
		 		this.form.layerName = ''
		 		this.form.restURL = ''
		 		this.form.isQuickLayer = false
		 		this.form.dirTreeSelect = ''
     			this.form.dirTreeSelectCN = ''
     			this.form.token = ''
     			this.form.desc =[]
     			this.form.layerURID =''
     			this.form.children =[],
     			this.form.serviceType = 'UnKnowLayer'
		 	},
		 	//新建服务
		 	addNewService(){
		 		this.layerTreeRid = ''
		 		this.form.layerName = ''
		 		this.restURLDisabled = false 
		 		this.form.restURL = ''
		 		this.form.isQuickLayer = true
		 		this.form.token = ''
		 		this.form.dirTreeSelect = ''
     			this.form.dirTreeSelectCN = ''
     			this.form.desc =[]
     			this.form.layerURID =''
     			this.form.children =[],
     			this.form.serviceType = 'ArcGISDynamicMapServiceLayer',
     			this.form.layerSort = 0
		 	},
		 	
		 	//保存
		 	saveAll(){
		 		console.log('this.form:'+this.form)
		 		 
		 		if(this.form.layerName===''){
		 			this.$message({
          				message: '服务名称不能为空',
          				type: 'warning'
        			});
		 		} else if(this.form.dirTreeSelectCN===''){
		 			this.$message({
          				message: '上级节点不能为空',
          				type: 'warning'
        			});
		 		} else if(this.form.layerSort===''){
		 			this.$message({
          				message: '排列顺序不能为空',
          				type: 'warning'
        			});
		 		}else if(this.form.layerURID===''){
		 			this.$message({
          				message: '唯一标识不能为空',
          				type: 'warning'
        			});
		 		}else{
		 			this.sendUpload()
		 		}

		 	},

		 	//发送保存
		 	sendUpload(){
		 		var isQuickLayers;
		 		if(this.form.isQuickLayer == true){
		 			 isQuickLayers = 1
		 		} else if(this.form.isQuickLayer == false){
		 			isQuickLayers = 0
		 		}
		 	 
		 		let data = {
					rid : this.layerTreeRid,
					parentId : this.form.dirTreeSelect,
				 	layerName : this.form.layerName,
					isQuickLayer : isQuickLayers,
					restURL : this.form.restURL,
					serviceType : this.form.serviceType,
				 	layerSort : this.form.layerSort,
					token :this.form.token,
					layerURID : this.form.layerURID 
		 		}

		 		api.fetchSaveUpdateLayer(data)
 				.then(res=>{
 					//console.log('res:'+JSON.stringify(res))
 					if(res.status==200){
 						this.$message({
          					message: '保存成功!',
          					type: 'success'
        				});
 						this.refresh()

 					}
 				}) 
		 	},

		 	//删除
		 	deleteSelectedLayer(){
		 		let data = {rid: this.layerTreeRid} 
		 		api.fetchDeleteSelectedLayer({params:this.layerTreeRid})
		 		.then(res=>{
		 			console.log(res)
		 		})
		 	}
		 	 
		 }
	}
</script>
<style>
	 #customizeSelect{
	 	padding: 5px;
	 	min-height: 60px;
	 }
</style>