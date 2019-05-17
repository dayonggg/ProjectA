<template>
	<div>
		<el-divider content-position="left">工作空间</el-divider>
		<el-form label-width="80px" size="mini">
			<el-form-item label="表格目录">
				<el-input v-model="tableDir"></el-input>
			</el-form-item>
			<el-form-item label="资源目录">
				<el-input v-model="resDir"></el-input>
			</el-form-item>
		</el-form>
		<el-divider content-position="left">预设</el-divider>
		<el-form label-width="80px" size="mini">
			<el-form-item class="model-groups" label="模型分组">
				<el-tag :key="group" v-for="group in modelGroups" closable :disable-transitions="false" @close="tagClose(group)">
					{{group}}
				</el-tag>
				<el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagInputValue" ref="saveTagInput" size="small"
				 @keyup.enter.native="addGroup" @blur="addGroup">
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showTagInput"> + </el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import Bus from './Bus'

	export default {
		name: "config-tab",
		data() {
			return {
				config: JSON.parse(localStorage.getItem('config')),
				tableDir: localStorage.getItem('tableDir'),
				resDir: localStorage.getItem('resDir'),
				modelGroups: [],
				tables: [],
				tagInputVisible: false,
				tagInputValue: ''
			}
		},
		mounted() {
			this.modelGroups = this.config.content.treeData[1].lhDir
			this.tables = this.config.content.treeData[0].children
			console.log(this.tables)
		},
		methods: {
			tagClose(group) {
				this.modelGroups.splice(this.modelGroups.indexOf(group), 1)
			},
			showTagInput() {
				this.tagInputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus()
				})
			},
			addGroup() {
				let tagInputValue = this.tagInputValue
				if (tagInputValue) {
					this.modelGroups.push(tagInputValue)
				}
				this.tagInputVisible = false
				this.tagInputValue = ''
			}
		}
	}
</script>

<style>
	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px !important;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>
