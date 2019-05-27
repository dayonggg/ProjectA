<template>
	<el-container class="main-page" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中"
	 element-loading-background="rgba(0, 0, 0, 0.5)">
		<el-header height="30px">
			<!-- <div class="title"></div> -->
			<div class="main-menu-panel">
				<!-- 保存、全部保存、发布 -->
				<el-button-group class="main-menu-addgroup">
					<el-button icon="iconfont gd-iconsave" @click="saveTab" :disabled="saveBtnDisable"></el-button>
					<el-button icon="iconfont gd-iconcontentsaveall" @click="saveAllTab" :disabled="saveAllBtnDisable"></el-button>
					<el-button icon="iconfont gd-iconpublish" @click="publish" :disabled="publishBtnDisable"></el-button>
				</el-button-group>
				<!-- 添加场景、模型 -->
				<el-button-group class="main-menu-addgroup">
					<el-button icon="iconfont gd-iconeditor-preview" @click="openNS" :disabled="configed"></el-button>
					<el-button icon="iconfont gd-iconreview-spell" @click="openNM" :disabled="configed"></el-button>
				</el-button-group>
			</div>
		</el-header>
		<el-container>
			<el-aside class="main-left" width="240px">
				<el-container>
					<el-header height="25px" class="main-left-ctrl">
						<i class="el-icon-arrow-left" @click="showLeft"></i>
					</el-header>
					<el-container>
						<!-- 文件列表 -->
						<f-tree class="f-tree" ref="ftree"></f-tree>
					</el-container>
					<el-footer height="35px">
						<i class="el-icon-setting" @click="setProjConfig"></i>
					</el-footer>
				</el-container>
			</el-aside>
			<el-main>
				<tabs-page ref="tabspage"></tabs-page>
			</el-main>
		</el-container>
		<!--         Dialog          -->
		<!-- 工作空间 -->
		<el-dialog title="设置工作空间" :visible.sync="wsDialogVisible" :before-close="dialogWSClose">
			<el-form>
				<el-form-item>
					<el-input v-model="workSpace.tableDir">
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
					<el-checkbox v-model="saveSpaceDir" :disabled="true">记住我的选择</el-checkbox>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogCancel">取 消</el-button>
				<el-button :disabled="!workSpace.tableDir ||!workSpace.resDir" type="primary" @click="addWS">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 新增场景 -->
		<el-dialog title="添加场景" :visible.sync="nsDialogVisible" :before-close="dialogClose">
			<el-form>
				<el-form-item>
					<el-input v-model="newScene.name">
						<template slot="prepend">场景别名</template>
						<!-- <el-button @click="openTableDir" slot="append" icon="el-icon-folder-opened"></el-button> -->
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="newScene.file">
						<template slot="prepend">文件地址</template>
						<el-button @click="selectSceneFile" slot="append" icon="el-icon-folder-opened"></el-button>
					</el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogCancel">取 消</el-button>
				<el-button :disabled="!newScene.name ||!newScene.file" type="primary" @click="addScene">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 新增模型 -->
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
	</el-container>
</template>

