<template>
  <div style="margin:15px;">
   <el-button type="primary" icon="plus" style="margin-bottom:10px;" @click.native="addprogramBtn2=true">新建角色</el-button>
    <el-table ref="singleTable" v-loading.body="loading" :data="tableData" border highlight-current-row style="width: 100%;">
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column property="roleName" label="角色名称"></el-table-column>
      <el-table-column property="roleMark" label="角色描述"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click.native="handleEdit(scope.$index, scope.row)">分配权限</el-button>
          <el-button size="small" @click.native="deleteRole(scope.$index, scope.row)">删除角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible" size="large">
      <div class="role-tree">
        <el-tree :default-checked-keys="checkedArr" :data="treeData" show-checkbox node-key="id" ref="tree"></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePremission" :loading="loading">{{save}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建角色" :visible.sync="addprogramBtn2" size=tiny >
      <el-form  label-width="80px" :model="formRole">
        <el-form-item label="角色名称">
          <el-input v-model="formRole.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formRole.region"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addprogramBtn2=false" size=small>取 消</el-button>
        <el-button type="primary" @click="roleSaveRole" size=small>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../fetch/index'

  export default {
    data(){
      return {
        addprogramBtn2:false,
        dialogFormVisible : false,
        loading : false,
        save : "确定",
        tableData : [],
        treeData : [],
        checkedArr:[],
        roleId:'',
         formRole:{
          name: '',
          region: '',
        }
      }
    },
    methods : {
      //获取表格数据
      getRoleTableData(){
        this.loading = true
      //获取角色列表
      api.fetchRoleListFindAllByPage({
        params : {
          page : 1,
          rows : 10
        }
      })
        .then(res =>{
          this.loading = false
          this.tableData = res.data.rows
          console.log(res.data.rows)
        })
      },
      //保存角色
      roleSaveRole(){
        if(this.formRole.name !=''&& this.formRole.region !=''){
          let obj = {
            role:{rid:'4', roleName :this.formRole.name,roleRemark:this.formRole.region}
            }
          api.fetchSaveRole({params:obj})
          .then(res=>{
            console.log(res.data)
            if(res.success==true){
              this.$message({
                  message : '角色添加成功',
                  type : 'success'
                });
            } else {
              this.$message({
                  message : res.data.message,
                  type : 'warning'
                });
            }

          })
          this.addprogramBtn2=false
          this.getRoleTableData()
        } else {
          this.$message({
                  showClose : true,
                  message : '请输入完整！',
                  type : 'warning'
                });
        }
         
      },
      //删除角色
      deleteRole(index, row){
        console.log(row);
        this.$confirm('是否删除角色, 是否继续?', '提示', {
          confirmButtonText : '确定',
          cancelButtonText : '取消',
          type : 'warning'
        }).then(() =>{
          let roleId={
            roleId:row.rid
          }
          api.fetchDeleteRole({params:roleId})
            .then(res=>{
              if(res.success==true){
                this.$message({
                  message : '角色删除成功',
                  type : 'success'
                });
               /* api.fetchUsers({
                  params : {
                    page : 1,
                    rows : 10
                  }
                })
                  .then(res =>{
                    this.loading = false
                    this.tableData = res.data.rows
                  })*/
              } else{
                this.$message({
                  message : res.data.message,
                  type : 'warning'
                });
              }
            this.getRoleTableData()
            })
        }).catch(() =>{

        });
      },
      //保存权限
      savePremission(){
        var ids = this.$refs.tree.getCheckedNodes()
        console.log('ids'+JSON.stringify(ids))
        var arr = ''
        for(var i=0;i<ids.length;i++){
          if(arr=='')
            {arr += Number(ids[i].id) ;}
          else
            {arr += ','+Number(ids[i].id);}
        }
        api.savePremission({
            'ids' : arr,
            'roleId' : this.roleId   
        })
          .then(res =>{
             if(res.data.success == true){
               this.$message({
                  showClose : true,
                  message : '分配角色权限成功！',
                  type : 'success'
                });
             } else{
               this.$message({
                  showClose : true,
                  message : res.data.message,
                  type : 'warning'
                });
             }
          })
      },
      handleEdit(index, row){
        this.dialogFormVisible = true
        this.roleId = row.rid
        let roleId={
          roleId:row.rid
        }
        //获取资源列表
        api.fetchPremission({params:roleId})
          .then(res =>{
            this.treeData = JSON.parse(res.data.Tree)
            this.checkedArr = res.data.Checked
           
          // console.log('this.treeData:'+JSON.stringify(res.data.Tree))
          //  this.getArray(this.data,"checked")
          })
      },
      /*GetLeaf(josnData,checked){
        for (var i = 0; i <josnData.length; i++) {
          if (josnData[i] && josnData[i].checked == 'true') {
            this.checkedArr.push(josnData[i].id)
            return false
          }else if (josnData[i] && !josnData[i].children.length=0){
            this.GetLeaf(josnData[i].Children,GUID)
          }
        }
      },*/

    },
    mounted(){
       this.getRoleTableData()
    }
  }
</script>
