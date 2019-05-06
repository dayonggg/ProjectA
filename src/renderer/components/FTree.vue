<template>
	<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
</template>

<script>
	export default {
		name:"f-tree",
		data() {
			return {
				data: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		props:{
			listdata:Array
		},
		mounted() {
		  this.data = this.listdata;
		},
		methods: {
			handleNodeClick(data) {
				
			}
		}
	};
</script>

<style>
	.el-tree{
		background-color: #29292a !important;
		color: #eee !important;
		font-size: 12px;
		width: 100%;
	}
	.el-tree-node:focus>.el-tree-node__content{
		background-color: #373b3a !important;
	}
	.el-tree-node:active,
	.el-tree-node:hover{
		/* background-color: #00FF00; */
	}
	.el-tree-node:active>.el-tree-node__content,
	.el-tree-node:hover>.el-tree-node__content{
		background-color: #373b3a;
	}
	
	
	/* el-tree-node is-expanded is-current is-focusable */
	
	
</style>
