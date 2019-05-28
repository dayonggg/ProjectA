<template>
	<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
		<el-tab-pane v-for="(item, index) in editableTabs" :key="item.label" :label="item.label" :name="item.label">
			<span slot="label"><i v-show="!item.saved">*</i>{{item.label}}</span>
			<table-tab v-if="item.fileType == 'xlsx'" :id="item.label" :table="item"></table-tab>
			<config-tab v-if="item.fileType == 'conf'" :id="item.label" :cfg='item'></config-tab>
			<editor-tab v-if="item.fileType == '.ls' || item.fileType == '.lh' || item.fileType == '.lmat'|| item.fileType == '.lav'"
			 :id="item.label" :json="item"></editor-tab>
			<image-tab v-if="item.fileType == '.png' || item.fileType == '.jpg'" :id="item.label" :img="item"></image-tab>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import Bus from './Bus'
	import TableTab from './TableTab'
	import ConfigTab from './ConfigTab'
	import EditorTab from './EditorTab'
	import ImageTab from './ImageTab'

	export default {
		name: "tabs-page",
		data() {
			return {
				editableTabsValue: '',
				editableTabs: [],
				tabIndex: '',
				unSavedTabs: []
			}
		},
		components: {
			TableTab,
			ConfigTab,
			EditorTab,
			ImageTab
		},
		mounted() {
			Bus.$on('addTab', content => {
				this.addTab(content)
			})
			Bus.$on('page-state', content => {
				if (content.saved) {
					for (let i = 0; i < this.unSavedTabs; i++) {
						if (this.unSavedTabs[i] == content.label) {
							this.unSavedTabs.splice(i, 1)
							break
						}
					}
				} else {
					let isnew = true
					for (let i = 0; i < this.unSavedTabs; i++) {
						if (this.unSavedTabs[i] == content.label) {
							isnew = false
						}
					}
					if (isnew) {
						this.unSavedTabs.push(content.label)
					}
				}
				this.setSaved()
			})
		},
		methods: {
			setSaved() {
				for (let i = 0; i < this.editableTabs.length; i++) {
					this.editableTabs[i].saved = true
					for (let j = 0; j < this.unSavedTabs.length; j++) {
						if (this.editableTabs[i].label == this.unSavedTabs[j]) {
							this.editableTabs[i].saved = false
							this.$set(this.editableTabs, i, this.editableTabs[i])
						}
					}
				}
			},
			addTab(targetName) {
				let etabs = this.editableTabs;
				let isnew = true;
				etabs.forEach((f, index) => {
					if (f.label == targetName.label) {
						this.editableTabsValue = targetName.label
						isnew = false
					}
				})
				if (isnew) {
					targetName.saved = true
					this.editableTabs.push(targetName)
				}
				this.editableTabsValue = targetName.label
			},
			removeTab(targetName) {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				let close = false
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.label === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1]
							if (nextTab) {
								activeName = nextTab.label
							}
							close = tab.saved
						}
					})
				}
				this.editableTabsValue = activeName
				if (close) {
					this.editableTabs = tabs.filter(tab => tab.label !== targetName)
					this.unSavedTabs = this.unSavedTabs.filter(item => item != targetName)
				} else {
					this.$confirm('修改未保存，确认要放弃保存修改的内容吗？')
						.then(_ => {
							this.editableTabs = tabs.filter(tab => tab.label !== targetName)
							this.unSavedTabs = this.unSavedTabs.filter(item => item != targetName)
							done()
						})
						.catch(_ => {})
				}

			},

		}
	}
</script>

<style>
	.el-tabs__item {
		padding: 0px 15px !important;
		height: 32px !important;
		line-height: 32px !important;
		font-size: 12px !important;
	}

	.el-tab-pane {
		height: 100%;
		width: 100%;
	}
</style>
