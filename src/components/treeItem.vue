<template>
  <span class="span_item">
    <span>
      <el-input v-if="this.status == 1" style="width: 100px;" v-model="v.label" size="small" ></el-input>

      <img style="margin: -3px 1px;" src="../assets/image/tree/tool.png" v-if="node.iconCls == 'icon-dptool'">
      <img style="margin: -3px 1px;" src="../assets/image/tree/folder16.png" v-if="node.iconCls == 'icon-dptoolbox'||node.iconCls == 'icon-dptoolset'">
      <img style="margin: -3px 1px;" src="../assets/image/tree/tool.png" v-if="node.nodeType == '0'">
      <img style="margin: -3px 1px;" src="../assets/image/tree/toolbag.png" v-if="node.nodeType == '1'">
      <img style="margin: -3px 1px;" src="../assets/image/tree/folder16.png" v-if="node.iconCls == 'icon-modelset'">
      <img style="margin: -3px 1px;" src="../assets/image/tree/model.png" v-if="node.iconCls == 'icon-model'">
       <span v-if="node.nodeLevel"  class="nodeLevel"  :class="{resultNode:node.resultNode}"> {{node.nodeLevel}}  </span>
      <span v-if="this.status != 1" >{{node.label}}</span>
    </span>
    <span v-if="this.status == 1">
      <el-button type="success" style="margin-left: 8px;" size="small"  @click="SaveEdit">确认</el-button>
      <el-button type="ghost" style="margin-left: 8px;" size="small"  @click="CancelEdit">取消</el-button>
    </span>

   <span class="span_icon" v-if="node.nodeLevel">
       <i class="el-icon-edit"   style="margin-left: 8px;" color="gray" type="edit" size="16" @click="OpenEdit"></i>
    </span>
    <span class="span_icon" v-else>
    </span>

  </span>



</template>

<script>
    export default {
      data() {
        return {
          status:0,
          node:this.value,
          nodeData:JSON.parse(JSON.stringify(this.value))
        }
      },
      props:{
        value:{
          default: function () {
            return {}
          }
        },
        treeNode:{
          default: function () {
            return {}
          }
        }
      },
      methods:{
        OpenEdit(){
          this.$emit('OpenEdit')
        /*  this.status = 1
          this.node.isAdd = false*/
        },
        Append(){
          //添加节点事件
          this.$emit('Append')
        },
        SaveEdit(){
          //保存节点事件
          this.$emit('SaveEdit',this.nodeData)
        },
        CancelEdit(){
          this.status = 0
          this.$emit('CancelEdit',this.nodeData)
        },
        Delete(){
          this.$emit('Delete',this.nodeData)
        },
        Expanded(){
          this.treeNode.expanded = this.treeNode.expanded?false:true
        }
      },
      watch:{
        value:{
          handler:function(val,oldVal){
            this.node = val
          },
          deep:true
        },
        node:{
          handler:function(val){
            this.$emit('input',val)
          },
          deep:true
        }
      }
    }
</script>
<style>
 /*  .span_item:hover .span_icon {
   display: inline;
 } */
  .span_icon {
    margin-left: 5px;
    display: none;
  }
  .nodeLevel{
    display: inline-block;
    width: 12px;
    height: 12px;
    line-height: 12px;
    padding: 2px;
    font-size: 12px;
    color: #fff;
    border: 1px solid #20a0ff;
    background-color: #20a0ff;
    border-radius: 100%;
    text-align: center;
  }
 .resultNode{
  background-color: #F56C6C;
  border: 1px solid #F56C6C;
 }
</style>
