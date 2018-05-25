<template>
	<div id="home">
		 <el-row :gutter="30" type="flex" class="flex-container"  style="height:50%">
			<el-col :span="16">
				<div class="grid-content">
				 	<banner-one></banner-one>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content">
					<banner-two></banner-two>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="30" type="flex"  style="height:50%">
			<el-col :span="8">
				<div class="grid-content">
					 <banner-three></banner-three>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content">
					 <banner-four></banner-four>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content">
					 <banner-five></banner-five>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import bannerOne from './Home/bannerOne'
import bannerTwo from './Home/bannerTwo'
import bannerThree from './Home/bannerThree'
import bannerFour from './Home/bannerFour'
import bannerFive from './Home/bannerFive'
	export default {
  		components: {  bannerOne,bannerTwo,bannerThree,bannerFour,bannerFive }
	}
</script>
<style scoped lang="less">

</style>
