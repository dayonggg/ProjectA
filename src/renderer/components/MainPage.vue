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
		<el-dialog title="设置工作空间" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form>
				<el-form-item>
					<el-input v-model="tableDir" class="input-with-select">
						<template slot="prepend">表格目录：</template>
						<el-button slot="append" icon="el-icon-folder-opened"></el-button>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="resDir" class="input-with-select">
						<template slot="prepend">资源目录：</template>
						<el-button slot="append" icon="el-icon-folder-opened"></el-button>
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
	import FTree from './FTree'
	import $ from 'Jquery'

	export default {
		name: "main-page",
		data() {
			return {
				showTreeView: true,
				dialogVisible: true,
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
				tableDir: "",
				resDir: ""
			}
		},
		components: {
			FTree
		},
		mounted() {
			// localStorage.setItem('tabledir', '123')
			// localStorage.setItem('resdir', '456')

			this.tableDir = localStorage.getItem('tabledir') || ''
			this.resDir = localStorage.getItem('resdir') || ''

			if (this.resDir != '' && this.tableDir != '') {
				console.log('not null')
			} else {
				console.log('null')
			}
		},
		methods: {
			handleClose() {},
			showLeft() {
				if (this.showTreeView) {
					$('.main-left').width('26px')
					$('.f-tree').hide()
				} else {
					$('.main-left').width('200px')
					$('.f-tree').show()
				}
				this.showTreeView = !this.showTreeView
			},
			setProjConfig() {

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
			}
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
