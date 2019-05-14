<template>
	<el-tree :data="data" :props="defaultProps" node-key="label" @node-click="handleNodeClick" default-expand-all>
		<span class="custom-tree-node" slot-scope="{ node, data }">
			<i :class="data.icon"></i>
			<span style="margin-left: 5px;">{{ node.label }}</span>
		</span>
	</el-tree>
</template>

<script>
	import Bus from './Bus'

	export default {
		name: "f-tree",
		data() {
			return {
				data: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		mounted() {
			
			this.data = t.fileTree
		},
		methods: {
			handleNodeClick(data) {
				if (data.fileType == "xlsx") {
					Bus.$emit('addTab', data)
				}
			},

		}
	};
</script>

<style>
	.el-tree {
		background-color: #29292a !important;
		color: #eee !important;
		font-size: 12px;
		width: 100%;
	}

	.el-tree-node:focus>.el-tree-node__content {
		background-color: #373b3a !important;
	}

	.el-tree-node:active,
	.el-tree-node:hover {
		/* background-color: #00FF00; */
	}

	.el-tree-node:active>.el-tree-node__content,
	.el-tree-node:hover>.el-tree-node__content {
		background-color: #373b3a;
	}
</style>
