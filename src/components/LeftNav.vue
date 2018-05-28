/**
* @author gzk
* @time  08/14/2017
* @version 1.0
* @requires vuex
* @param { isCollapse:false} 默认收起左侧菜单
*        { items }左侧菜单数据
*        { taggleNav() } 菜单展开收起切换
*        { openTab(item.menulist) } 选择菜单后回调事件 
*
*/
<template>
  <div class="left-nav">
        <div class="collapse-btn" @click="taggleNav()"></div>
        <el-menu class="el-menu-vertical-demo" unique-opened :collapse="isCollapse">
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.menulist.index" @click="openTab(item.menulist)">
                        <template slot="title">
                            <img src="">
                            <span>{{ item.menulist.title}}</span>
                        </template>
                        <!-- <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" :title="subItem.title">
                            <span>{{ subItem.title }} </span>
                        </el-menu-item> -->
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.menulist.index"  @click="openTab(item.menulist)">
                        <img class="menu-image" src="../../static/image/leftnav/menu1.png">
                        <span slot="title">{{item.menulist.title}}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
import { mapMutations,mapActions } from 'vuex'

export default {
    name: 'LeftNav',
    data() {
        return {
            isCollapse: false,
            items: [  
                {
                      icon: 'dataHandleToolLogo',
                      menulist:{
                        index: 'systemManagement/userManager',
                        title: '用户管理',
                      }
                }, 
                {
                      icon: 'el-icon-setting',
                      menulist:{
                        index: 'systemManagement/roleManager',
                        title: '角色管理'
                     } 
                },
                 {
                      icon: 'el-icon-star-on',
                      menulist:{
                        index: 'systemManagement/logManager',
                        title: '日志管理'
                    }
                },
            ]
        }
    },
    methods: {
        ...mapMutations({
            openTab: 'SET_ADDTAB'
        }),
        ...mapActions([
            'FETCT_NAVMENU'
        ]),
        taggleNav:function(){
            if(this.isCollapse==false){
                this.isCollapse =true
            } else{
                this.isCollapse =false;
            }
        }
    },
    mounted() {
        this.$store.dispatch('FETCT_NAVMENU')
            .then((res) => {
                 this.menuList = res.mTree.children;
            })
    }
}
</script>
<style scoped>
.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    height: 3.5rem;
    border-bottom: solid 0.01rem #48576a;
}

i {
    margin-right: 0.5rem;
}


.collapse-btn{
    height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #dce0e1;
    cursor: pointer;
    background-image: url(../../static/image/leftnav/collapse-btn.png);
    background-repeat: no-repeat;
    background-position: 50%;
    box-shadow: 0px 2px 3px 0px #eef1f6;
    -webkit-box-shadow: 0px 2px 3px 0px #eef1f6;
    margin-bottom: 4px;

} 
.menu-image{
    float: left;
    margin-top: 12px;
    margin-right: 9px;
    margin-left: -8px;
}
 </style>

 