<script>
	import ipc from 'electron'
	import fs from 'fs'
	import path from 'path'
	import FTree from './FTree'
	import TabsPage from './TabsPage'
	import Bus from './Bus'
	import $ from 'Jquery'

	export default {
		name: "main-page",
		data() {
			return {
				version:'0.0.2',
				fullscreenLoading: true,
				configed: true,
				saveBtnDisable: true, //保存按钮是否不可用
				saveAllBtnDisable: true, //全部保存按钮是否不可用
				publishBtnDisable: true, //发布按钮是否不可用
				treeVisible: true, //是否展开文件列表
				wsDialogVisible: false, //是否显示工作空间对话框
				nsDialogVisible: false, //是否显示新建场景对话框
				nmDialogVisible: false, //是否显示新建模型对话框
				workSpace: { //工作空间
					tableDir: "",
					resDir: ""
				},
				newScene: { //新场景数据
					name: "",
					file: "",
					png: ""
				},
				newModel: { //新模型数据
					name: "",
					file: "",
					icon: "",
					group: ""
				},
				listConfigDir: "", //项目配置文件
				localConfig: {},
				saveSpaceDir: true, //是否保存工作空间地址
				modelGroups: [], //模型类别列表
				fl: [],
				tabState: {}
			}
		},
		components: {
			FTree,
			TabsPage
		},
		mounted() {
			if(this.version != localStorage.getItem('version')){
				localStorage.clear()
				localStorage.setItem('version',this.version)
			}
			
			
			this.workSpace.tableDir = localStorage.getItem('tableDir') || ''
			this.workSpace.resDir = localStorage.getItem('resDir') || ''

			if (this.workSpace.tableDir == '' || this.workSpace.resDir == '') {
				this.wsDialogVisible = true
			} else {
				fs.exists(path.join(this.workSpace.resDir, 'Assets'), e => {
					if (e) {
						this.initProjConfig()
						this.modelGroups = this.localConfig.content.treeData[1].lhDir
						Bus.$emit('updataTree', this.localConfig.content.treeData)
						this.configed = false
					}
					if (!e) {
						this.workSpace.resDir = ''
						this.workSpace.tableDir = ''
						this.wsDialogVisible = true
						this.$message.error('资源路径错误，重新选择')
					}
				})
			}
			// this.tabState= this.$refs.tabspage.$data
			this.$set(this.$data, 'tabState', this.$refs.tabspage.$data)
			this.fullscreenLoading = false
		},
		methods: {
			showLeft() {
				if (this.treeVisible) {
					$('.main-left').width('26px')
					$('.f-tree').hide()
					$('.main-left-ctrl i').removeClass('el-icon-arrow-left')
					$('.main-left-ctrl i').addClass('el-icon-arrow-right')
				} else {
					$('.main-left').width('240px')
					$('.f-tree').show()
					$('.main-left-ctrl i').removeClass('el-icon-arrow-right')
					$('.main-left-ctrl i').addClass('el-icon-arrow-left')
				}
				Bus.$emit('resize', {})
				this.treeVisible = !this.treeVisible
			},
			initProjConfig() {
				let strConfig = localStorage.getItem('config') || ''
				if (strConfig != '') {
					this.localConfig = JSON.parse(strConfig)
				} else {
					let cfg = {
						label: '设置',
						fileType: 'conf',
						content: {
							treeData: [{
								label: "Tables",
								children: []
							}, {
								label: "Resource",
								resDir: "Assets",
								lsDir: "scene",
								lhDir: ["grounds", "monster", "role"],
								children: []
							}]
						}
					}
					// 表格文件列表
					let tablelist = fs.readdirSync(this.workSpace.tableDir)
					for (let i = 0; i < tablelist.length; i++) {
						if (path.extname(tablelist[i]) == '.xlsx') {
							let tableObj = {
								label: tablelist[i],
								fileType: 'xlsx',
								byServer: true,
								byClient: true,
								serverIgnore: ['mark'],
								clientIgnore: ['mark'],
								disabled: false
							}
							cfg.content.treeData[0].children.push(tableObj)
						}
					}

					let restree = cfg.content.treeData[1]

					// 资源文件列表
					let resChildren = []
					let localres = fs.readdirSync(path.join(this.workSpace.resDir, restree.resDir))
					for (let i = 0; i < localres.length; i++) {
						let en = path.extname(localres[i])
						if (en == '.png' || en == '.jpg' || en == '.lav' || en == '.lmat') {
							let resObj = {
								label: localres[i],
								fileType: en,
								path:restree.resDir
							}
							resChildren.push(resObj)
						}
					}
					restree.children.push({
						label: restree.resDir,
						children: resChildren
					})
					//场景文件列表
					let sceneChildren = []
					let localscene = fs.readdirSync(path.join(this.workSpace.resDir, restree.lsDir))
					for (let i = 0; i < localscene.length; i++) {
						let en = path.extname(localscene[i])
						if (en == '.ls') {
							let resObj = {
								label: localscene[i],
								fileType: en,
								path: restree.lsDir
							}
							sceneChildren.push(resObj)
						}
					}
					restree.children.push({
						label: restree.lsDir,
						children: sceneChildren
					})
					//模型文件列表

					for (let i = 0; i < restree.lhDir.length; i++) {
						let modelChildren = []
						let localmodel = fs.readdirSync(path.join(this.workSpace.resDir, restree.lhDir[i]))
						for (let j = 0; j < localmodel.length; j++) {
							let en = path.extname(localmodel[j])
							if (en == '.lh') {
								let resObj = {
									label: localmodel[j],
									fileType: en,
									path: restree.lhDir[i]
								}
								modelChildren.push(resObj)
							}
						}
						restree.children.push({
							label: restree.lhDir[i],
							children: modelChildren
						})
					}
					localStorage.setItem('config', JSON.stringify(cfg))
					this.localConfig = cfg
					// console.log(this.localConfig)
				}
			},
			setProjConfig() {
				if (!this.configed) {
					Bus.$emit('addTab', this.localConfig)
				}
			},
			dialogWSClose(done) {
				this.$confirm('未设置工作路径无法使用，你确定要退出应用吗？')
					.then(_ => {
						ipc.ipcRenderer.send('close-win')
						done()
					})
					.catch(_ => {})
			},
			dialogClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.dialogCancel()
						this.configed = false
						done()
					})
					.catch(_ => {})
			},
			dialogCancel() {
				this.newModel = {
					name: "",
					file: "",
					icon: "",
					group: ""
				}
				this.newScene = {
					name: "",
					file: "",
					png: ""
				}
				this.workSpace.tableDir = localStorage.getItem('tableDir') || ''
				this.workSpace.resDir = localStorage.getItem('resDir') || ''
				this.wsDialogVisible = this.nsDialogVisible = this.nmDialogVisible = false
			},
			openTableDir() {
				let self = this;
				ipc.ipcRenderer.send('open-table', '选择表格目录')
				ipc.ipcRenderer.on('selected-table', (e, dir) => {
					let dirPath = path.join(dir.toString())
					self.saveSpaceDir ? localStorage.setItem('tableDir', dirPath) : localStorage.setItem('tableDir', '')
					self.workSpace.tableDir = dirPath
				})
			},
			openResDir() {
				let self = this
				ipc.ipcRenderer.send('open-res', '选择资源目录')
				ipc.ipcRenderer.on('selected-res', (e, dir) => {
					let dirPath = path.join(dir.toString())
					self.saveSpaceDir ? localStorage.setItem('resDir', dirPath) : localStorage.setItem('resDir', '')
					self.workSpace.resDir = dirPath
				});
			},
			addWS() {
				fs.exists(path.join(this.workSpace.resDir, 'Assets'), e => {
					if (e) {
						this.initProjConfig()
						self.modelGroups = this.localConfig.content.treeData[1].lhDir
						Bus.$emit('updataTree', this.localConfig.content.treeData)
						this.configed = false
						this.wsDialogVisible = false
					}
					if (!e) {
						this.workSpace.resDir = ''
						this.$message.error('资源路径错误，重新选择')
					}
				})
			},
			openNS() {
				this.configed = true
				this.nsDialogVisible = true
			},
			openNM() {
				this.configed = true
				this.nmDialogVisible = true
			},
			fileOperation(fileObj, group) {
				fs.exists(path.join(this.workSpace.resDir, 'Assets'), e=> {
					if (e) {
						let filePath = path.join(fileObj)
						let fileType = path.extname(fileObj)
						let sourceRoot = path.dirname(filePath)
						let targetRoot = this.workSpace.resDir
						let d = fs.readFileSync(filePath)
						let obj = JSON.parse(d.toString())
						this.fl = []
						this.parseJson(obj, sourceRoot)
						if (fileType == '.ls') {
							fs.writeFileSync(path.join(targetRoot, 'scene', path.basename(filePath)), this.replaceWithArr(JSON.stringify(
								obj,
								null, "\t"), this.unique(this.fl)))
						}
						if (fileType == '.lh') {
							fs.writeFileSync(path.join(targetRoot, group, path.basename(filePath)), this.replaceWithArr(JSON.stringify(obj,
								null, "\t"), this.unique(this.fl)))
						}
						this.configed = false
					}
					if (!e) {
						this.$message.error('未找到 ' + group + ' 目录')
					}
				})
			},
			selectSceneFile() {
				let self = this
				ipc.ipcRenderer.send('open-scene', '选择需要导入的场景')
				ipc.ipcRenderer.on('selected-scene', (e, dir) => {
					self.newScene.file = dir.toString()
				})
			},
			selectModelFile() {
				let self = this
				ipc.ipcRenderer.send('open-model', '选择需要导入的模型')
				ipc.ipcRenderer.on('selected-model', (e, dir) => {
					self.newModel.file = dir.toString()
				})
			},
			addScene() {
				this.fileOperation(this.newScene.file)
				//Todo Edit Table & png
				this.nsDialogVisible = false
				this.newScene = {
					name: "",
					file: "",
					png: ""
				}
				Bus.$emit('updataTree', this.localConfig.content.treeData)
				this.$message({
					message: '成功增加一个新场景',
					type: 'success'
				})
			},
			addModel() {
				this.fileOperation(this.newModel.file, this.newModel.group)
				this.nmDialogVisible = false
				this.newModel = {
					name: "",
					file: "",
					icon: "",
					group: ""
				}
				Bus.$emit('updataTree', this.localConfig.content.treeData)
				this.$message({
					message: '成功增加一个新模型',
					type: 'success'
				})
			},
			addModelIcon() {
				let self = this
				ipc.ipcRenderer.send('open-model-ico', '选择模型图标')
				ipc.ipcRenderer.on('selected-model-ico', (e, dir) => {
					self.newModel.icon = dir.toString()
				})
			},
			unique(arr) {
				var hash = [];
				for (var i = 0; i < arr.length; i++) {
					for (var j = i + 1; j < arr.length; j++) {
						if (arr[i] === arr[j]) {
							++i;
						}
					}
					hash.push(arr[i]);
				}
				return hash;
			},
			parseJson(obj, sourceRoot) {
				for (var key in obj) {
					var ele = obj[key]
					let self = this
					if (Object.prototype.toString.call(ele) === '[object Object]' || Object.prototype.toString.call(ele) ===
						'[object Array]') {
						this.parseJson(ele, sourceRoot)
					} else if (Object.prototype.toString.call(ele) === '[object String]') {
						if (path.extname(ele) == '.png' || path.extname(ele) == '.jpg' || path.extname(ele) == '.lav' || path.extname(
								ele) ==
							'.lm') {
							let s = path.join(sourceRoot, ele)
							let t = path.join(this.workSpace.resDir, "Assets/", path.basename(ele))
							fs.readFile(s, function(err, originBuffer) {
								fs.writeFile(t, originBuffer, function(err) {
									if (err) {
										console.log(err)
									}
								});
							})
							self.fl.push(ele + "@Assets/" + path.basename(ele))
						}
						if (path.extname(ele) == '.lmat') {
							let lmatPath = path.join(sourceRoot, ele)
							let d = fs.readFileSync(lmatPath)
							let obj1 = JSON.parse(d.toString())
							this.parseJson(obj1, path.dirname(lmatPath))
							self.fl.push(ele + "@Assets/" + path.basename(ele))
							fs.writeFileSync(path.join(this.workSpace.resDir, 'Assets', path.basename(ele)), self.replaceWithArr(JSON.stringify(
								obj1, null, "\t"), this.unique(this.fl)))
						}
					}
				}
			},
			replaceWithArr(str, arr) {
				for (let i = 0; i < arr.length; i++) {
					let a = arr[i].split('@')
					let re = new RegExp(a[0], "g")
					str = str.replace(re, a[1])
				}
				return str
			},
			saveTab() {
				console.log(this.tabState)
			},
			saveAllTab() {
				console.log(this.localConfig)
			},
			publish() {

			}
		},
		watch: {
			tabState: {
				handler(newValue) {
					this.saveAllBtnDisable = true
					this.saveBtnDisable = true
					if (newValue.unSavedTabs.length > 0) {
						this.saveAllBtnDisable = false
						for (let i = 0; i < newValue.unSavedTabs.length; i++) {
							if (newValue.unSavedTabs[i] == newValue.editableTabsValue) {
								this.saveBtnDisable = false
							}
						}
					}
				},
				deep: true
			}
		}
	}
