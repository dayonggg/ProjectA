<template>
	<el-dialog title="添加模型" :visible.sync="nmDialogVisible" :before-close="dialogClose">
		<el-form>
			<el-form-item>
				<el-col :span="11">
					<el-input v-model="newModel.name">
						<template slot="prepend">模型别名</template>
					</el-input>
				</el-col>
				<el-col class="line" :span="2">&nbsp;</el-col>
				<el-col :span="11">
					<el-select v-model="newModel.group" placeholder="所属类型">
						<el-option v-for="item in modelGroups" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-col>
			</el-form-item>
			<el-form-item>
				<el-input v-model="newModel.file">
					<template slot="prepend">文件地址</template>
					<el-button @click="selectModelFile" slot="append" icon="el-icon-folder-opened"></el-button>
				</el-input>
			</el-form-item>
			<el-form-item>
				<div class="new-model-ico" @click="addModelIcon">
					<img v-if="newModel.icon" :src="['file://'+newModel.icon]" width="32px" height="32px">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</div>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogCancel">取 消</el-button>
			<el-button :disabled="!newModel.name ||!newModel.file ||!newModel.icon||!newModel.group" type="primary" @click="addModel">确
				定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import ipc from 'electron'
	import path from 'path'
	import fs from 'fs'

	export default {
		name: "dialog-newscene",
		validateName: (rule, value, callback) => {
			fs.access(path.join(this.resDir, 'scenes', value), (err) => {
				if (err) {
					callback()
				} else {
					callback(new Error(value + '场景已存在'))
				}
			})
		},
		data: {
			return {
				newScene: { //新场景数据
					name: "",
					file: "",
					png: ""
				},
				show: false,
				resDir: localStorage.getItem('resDir'),
				rules: {
					checkName: [{
						validator: validateName,
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			selectSceneFile() {
				ipc.ipcRenderer.send('open-scene', '选择需要导入的场景')
				ipc.ipcRenderer.on('selected-scene', (e, dir) => {
					this.newScene.file = dir.toString()
				})
			},
			selectSceneIcon() {
				ipc.ipcRenderer.send('open-scene-png', '选择模型图标')
				ipc.ipcRenderer.on('selected-scene-png', (e, dir) => {
					this.newScene.png = dir.toString()
				})
			},
			add(ref) {
				this.$refs[ref].validate((valid) => {
					if (valid) {
						this.show = false
					} else {
						return false
					}
				})
			},
		}
	}
</script>

<style>
</style>
