<template>
    <div class="log-manager" id="baseInstall">
       <div class="base-install-tool">
             <el-button type="primary" icon="el-icon-refresh" size="small" @click="refresh">刷新</el-button>
             <el-button type="primary" icon="el-icon-document" size="small" @click="save">保存</el-button>
        </div>
        <div class="base-install-content"  v-loading="loading">
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="系统名称：">
                    <el-input v-model="form.webgisTitle"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="中心原点：">
                            <el-input v-model="form.webgisOrgin"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"> 
                        <el-form-item label="初始化范围：" style="padding-left:20px">
                            <el-input v-model="form.webgisExtent"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="几何服务地址：">
                            <el-input v-model="form.webgisServicePath"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"> 
                        <el-form-item label="后台服务地址：" style="padding-left:20px">
                            <el-input v-model="form.webgisGeo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="空间参考：">
                            <el-input v-model="form.webgisSr"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"> 
                        <el-form-item label="初始化级别：" style="padding-left:20px">
                            <el-input v-model="form.webgisInitLever"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="切片级数描述" class="base-webgisLods">
             <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-right:20px">全选</el-checkbox>
                    <el-checkbox-group v-model="form.desc"  class="group" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="item in form.webgisLods" :label="item" :key="item">{{item}}</el-checkbox>
                        <div style="text-align:right">
                            <el-button type="primary" icon="el-icon-circle-plus" size="small" @click.native="addWebgisLodsWrap=true">增加</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="small"  @click.native="delLods">删除</el-button>                  
                        </div>
                    </el-checkbox-group>
                </el-form-item>   
            </el-form>
        </div>
        <el-dialog title="添加切片级数" :visible.sync="addWebgisLodsWrap" size=tiny >
            <el-form  label-width="140px" :model="formWebgisLods">
                <el-form-item label="级别(lever):">
                    <el-input  v-model="formWebgisLods.lever"></el-input>
                </el-form-item>
                <el-form-item label="分辨率(resolution):">
                    <el-input v-model="formWebgisLods.resolution"></el-input>
                </el-form-item>
                <el-form-item label="比例(scale):">
                    <el-input v-model="formWebgisLods.scale"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addWebgisLodsWrap=false" size='small'>取 消</el-button>
                <el-button type="primary" @click="addWebgisLods" size='small'>增 加</el-button>
                <el-button type="primary" @click="addWebgisLodsMore" size='small'>继续增加</el-button> 
            </div>
        </el-dialog>
    </div>
</template>
 
