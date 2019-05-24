<template>
	<el-tree :data="data" :props="defaultProps" node-key="label" @node-click="nodeClick">
		<span class="custom-tree-node" slot-scope="{ node, data }">
			<i :class="data.icon"></i>
			<span :class="{ disabled: data.disabled }" style="margin-left: 5px;">{{ node.label }}</span>
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
		props: ['treeData'],
		mounted() {
			Bus.$on('updataTree', content => {
				this.data = content
			})
		},
		methods: {
			nodeClick(data) {
				if (data.fileType == "xlsx" || data.fileType == '.ls' || data.fileType == '.lh' || data.fileType == '.lmat') {
					Bus.$emit('addTab', data)
				}
			},
		}
	};
</script>

<style>
	.el-tree {
		/* background-color: #29292a !important; */
		/* color: #eee !important; */
		font-size: 13px;
		width: 100%;
		/* height: calc(100% - 55px); */
		overflow: hidden;
		color: #000 !important;
	}

	.el-tree:hover {
		overflow: auto
	}

	.el-tree-node__content {
		height: 22px !important;
	}

	.el-tree-node:focus>.el-tree-node__content {
		/* background-color: #373b3a !important; */
	}

	.el-tree-node:active,
	.el-tree-node:hover {
		/* background-color: #00FF00; */
	}

	.el-tree-node:active>.el-tree-node__content,
	.el-tree-node:hover>.el-tree-node__content {
		/* background-color: #373b3a; */
	}

	.disabled {
		color: red;
	}
</style>
