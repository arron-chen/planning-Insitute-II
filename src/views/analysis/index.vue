<template>
    <div class="content-box" id="analysis">
        <div class="nav">
                <div class="collapse-btn" @click="taggleNav()"></div>
                <el-menu class="el-menu-vertical-demo"  unique-opened :collapse="isCollapse" :default-active="analysisActiveTabName">
                        <el-menu-item v-for="(item,index) in items" :index="item.moduleId" :key="index" @click="openTab(item)">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{item.name}}</span>
                        </el-menu-item>
                </el-menu>
                
        </div>
            <div class="right-pane">
                <el-tabs class="tabs" v-model="analysisActiveTabName" @tab-remove="closeTab" type="card">
                    <el-tab-pane v-for="item in analysisTabList" :key="item.name" :name="item.name" :label="item.label" :closable="item.closable">
                        <component :is="item.component"></component>
                    </el-tab-pane>
                </el-tabs>
            </div>
    </div>
</template>
<script>
import api from '../../fetch/index'
import { mapMutations, mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            isCollapse: false,
            items: []
        }
    },
    computed: {
        analysisActiveTabName: {
            get() {
                return this.$store.state.analysis.analysisActiveTabName;
            },
            set(value) {
                this.$store.commit("SET_ANALYSISACTIVETABNAME", value);
            }
        },
        ...mapGetters({
            analysisTabList: 'DONE_NAV_ANALYSIS_TABLIST'
        })
    },
    methods: {
        ...mapMutations({
            openTab: 'SET_ANALYSISADDTAB'
        }),
        ...mapMutations({
            closeTab: 'SET_ANALYSISCLOSETAB'
        }),
        ...mapActions([
            'FETCT_ANALYSISMENU',
        ]),
        taggleNav: function () {
            if (this.isCollapse == false) {
                this.isCollapse = true
            } else {
                this.isCollapse = false;
            }
        }
    },
    mounted() {
        api.fetchLeftNav({params:{menuId: 2}})
        .then(res=>{
            console.log(res.data.mTree.children)
            this.items=res.data.mTree.children
        })
    }
}
</script>
