<template>
	<el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
</template>

<script>
	export default {
		name:"f-tree",
		data() {
			return {
				data: [{
					label: '一级 1',
					children: [{
						label: '二级 1-1'
					}]
				}, {
					label: '一级 2',
					children: [{
						label: '二级 2-1'
					}, {
						label: '二级 2-2'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		methods: {
			handleNodeClick(data) {
				console.log(data);
			}
		}
	};
</script>

<style>
	.el-tree{
		background-color: #29292a !important;
		color: #eee !important;
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
