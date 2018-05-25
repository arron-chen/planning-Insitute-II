<template>
  <div style="margin:15px;">
    <el-button type="primary" icon="plus" style="margin-bottom:10px;" @click.native="addprogramBtn1=true">新建用户</el-button>
    <el-table v-loading.body="loading" ref="singleTable" :data="tableData" border highlight-current-row style="width: 100%;">
      <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column property="userId" label="用户ID"></el-table-column>
      <el-table-column property="loginName" label="登录名"></el-table-column>
      <el-table-column property="userFullName" label="用户名" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click.native="handleEdit(scope.$index, scope.row)">分配角色</el-button>
          <el-button size="small" @click.native="deleteUser(scope.$index, scope.row)" type="danger" :plain="true">删除用户</el-button>
          <el-button size="small" @click.native="editUser(scope.$index, scope.row)" type="danger" :plain="true">编辑用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配角色" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="选择角色" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="选择角色">
            <el-option v-for="(item,index) in roles" :key="index" :label="item.text" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserRole" :loading="loading">{{save}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新建用户" :visible.sync="addprogramBtn1" size=tiny >
      <el-form  label-width="80px" :model="formLabelAlign">
        <el-form-item label="名称">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="formLabelAlign.region"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formLabelAlign.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addprogramBtn1=false" size=small>取 消</el-button>
        <el-button type="primary" @click="userSaveUser" size=small>确 定</el-button>
      </div>
    </el-dialog>
  
     <el-dialog title="编辑用户" :visible.sync="editprogramBtn" size=tiny >
      <el-form  label-width="80px" :model="formLabelAlign2">
        <el-form-item label="名称">
          <el-input v-model="formLabelAlign2.name"></el-input>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="formLabelAlign2.region"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formLabelAlign2.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editprogramBtn=false" size=small>取 消</el-button>
        <el-button type="primary" @click="editUserBtn" size=small>确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import api from '../../fetch/index'
  import '@/assets/scripts/sha1'
  export default {
    data(){
      return {
        addprogramBtn1:false,
        editprogramBtn:false,
        currentRow : null,
        dialogFormVisible : false,
        formLabelWidth : '120px',
        form : {
          region : ''
        },
        userId : '',
        loading : false,
        save : "确定",
        loading : false,
        tableData : [],
        roles : [],
        formLabelAlign:{
          name: '',
          region: '',
          password: ''
        },
        formLabelAlign2:{
          name: '',
          region: '',
          password: ''
        }
      }
    },
    methods : {
      saveUserRole(){
        if(this.form.region == ''){
          this.$message({
            message : '请选择角色类型',
            type : 'warning'
          });
        } else {
          this.save = "保存中..."
          this.loading = true
          api.saveUserRole({
            userId : this.userId,
            roleId : this.form.region
          })
            .then(res =>{
              if(res.data.success){
                this.$message({
                  message : '角色分配成功',
                  type : 'success'
                });
                this.save = "确定"
                this.loading = false
                this.dialogFormVisible = false
              }
            })
        }

      },
      handleEdit(index, row){
        this.form.region = ''    //打开角色分配时候清除select选择
        this.userId = row.userId //保存选中改行表格的用户id
        this.dialogFormVisible = true
      },
      deleteUser(index, row){
        console.log(row);
        this.$confirm('是否删除用户, 是否继续?', '提示', {
          confirmButtonText : '确定',
          cancelButtonText : '取消',
          type : 'warning'
        }).then(() =>{
          let userId={
            userId:row.userId
          }
          api.userDeleteUser({params:userId})
            .then(res=>{
              if(res.success==true){
                this.$message({
                  message : '用户删除成功',
                  type : 'success'
                });
                api.fetchUsers({
                  params : {
                    page : 1,
                    rows : 10
                  }
                })
                  .then(res =>{
                    this.loading = false

                    this.tableData = res.data.rows
                  })
              }
             this.getUserList()
            })
        }).catch(() =>{

        });
      },
      editUser(index, row){
        this.editprogramBtn = true;
        this.userId = row.userId;
        this.formLabelAlign2.name = row.userFullName
        this.formLabelAlign2.region = row.loginName
      },
      editUserBtn(){
        var SHA1 = require("crypto-js/SHA1");  
        var password = SHA1(this.formLabelAlign2.password).toString()    
        var obj = {user: 
          { userId: this.userId,
            userLoginName:this.formLabelAlign2.region,
            userPassword: password,
            userInfo:{userId: this.userId,userChName:this.formLabelAlign2.name }
           }
         }
         console.log(obj)
          if(this.formLabelAlign2.name !=''&& this.formLabelAlign2.region !=''&& this.formLabelAlign2.password !=''){
            api.userSaveUser({params:obj})
             .then(res=>{
                console.log("res:"+JSON.stringify(res))
                if(res.data.success == true){
                  this.$message({
                  showClose : true,
                  message :res.data.message  ,
                  type : 'success'
                });
                } else{
                  this.$message({
                  showClose : true,
                  message :res.data.message  ,
                  type : 'warning'
                });
                }
                this.editprogramBtn =false
                this.getUserList()
             })

        } else {
          this.$message({
                  showClose : true,
                  message : '请输入完整！',
                  type : 'warning'
                });
        }
      },
      userSaveUser(){
       var SHA1 = require("crypto-js/SHA1"); 
       var password = SHA1(this.formLabelAlign.password).toString()
       var obj = {user: 
          { userLoginName:this.formLabelAlign.region,
            userPassword: password,
            userInfo:{userChName:this.formLabelAlign.name }
           }
         }
        if(this.formLabelAlign.name !=''&& this.formLabelAlign.region !=''&& this.formLabelAlign.password !=''){
            api.userSaveUser({params:obj})
             .then(res=>{
                console.log("res:"+JSON.stringify(res))
                if(res.data.success == true){
                  this.$message({
                  showClose : true,
                  message :res.data.message  ,
                  type : 'success'
                });
                } else{
                  this.$message({
                  showClose : true,
                  message :res.data.message  ,
                  type : 'warning'
                });
                }
                this.addprogramBtn1 =false
                this.getUserList()
             })

        } else {
          this.$message({
                  showClose : true,
                  message : '请输入完整！',
                  type : 'warning'
                });
        }
      },
      //获取用户列表
      getUserList(){
          this.loading = true
      //获取用户列表
      api.fetchUsers({
        params : {
          page : 1,
          rows : 10
        }
      })
        .then(res =>{
          this.loading = false
          this.tableData = res.data.rows
          console.log( 'res.data :'+JSON.stringify(res.data))
        })

      }
    },
    mounted(){

      this.getUserList()
      //获取角色列表
      api.fetchRoleList()
        .then(res =>{
          this.roles = res.data
        })
    }
  }
</script>
