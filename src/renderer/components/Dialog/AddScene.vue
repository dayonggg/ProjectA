<template>
	<el-dialog title="添加场景" :visible.sync="show" :before-close="dialogClose">
		<el-form :model="newScene">
			<el-form-item>
				<el-input v-model="newScene.name" autocomplete="off">
					<template slot="prepend">场景别名</template>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="newScene.file">
					<template slot="prepend">文件地址</template>
					<el-button @click="selectSceneFile" slot="append" icon="el-icon-folder-opened"></el-button>
				</el-input>
			</el-form-item>
			<el-form-item>
				<div class="new-model-ico" @click="selectSceneIcon">
					<img v-if="newScene.png" :src="['file://'+newScene.png]" width="32px" height="32px">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</div>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialogCancel">取 消</el-button>
			<el-button :disabled="!newScene.name ||!newScene.file||!newScene.png" type="primary" @click="add('newSceneForm')">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import ipc from 'electron'
	import path from 'path'
	import fs from 'fs'
	import D from '../Common/data.js'

	export default {
		
		name: "add-scene",
		data() {
			return {
				newScene: { //新场景数据
					name: "",
					file: "",
					png: ""
				},
				show: true,
				resDir: localStorage.getItem('resDir'),
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
			add() {
				if(D.checkSceneName(this.newScene.name)){
					this.$message.error('该场景名已存在')
				}else{
					
				}
			},
			dialogClose(){
				
			},
			dialogCancel(){
				
			}
		}
	}
</script>

<style>
</style>
