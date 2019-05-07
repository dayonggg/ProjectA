<template>
	<el-container class="main-page">
		<el-header height="30px" style="line-height: 30px;text-align: center;font-size: 12px;">Game Resource Designer</el-header>
		<el-container>
			<el-aside class="main-left" width="200px">
				<el-container>
					<el-header height="25px" class="main-left-ctrl">
						<i class="el-icon-arrow-left" @click="showLeft"></i>
					</el-header>
					<el-container>
						<f-tree class="f-tree" :listdata="treeData"></f-tree>
					</el-container>
					<el-footer height="35px">
						<i class="el-icon-setting" @click="setProjConfig"></i>
					</el-footer>
				</el-container>

			</el-aside>
			<el-main>
				<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
					<el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
						{{item.content}}
					</el-tab-pane>
				</el-tabs>
			</el-main>
		</el-container>
		<!--         Dialog          -->
		<el-dialog title="设置工作空间" :visible.sync="wsDialogVisible" :before-close="dialogClose">
			<el-form>
				<el-form-item>
					<el-input v-model="workSpace.tableDir" :readonly="true">
						<template slot="prepend">表格目录</template>
						<el-button @click="openTableDir" slot="append" icon="el-icon-folder-opened"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="workSpace.resDir" :readonly="true">
						<template slot="prepend">资源目录</template>
						<el-button @click="openResDir" slot="append" icon="el-icon-folder-opened"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item style="text-align: right;">
					<el-checkbox v-model="saveSpaceDir">记住我的选择</el-checkbox>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="wsDialogVisible = false">取 消</el-button>
				<el-button :disabled="!workSpace.tableDir ||!workSpace.resDir" type="primary" @click="wsDialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
	import ipc from 'electron'
	import path from 'path'
	import FTree from './FTree'
	import Common from './js/common.js'
	import $ from 'Jquery'

	export default {
		name: "main-page",
		data() {
			return {
				treeVisible: true, //是否展开文件列表
				wsDialogVisible: true, //是否显示工作空间对话框
				editableTabsValue: '2',
				editableTabs: [{
					title: 'Tab 1',
					name: '1',
					content: 'Tab 1 content'
				}, {
					title: 'Tab 2',
					name: '2',
					content: 'Tab 2 content'
				}],
				tabIndex: '2',
				treeData: [{
						label: '一级 1',
						children: [{
							label: '二级 1-1'
						}]
					},
					{
						label: '一级 2',
						children: [{
							label: '二级 2-1'
						}, {
							label: '二级 2-2'
						}]
					},
				],
				workSpace: {
					tableDir: "",
					resDir: ""
				},
				saveSpaceDir: true, //是否保存工作空间地址
			}
		},
		components: {
			FTree
		},
		mounted() {},
		methods: {
			showLeft() {
				if (this.treeVisible) {
					$('.main-left').width('26px')
					$('.f-tree').hide()
				} else {
					$('.main-left').width('200px')
					$('.f-tree').show()
				}
				this.treeVisible = !this.treeVisible

			},
			setProjConfig() {
				this.wsDialogVisible = true
			},
			addTab(targetName) {
				let newTabName = ++this.tabIndex + '';
				this.editableTabs.push({
					title: 'New Tab',
					name: newTabName,
					content: 'New Tab content'
				});
				this.editableTabsValue = newTabName;
			},
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
			dialogClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						//清空临时数据

						done();
					})
					.catch(_ => {})
			},
			openTableDir() {
				let self = this;
				ipc.ipcRenderer.send('open-table', '选择表格目录')
				ipc.ipcRenderer.on('selected-table', (e, dir) => {
					let dirPath = path.join(dir.toString())
					localStorage.setItem('tableDir', dirPath)
					self.workSpace.tableDir = dirPath
				});
			},
			openResDir() {
				let self = this;
				ipc.ipcRenderer.send('open-res', '选择资源目录')
				ipc.ipcRenderer.on('selected-res', (e, dir) => {
					let dirPath = path.join(dir.toString())
					localStorage.setItem('resDir', dirPath)
					self.workSpace.resDir = dirPath
				});
			},
			

		},
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

	.main-page>.el-container {
		height: calc(100%-60px);
	}

	.main-page>.el-header {
		background-color: #3c3f3e;
	}

	.main-page>.el-container>.el-aside {
		background-color: #29292a;
	}

	.main-left>.el-container {
		height: 100%;
	}

	.main-left>.el-container>.el-footer {
		text-align: center;
		font-size: 18px;
		padding: 5px 0px !important;
	}

	.main-left>.el-container>.el-footer>i {
		color: #ddd;
		cursor: pointer;
	}

	.main-left>.el-container>.el-footer>i:hover {
		color: #fff;
	}

	.main-left-ctrl {
		font-size: 16px !important;
		line-height: 20px !important;
		text-align: right !important;
		padding: 5px 5px !important;
	}

	.main-left-ctrl>i {
		color: #ddd;
		cursor: pointer;
	}

	.main-left-ctrl>i:hover {
		color: #fff;
	}

	.main-page>.el-container>.el-main {
		padding: 4px;
		background-color: #232424;
	}

	.main-page>.el-container>.el-main>.el-tabs,
	.main-page>.el-container>.el-main>.el-tabs>.el-tabs__header {
		background-color: #232424;
		border: 0px;
	}

	.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
		color: #fff !important;
		background-color: #29292a !important;
		border-color: #29292a !important;
	}

	.el-tabs__item:hover {
		color: #fff !important;
	}
</style>