</script>

<style>
	.main-page {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		border: none;
	}

	.main-page>.el-header {
		padding: 0px;
	}

	.title {
		height: 20px;
		width: 100%;
		line-height: 25px;
		text-align: center;
		font-weight: 600;
	}

	.main-menu-panel {
		height: 30px;
		line-height: 30px;
		width: 100%;
		text-align: left;
	}

	.main-menu-addgroup {
		margin: 0px 40px;
	}

	.main-menu-panel .el-button {
		padding: 3px 14px;
	}

	.main-page>.el-container {
		height: calc(100%-30px) !important;
	}

	.main-page>.el-header {
		/* background-color: #3c3f3e; */
	}

	.main-page>.el-container>.el-aside {
		/* background-color: #29292a; */
	}

	.main-left>.el-container {
		height: 100%;
	}

	.main-left>.el-container>.el-main {
		/* height: calc(100%-60px); */
	}

	.main-left>.el-container>.el-footer {
		text-align: center;
		font-size: 18px;
		padding: 5px 0px !important;
	}

	.main-left>.el-container>.el-footer>i {
		color: #909399;
		cursor: pointer;
	}

	.main-left>.el-container>.el-footer>i:hover {
		color: #606266;
	}

	.main-left-ctrl {
		font-size: 16px !important;
		line-height: 20px !important;
		text-align: right !important;
		padding: 5px 5px !important;

	}

	.main-left-ctrl>i {
		cursor: pointer;
		color: #C0C4CC;
	}

	.main-left-ctrl>i:hover {
		color: #303133;
	}

	.main-page>.el-container>.el-main {
		padding: 4px;
		/* background-color: #232424; */
	}

	.main-page>.el-container>.el-main>.el-tabs,
	.main-page>.el-container>.el-main>.el-tabs>.el-tabs__header,
	.main-page>.el-container>.el-main>.el-tabs>.el-tabs__content {
		/* background-color: #232424; */
		border: 0px;
	}

	.main-page>.el-container>.el-main>.el-tabs>.el-tabs__content {

		padding: 5px;
		height: calc(100% - 50px);
		overflow: auto;
	}

	.main-page>.el-container>.el-main>.el-tabs {
		height: 100%;
		width: 100%;
	}

	.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
		/* color: #fff !important; */
		/* background-color: #29292a !important; */
		/* border-color: #29292a !important; */
	}

	.el-tabs__item:hover {
		/* color: #fff !important; */
	}

	.new-model-ico {
		width: 32px;
		height: 32px;
		line-height: 32px;
		padding: 4px;
		border: #DCDFE6 2px dashed;
		text-align: center;
		font-size: 20px;
		border-radius: 6px;
		color: #DCDFE6;
	}

	.new-model-ico:hover {
		color: #C0C4CC;
		border-color: #C0C4CC;
		cursor: pointer;
	}
</style>
