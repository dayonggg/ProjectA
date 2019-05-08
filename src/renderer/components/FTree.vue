<template>
	<el-tree :data="data" :props="defaultProps" node-key="label" @node-click="handleNodeClick" default-expand-all>
		<span class="custom-tree-node" slot-scope="{ node, data }">
			<i :class="data.icon"></i>
			<span style="margin-left: 5px;">{{ node.label }}</span>
		</span>
	</el-tree>
</template>

<script>
	import Common from './js/common.js'

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
			let t = Common.init()
			this.data = t.fileTree
		},
		methods: {
			handleNodeClick(data) {
				// console.log(data)
				if (data.fileType == "xlsx") {
					let etabs = Common.editableTabs;
					let isnew = true;
					etabs.forEach((f, index) => {
						if (f.label == data.label) {
							// Common.editableTabsValue = t.label;
							isnew = false;
						}
					});
					if (isnew) {
						Common.addTab(data)
					}
					

				}
			}
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
