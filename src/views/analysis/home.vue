<template>
	<div id="dataHandleTool" class="panel-content">
	dssd
		<!-- <drag-zone class="zoon">
			<div class="zoon-panel tool">
				<el-button-group>
					<el-button type="primary" icon="plus" @click="addTool=true">添加工具</el-button>
					<el-button type="primary" icon="share" @click="addProgram = true">添加方案</el-button>
					<el-button type="primary" icon="delete2" @click="deleteTool">删除</el-button>
				</el-button-group>
				<p class="tool-list">工具列表</p>
				<el-tree ref="myTree" v-loading.body="loadTree" :data="data" :highlight-current='true' @node-click='showAttributes' node-key="id"></el-tree>
			</div>
			<drag-handle class="handle"></drag-handle>
			<div class="zoon-panel program">
				<div v-if='showProgram'>
					<el-breadcrumb separator="/">
						<el-breadcrumb-item>路径</el-breadcrumb-item>
						<el-breadcrumb-item>路径</el-breadcrumb-item>
						<el-breadcrumb-item>路径</el-breadcrumb-item>
						<el-breadcrumb-item>路径</el-breadcrumb-item>
					</el-breadcrumb>
					<p class="program-title">参数设置</p>
					<div class="program-content">
						<div v-for="(item,index) in parameters" :key="index">
							<p>{{item.displayName}}</p>
							<el-input v-model="item.templateValue" :value='item.templateValue' placeholder="请输入内容"></el-input>
						</div>
						<div class="primary">
							<el-button type="primary" size='large' @click.native="save">保存</el-button>
						</div>
		
					</div>
				</div>
			</div>
			<drag-handle class="handle"></drag-handle>
			<div class="zoon-panel help-box">
				<p>Tool Description</p>
				<div class="help">{{description}}</div>
			</div>
		</drag-zone> -->

		<!-- 添加工具 -->
		<el-dialog title="新增处理工具" :visible.sync="addTool" size="tiny">
			<el-form :model="form">
				<el-form-item label="上级节点">
					<el-select v-model="value6" placeholder="请选择" :clearable='true' @visible-change='selectTool'>
						<el-option :value="value6" class="select-tool">
							<el-tree ref="myTree2" v-loading.body="loadTree2" :data="data2" @node-click='selectToolNode' :highlight-current='true' node-key="id"></el-tree>
						</el-option>
					</el-select>
				</el-form-item>
				<el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">将文件拖到此处，或
						<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
				</el-upload>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addTool = false">取 消</el-button>
				<el-button type="primary" @click="addTool = false">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 添加方案 -->
		<el-dialog title="方案编辑" :visible.sync="addProgram">
			<el-button type="primary" icon="plus">添加工具</el-button>
			<el-button type="primary" icon="delete2">删除</el-button>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addProgram = false">取 消</el-button>
				<el-button type="primary" @click="addProgram = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import api from '../../fetch/index'
//import { dragZone, dragHandle } from 'vue-drag-zone'
export default {
	name: 'datatool',
	data() {
		return {
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			},
			addTool: false,
			addProgram: false,
			data: [],
			data2: [],
			loadTree: false,
			loadTree2: false,
			description: '',
			parameters: [],
			showProgram: false,
			toolRid: '',
			value6: ''
		}
	},
	components: {
	//	dragZone,
	//	dragHandle
	},
	mounted() {
		this.loadTree = true
		api.fetchCatalog()
			.then(res => {
				this.data = res.data
				this.loadTree = false
			})
	},
	methods: {
		showAttributes(data, node) {
			// console.log(node);
			if (node.isLeaf) {
				this.toolRid = data.attributes.rid
				api.fetchParameter({ params: { trid: data.attributes.rid } })
					.then(res => {
						this.parameters = res.data
						this.showProgram = true
					})
				this.description = data.attributes.description
			} else {
				this.toolRid = ''
			}
		},
		save() {
			api.saveUpdateParameter({ parameter: this.parameters })
				.then(res => {
					this.$message({
						message: '保存成功',
						type: 'success'
					});
				})
		},
		handleChange(file, fileList) {
			this.fileList3 = fileList.slice(-3);
		},
		GetBreadcrumb(node, name) {
			// for(var i in node){
			// 	if (node.label==undefined) {
			// 		return false
			// 	}else{
			// 		this.GetBreadcrumb(node[i].Children,name)
			// 	}
			// }
		},
		deleteTool() {
			if (this.toolRid != '') {
				this.$confirm('此工具将被删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.deleteTool({ params: { rid: this.toolRid } })
						.then(res => {
							console.log(res);
						})

				})
			} else {
				this.$message({
					message: '请选择工具，或者工具目录',
					type: 'warning'
				});
			}

		},
		selectTool(show) {
			if (this.data2.length == 0) {
				if (show) {
					api.fetchCatalog2()
						.then(res => {
							this.data2 = res.data
							this.loadTree2 = false
						})
				}
			}
		},
		selectToolNode(node) {
			// console.log(node);
			this.value6 = node.label
		}
	}
}
</script>
