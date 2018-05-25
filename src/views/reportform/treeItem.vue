<template>
  <span class="span_item">
    <span>
      <el-input v-if="this.status == 1" style="width: 100px;" v-model="node.label" size="small" ></el-input>
      <i class="el-icon-edit" v-if="node.iconCls == 'icon-dptool'"></i>
      <i class="el-icon-share" v-if="node.iconCls == 'icon-dptoolbox'"></i>
      <span v-if="this.status != 1">{{node.label}}</span>
    </span>
    <span v-if="this.status == 1">
      <el-button type="success" style="margin-left: 8px;" size="small"  @click="SaveEdit">确认</el-button>
      <el-button type="ghost" style="margin-left: 8px;" size="small"  @click="CancelEdit">取消</el-button>
    </span>
    <span class="span_icon">
       <i class="el-icon-edit"   style="margin-left: 8px" color="gray" type="edit" size="16" @click="OpenEdit"></i>
       <i class="el-icon-plus"  style="margin-left: 8px" type="plus-round" color="gray" size="16" @click="Append"></i>
       <i class="el-icon-delete"  style="margin-left: 8px" type="plus-round" color="gray" size="16"  @click="Delete"></i>
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
          this.status = 1
          this.node.isAdd = false
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
  .span_item:hover .span_icon {
    display: inline;
  }
  .span_icon {
    margin-left: 5px;
    display: none;
  }
</style>
