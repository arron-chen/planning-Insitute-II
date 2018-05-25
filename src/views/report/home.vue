<template>
	<div class="pdf-wrap">
		 <div class="pdf-content">
          <!-- <pdf  :src="reportUrl"   
			:page="displayPage"   @num-pages="pageCount = $event"  ></pdf> 	   -->
			 <iframe  
        width="100%" height="500" scrolling="no"
        :src='"static/web/viewer.html?file=" + reportUrl'></iframe>
 		 </div>
	</div>
</template>
<script>
import api from '../../fetch/index'
import {mapMutations, mapActions, mapGetters} from 'vuex'
import pdf from 'vue-pdf' 
	export default{
		components:{
		   pdf
	    },
		data(){
			return{
				reportUrl: '',
				tableData: [],
				pageCount:'',
			    displayPage:1,
			    serviceUrl:'',
            
			}
		},
		mounted() {
			 this.reportUrl = this.$store.state.report.reportUrl;
			 console.log(this.reportUrl)
			 this.reportUrl = this.serviceUrl + this.reportUrl;
		}, 
		methods : {
			prevpage(){
				if(this.displayPage > 1){
			  		this.displayPage--;
			  	} else{
			  		console.log(this.displayPage)
			  	}
			},
			nextpage(){	 
				 
			  	if(this.displayPage<this.pageCount){
			  		this.displayPage++;
			  	} else{
			  		console.log(this.displayPage)
			  	}
			  }
		}
	}
</script>
<style scoped>
	/*.iframe-box{
		position: relative;
		background: plum;
		width: 300px;
		height: 500px;
	}*/
	iframe{
		width: 100%;
		height: 100%;
	}
</style>