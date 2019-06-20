<template>
	<el-tree :data="data" :props="defaultProps" node-key="label" @node-click="nodeClick">
		<span class="custom-tree-node" slot-scope="{ node, data }">
			<span :class="{ activate: data.activate }">{{ node.label }}</span>
		</span>
	</el-tree>
</template>

<script>
	import Bus from '../Bus.js'

	export default {
		name: "f-tree",
		data() {
			return {
				data: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				activateTab:{}
			}
		},
		mounted() {
			Bus.$on('updataTableList', content => {
				this.data = content
			})
		},
		methods: {
			nodeClick(data) {
				if (data.hasOwnProperty("extname")) {
					this.activateTab.activate = false
					this.activateTab = data
					this.activateTab.activate = true
					console.log(data)
					Bus.$emit('addTab', data)
				}
			},
		}
	}
</script>

<style>
	.el-tree {
		font-size: 13px;
		width: 100%;
		overflow: hidden;
		color: #000 !important;
	}

	.el-tree:hover {
		overflow: auto
	}

	.el-tree-node__content {
		height: 22px !important;
	}
	.activate {
		font-weight: 700;
	}
</style>
