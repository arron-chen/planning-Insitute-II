<template>
	<div  class="panel-content">
		<!-- <drag-zone class="zoon"> -->
			<div class="zoon-panel tool" v-loading.body="loadTree">
				<el-tree :data="data" :props="defaultProps" @node-click="showSmartbi"></el-tree>
			</div>
			<!-- <drag-handle class="handle"></drag-handle> -->
			<div class="zoon-panel program">
				<iframe :src="smartbiSrc" frameborder="0"></iframe>
			</div>
		<!-- </drag-zone> -->
	</div>
</template>
<script>
import api from '../../fetch/index'
// import { dragZone, dragHandle } from 'vue-drag-zone'
  export default {
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
		},
		loadTree:false,
		smartbiSrc:''
      };
    },
	components: {
		// dragZone,
		// dragHandle
	},
    methods: {
      showSmartbi(node) {
        this.smartbiSrc='http://10.0.0.7:18080/SouthGISBI/vision/openresource.jsp?resid='+node.id
      }
	},
	mounted(){
		this.loadTree=true
		api.fetch()
		.then(res=>{
			this.loadTree=false
			console.log(res);
			this.data=res.data
		})
	}
  };
</script>