<template>
	<div class="entiretyAnalysis">	 
		 <el-tabs type="border-card" @tab-click='openTabItem' v-model="activeName">
  			<el-tab-pane label="原生表"  name="first">
  				  <native-table v-if="native"></native-table>  
  			</el-tab-pane>
  			<el-tab-pane label="汇总表"  name="second">
				 <entirety-table v-if="entirety"></entirety-table>  
  			</el-tab-pane>
  			<el-tab-pane label="衍生表" name="third">
  				 <derivative-table v-if="derivative"></derivative-table>  
  			</el-tab-pane>  
  			<!-- <el-tab-pane label="过渡表" name="fourth">
  				<transition-table v-if="transition"></transition-table>
  			</el-tab-pane> -->
		  </el-tabs>
	</div>
</template>
<script>
import NativeTable from  './entiretyTableList/nativeTable'
import EntiretyTable from  './entiretyTableList/entiretyTable'
import DerivativeTable from  './entiretyTableList/derivativeTable'
import TransitionTable from  './entiretyTableList/transitionTable'
 
export default {
    	name: 'entiretyanalysis',
    	components:{
    		NativeTable,
    		EntiretyTable,
    		DerivativeTable,
    		TransitionTable
		},
		data(){
			return{
				native:false,
				entirety:true,
				derivative:false,
				transition:false,
				activeName:'second'
			}
		},
    	methods:{
			openTabItem(obj){
				if(obj.label=='原生表'){
					if(document.querySelector('#nativeTable')){
						return false
					}else{
						this.native=true
					}
				}
				if(obj.label=='汇总表'){
					if(document.querySelector('#entiretyTable')){
						return false
					}else{
						this.entirety=true
					}
				}
				if(obj.label=='衍生表'){
					if(document.querySelector('#derivativeTable')){
						return false
					}else{
						this.derivative=true
					}
				}
				if(obj.label=='过渡表'){
					if(document.querySelector('#transitionTable')){
						return false
					}else{
						this.transition=true
					}
				}
			}
		}
	}
	 
</script>