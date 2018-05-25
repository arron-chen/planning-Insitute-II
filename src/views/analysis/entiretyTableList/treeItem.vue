<template>
  <span class="span_item">
    <span>
      <el-input v-if="this.status == 1" style="width: 100px;" v-model="node.label" size="small" ></el-input>
      <!-- <i class="el-icon-edit" v-if="node.iconCls == 'icon-dptool'"></i>
      <i class="el-icon-share" v-if="node.iconCls == 'icon-dptoolbox'"></i> -->
      <img style="margin: -3px 1px;" src="../../../assets/image/tree/folder16.png" v-if="node.iconCls == 'icon-modelset'||node.iconCls == 'icon-dptoolbox'">
      <img style="margin: -3px 1px;" src="../../../assets/image/tree/model.png" v-if="node.iconCls == 'icon-model'">
      <img style="margin: -3px 1px;" src="../../../assets/image/tree/toolbag.png" v-if="node.iconCls == 'icon-toolbag'">
      <img style="margin: -3px 1px;" src="../../../assets/image/tree/table.png" v-if="node.iconCls == 'icon-tables'">
      <img style="margin: -3px 1px;" src="../../../assets/image/tree/TableFolder16.png" v-if="node.iconCls == 'icon-dptool'">

      <span v-if="this.status != 1">{{node.label}}</span>
    </span>
    <span v-if="this.status == 1">
      <el-button type="success" style="margin-left: 8px;" size="small"  @click="SaveEdit">确认</el-button>
      <el-button type="ghost" style="margin-left: 8px;" size="small"  @click="CancelEdit">取消</el-button>
    </span>

    <span class="span_icon" v-if="node.isLeaf" >
       <i class="el-icon-edit"   style="margin-left: 8px;" color="gray" type="edit" size="16" @click="OpenEdit"></i>
       <i class="el-icon-delete"  style="margin-left: 8px;color:#FF4949" type="plus-round" color="gray" size="16"  @click="Delete"></i>
       <!--  <i class="el-icon-check" style="float:right;padding:10px;color:#20A0FF">  </i> -->
    </span>
        <span class="span_icon" v-else >
       <i class="el-icon-edit"   style="margin-left: 8px;" color="gray" type="edit" size="16" @click="OpenEdit"></i>
       <i class="el-icon-plus"  style="margin-left: 8px;" type="plus-round" color="gray" size="16" @click="Append"></i>
       <i class="el-icon-delete"  style="margin-left: 8px;color:#FF4949" type="plus-round" color="gray" size="16"  @click="Delete"></i>
          <!--  <i class="el-icon-check" style="float:right;padding:10px;color:#20A0FF">  </i> -->
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
</style>
