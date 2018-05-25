/**
* @author gzk
* @version 1.0
* @param  
*/
<template>
    <div class="right-pane">
        <el-tabs class="tabs" v-model="activeTabName" @tab-remove="closeTab" type="card">
            <el-tab-pane v-for="item in tabList" :key="item.name" :name="item.name" :label="item.label" :closable="item.closable">
                <component :is="item.component"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
 
export default {
    name: 'RightPane',
    computed: {
        activeTabName: {
            get() {
                return this.$store.state.NavTabs.activeTabName;
            },
            set(value) {
                this.$store.commit("SET_ACTIVETABNAME", value);
            }
        },
        ...mapGetters({
            tabList: 'DONE_NAV_TABLIST'
        })
    },
    methods: {
        ...mapMutations({
            closeTab: 'SET_CLOSETAB'
        })
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
<style type="text/css">
    .el-tabs__nav-wrap{
        margin-top: 9px;
    }
    .el-tabs__header{
        border-bottom: 1px solid #26c6da;
    }
    .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
       border: 1px solid #26c6da;
       border-bottom-color: #fff;
       border-radius: 4px 4px 0 0;
    } 
    .el-tabs__item{
        color: #010101;
        font-size: 16px;
    }
    .el-tabs__item.is-active{
        color: #26c6da;
    } 
    .el-tabs__header{
        margin:0px;
    }
</style>

