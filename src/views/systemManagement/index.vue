<template>
    <div style="position:absolute;width:100%;top:0;bottom:30px;" id="systemmanagement">
        <div class="nav">
                <div class="collapse-btn" @click="taggleNav()"></div>
                <el-menu class="el-menu-vertical-demo" unique-opened :collapse="isCollapse" :default-active="activeTabName">
                        <el-menu-item v-for="(item,index) in items" :index="item.moduleId" :key="index" @click="openTab(item)">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                </el-menu>
        </div>
        <div style="height:100%;overflow:hidden;">
            <div class="right-pane">
                <el-tabs class="tabs" v-model="activeTabName" @tab-remove="closeTab" type="card">
                    <el-tab-pane v-for="item in tabList" :key="item.name" :name="item.name" :label="item.label" :closable="item.closable">
                        <component :is="item.component"></component>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../fetch/index'
import {mapActions,mapMutations,mapGetters} from "vuex"
export default {
    methods: {
        ...mapMutations({
            openTab: 'SET_ADDTAB'
        }),
        ...mapActions([
            'FETCT_NAVMENU'
        ]),
        taggleNav: function () {
            if (this.isCollapse == false) {
                this.isCollapse = true
            } else {
                this.isCollapse = false;
            }
        },
        ...mapMutations({
            closeTab: 'SET_CLOSETAB'
        })
    },
    mounted() {
        api.fetchLeftNav({params:{menuId: 6}})
        .then(res=>{
            this.items=res.data.mTree.children
        })
    },
    computed: {
        activeTabName: {
            get() {
                return this.$store.state.system.activeTabName;
            },
            set(value) {
                this.$store.commit("SET_ACTIVETABNAME", value);
            }
        },
        ...mapGetters({
            tabList: 'DONE_NAV_TABLIST' 
        })
    },
    data(){
        return{
            isCollapse: false,
            items:[]
        }
    }
}
</script>
<style scoped>
.right-pane {
    height: 100%;
}

.tabs {
    height: 100%;
    box-sizing: border-box;
}
</style>