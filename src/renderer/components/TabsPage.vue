<template>
	<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
		<el-tab-pane v-for="(item, index) in editableTabs" :key="item.label" :label="item.label" :name="item.label">
			<!-- {{item.description}} -->
			<table-tab v-if="item.fileType == 'xlsx'" :id="item.label" :table="item"></table-tab>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import Bus from './Bus'
	import TableTab from './TableTab'

	export default {
		name: "tabs-page",
		data() {
			return {
				editableTabsValue: '',
				editableTabs: [],
				tabIndex: '',
			}
		},
		components: {
			TableTab
		},
		mounted() {
			Bus.$on('addTab', content => {
				this.addTab(content)
			})
		},
		methods: {
			addTab(targetName) {
				let etabs = this.editableTabs;
				let isnew = true;
				etabs.forEach((f, index) => {
					if (f.label == targetName.label) {
						this.editableTabsValue = targetName.label;
						isnew = false;
					}
				})
				if (isnew) {
					this.editableTabs.push(targetName)
				}
				this.editableTabsValue = targetName.label
			},
			removeTab(targetName) {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.label === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.label
							}
						}
					})
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.label !== targetName);
			},

		},
	}
</script>

<style>
</style>
