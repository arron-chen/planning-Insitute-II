<template>
<div>
<script type="jtk" id="jtk-template-default333">
 <div style="left:${left}px;top:${top}px;width:${w}px;height:${h}px;" >
		<div class="node-delete node-action"><i class="fa fa-times"></i></div>
	   <div class="few outer" nodeid="${nodeid}">
		<span class="bg01"></span>
		${label}
			  <jtk-source port-type="start" filter=".bg01" filter-negate="true"/>
		<jtk-target port-type="target"/>
		</div>
</div>


</script>

<script type="jtk" id="jtk-template-default">
<div class="jobDiv" nodeid="${nodeid}" >
		<div class="jobImg outer">
			<span class="node-delete node-action close"></span>
			<img src="images/JOB.png" class="img"/>
		</div>

		<div class="jobName">${label}</div>
		<jtk-source port-type="start" filter=".jobName" filter-negate="false"/>
		<jtk-target port-type="target" filter=".jobDiv" />
</div>
</script>

<script type="jtk" id="jtk-template-error">
<div style="left:${left}px;top:${top}px;width:${w}px;height:${h}px;" class="flowchart-object flowchart-start">
    <div class="outer">
        <div class="few few1 " onMouseOver="ex(this)" onMouseOut="hd(this)" onclick="show(this)">
		<span class="bg02"></span>
		${label}
		</div>
		 <div class="chosebox">
		   <ul class="chose">
                           <li><span class="glyphicon glyphicon-stats"></span>    运行流图</li>
                           <li onclick="newopen(this)"><span class="glyphicon glyphicon-list-alt" ></span> 运行日志</li>
                           <li><span class="glyphicon glyphicon-play-circle"></span> 重跑</li>
                           <li><span class="glyphicon glyphicon-stop"></span> 停止</li>
                        </ul>
		  </div>

		 <div class="titleexplian">${name}<br/>
								${category}<br/>
								${status}<br/>
								${startDate}<br/>
								${endDate}<br/>
								${createUser}<br/>
         </div>
	 <jtk-source port-type="start" filter=".outer" filter-negate="true"/>
		 <jtk-target port-type="target"/>
	</div>
</div>
</script>

<script type="jtk" class="dlg" id="dlgConfirm" title="确定删除吗？">
  <textarea class="txtViewQuery" jtk-focus jtk-att="query">${msg}</textarea>
</script>
<div style="width:25%;height:500px;border:1px solid red;float:left" id="dropImg">
        <ul id="tree" class="ztree" style="width:150px; overflow:auto;"></ul>
    </div>


    <div id="demo1" style="width:55%;border:1px solid #456;height:500px;"></div>
</div>
</template>


<script>
// 流程图样式
// // import '@/libs/jsplumb/css/font-awesome.min.css'
import "@/libs/jsplumb/css/jsPlumbToolkit-defaults.css";
import "@/libs/jsplumb/css/drop.css";
import "@/libs/jsplumb/js/zTree_v3/css/zTreeStyle/zTreeStyle.css";

// //流程图脚本
import "@/libs/jsplumb/js/zTree_v3/js/jquery.ztree.core-3.5.min.js";
import "@/libs/jsplumb/js/zTree_v3/js/jquery.ztree.excheck-3.5.js";
import "@/libs/jsplumb/js/zTree_v3/js/jquery.ztree.exedit-3.5.js";
// import '@/libs/jsplumb/js/jsplumb.min.js'
// import '@/libs/jsplumb/js/jsPlumbToolkit-1.0.17.js'
import kpZTree from "@/libs/jsplumb/js/kpZTree.js";
import "@/libs/jsplumb/js/kpDrop.js";
export default {
  mounted() {
    var zTreeObj,
      setting = {
        view: {
          selectedMulti: false
        },
        edit: {
          enable: true,
          showRemoveBtn: false,
          showRenameBtn: false
        },
        callback: {
          onMouseUp: zTreeBeforeDrop,
          beforeDrag: beforeDrag,
          beforeDrop: beforeDrop
        }
      };

    function zTreeBeforeDrop(e, treeId, treeNode) {
      return false;
      //return !(targetNode == null || (moveType != "inner" && !targetNode.parentTId));
    }

    function beforeDrag(treeId, treeNodes) {
      return true;
    }

    function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
      //如果有提交到后台的操作，则会先执行if…else…再执行post等提交操作

      return true;
    }

    var zTreeNodes = [
      {
        nodeid: "11",
        name: "网站导航",
        ename: "jtk-template-default",
        open: true,
        children: [
          { nodeid: "22", name: "定时调度1" },
          { nodeid: "33", name: "定时调度2" },
          { nodeid: "44", name: "定时调度3" }
        ]
      }
    ];
    var tookit;

    var tookitSetting = {
     // dataUrl: "data/drop.json", //初始化数据的url
      ztreeId: "tree", // ztreeId 的id用来指定拖拽的树节点
      ztreeDragTag: "li", //拖拽的标签类型
      elementsDraggable: true, //false 禁止面板节点拖拽
      enablePan: true //禁止拖动面板
    };

	// var zTreeObj = kpZTree.init($("#tree"), setting, zTreeNodes);
	$("#tree").zTree(setting,zTreeNodes)
    // tookit = $("#demo1").kpDrop("init", tookitSetting);

    function getData() {
      var data = tookit.getData();
    }

    function reload() {
     // tookit.reload("data/drop2.json");
    }
  }
};
</script>