<script>
    import api from '../../fetch/index'
    export default{
        data() {
            return {
                loading:false,
                addWebgisLodsWrap:false,
                formData:[],
                form : {
                    webgisGeo:'',
                    webgisSr:'',
                    webgisInitLever:'',
                    webgisTitle:'',
                    webgisOrgin:'',
                    webgisExtent:'',
                    webgisServicePath:'',
                    webgisLods:[],

                    desc:[],
                },
                formWebgisLods : {
                    lever:'',
                    resolution:'',
                    scale:''
                },
        checkAll:false,
        isIndeterminate:false
            }
        },
        mounted() {
        //获取地图基础信息
         this.getWebGisCatalog()
    },
    methods:{
        //获取地图基础信息
        getWebGisCatalog(){
        //  this.loading = true;
        this.form.desc =[];
            api.fetchGetWebGisCatalog()
            .then(res=>{
            this.loading = false;
         //   console.log(res.data)
            this.formData = res.data;
            for(var i=0;i<res.data.length;i++){
                if(res.data[i].key == 'webgisGeo'){
                    this.form.webgisGeo = res.data[i].value;
                }else if(res.data[i].key == 'webgisSr'){
                    this.form.webgisSr = res.data[i].value;
                }else if(res.data[i].key == 'webgisInitLever'){
                    this.form.webgisInitLever = res.data[i].value;
                }else if(res.data[i].key == 'webgisTitle'){
                    this.form.webgisTitle = res.data[i].value;
                }else if(res.data[i].key == 'webgisOrgin'){
                    this.form.webgisOrgin = res.data[i].value;
                }else if(res.data[i].key == 'webgisExtent'){
                    this.form.webgisExtent = res.data[i].value;
                }else if(res.data[i].key == 'webgisServicePath'){
                    this.form.webgisServicePath = res.data[i].value;
                }else if(res.data[i].key == 'webgisLods'){
                    //this.form.webgisLods = res.data[i].value;
                    this.form.webgisLods =   res.data[i].value.substring(0,res.data[i].value.length-1);
                    this.form.webgisLods =this.form.webgisLods.split(";");
                //  console.log(this.form.webgisLods)
                }  
            }
        })
        },
        //刷新
        refresh(){
            this.getWebGisCatalog()
        },
        //保存
        save(){
        /*  for(var i=0;i<this.formData.length;i++){
                for(var key in this.form){
                    if(this.formData[i].key == key){
                        this.formData[i].value = this.form[key]
                    }
                }
            }
            api.fetchGetLayerTree()
            .then(res=>{
                console.log(res.data)
            })*/
            let data = this.formData
            //data = data.join(',');
            api.fetchSaveWebGisCatalog(data)
                .then(res=>{
                    console.log(res)
                })
            //console.log('this.formData:'+JSON.stringify(this.formData))
        },
        //增加切片级数描述
        addWebgisLods(){
        if(isNaN(parseInt(this.formWebgisLods.lever))){
           this.$message({
                  message: '级别必须为数字',
                  type: 'warning'
              });
        } else if(isNaN(parseInt(this.formWebgisLods.resolution))){
           this.$message({
                  message: '分辨率必须为数字',
                  type: 'warning'
              });
        } else if(isNaN(parseInt(this.formWebgisLods.scale))){
           this.$message({
                  message: '比例必须为数字',
                  type: 'warning'
              });
        } else{
          this.form.webgisLods.push(this.formWebgisLods.lever+'/'+this.formWebgisLods.resolution+'/'+this.formWebgisLods.scale)
          this.formWebgisLods.lever = ''
          this.formWebgisLods.resolution = ''
          this.formWebgisLods.scale = ''
          this.addWebgisLodsWrap = false
          console.log(this.form.webgisLods)
        }
        },
      //继续增加
      addWebgisLodsMore(){
         if(isNaN(parseInt(this.formWebgisLods.lever))){
           this.$message({
                  message: '级别必须为数字',
                  type: 'warning'
              });
        } else if(isNaN(parseInt(this.formWebgisLods.resolution))){
           this.$message({
                  message: '分辨率必须为数字',
                  type: 'warning'
              });
        } else if(isNaN(parseInt(this.formWebgisLods.scale))){
           this.$message({
                  message: '比例必须为数字',
                  type: 'warning'
              });
        } else{
          this.form.webgisLods.push(this.formWebgisLods.lever+'/'+this.formWebgisLods.resolution+'/'+this.formWebgisLods.scale)
          this.formWebgisLods.lever = ''
          this.formWebgisLods.resolution = ''
          this.formWebgisLods.scale = ''
          console.log(this.form.webgisLods)
        }
      },
      //删除
      delLods(){
        console.log(this.form.desc)
        if(this.form.desc.length != 0){
             this.$confirm('删除该切片级数描述？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          console.log(this.form.desc)
          var a = this.form.desc
          this.form.webgisLods = this.form.webgisLods.filter(function(e) { return a.indexOf(e) < 0; });
          this.form.desc =[]
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      } else {
        this.$message({
            type: 'warning',
            message: '请选中要删除的切片级数描述!'
          });
      }
      },
      handleCheckAllChange(val){
          this.form.desc = val ?  this.form.webgisLods : [];
          this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value){
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      }
    }

    }
</script>
<style scoped>
.log-manager {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 12px;
    bottom:20px;
    
}
  
</style>