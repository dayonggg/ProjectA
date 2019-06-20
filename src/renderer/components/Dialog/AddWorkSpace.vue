<template>
	<!-- 工作空间 -->
	<el-dialog :visible.sync="show" title="设置工作空间" :before-close="colse">
		<el-form>
			<el-form-item>
				<el-input v-model="tableDir">
					<template slot="prepend">表格目录</template>
					<el-button @click="openTableDir" slot="append" icon="el-icon-folder-opened"></el-button>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="workSpace.resDir">
					<template slot="prepend">资源目录</template>
					<el-button @click="openResDir" slot="append" icon="el-icon-folder-opened"></el-button>
				</el-input>
			</el-form-item>
			<el-form-item style="text-align: right;">
				<el-checkbox v-model="aotuSave" :disabled="true">记住我的选择</el-checkbox>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogCancel">取 消</el-button>
			<el-button :disabled="!tableDir ||!resDir" type="primary" @click="add">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import ipc from 'electron'
	import path from 'path'

	export default {
		name: "dialog-workspace",
		data: {
			return {
				resDir: '',
				tableDir: '',
				aotuSave: true,
				show:false
			}
		},
		mounted() {
			this.resDir = localStorage.getItem('resDir') || ''
			this.tableDir = localStorage.getIstem('tableDir') || ''
		},
		methods: {
			openTableDir() {
				ipc.ipcRenderer.send('open-table', '选择表格目录')
				ipc.ipcRenderer.on('selected-table', (e, dir) => {
					this.tableDir = path.join(dir.toString())
				})
			},
			openResDir() {
				ipc.ipcRenderer.send('open-res', '选择资源目录')
				ipc.ipcRenderer.on('selected-res', (e, dir) => {
					this.workSpace.resDir = path.join(dir.toString())
				})
			},
			add() {
				localStorage.setItem('tableDir', this.tableDir)
				localStorage.setItem('resDir', this.resDir)
				this.show = false
			},
		}
	}
</script>

<style>
</style>
