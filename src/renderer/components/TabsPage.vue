<template>
	<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
		<el-tab-pane v-for="(item, index) in editableTabs" :key="item.label" :label="item.label" :name="item.label">
			{{item.description}}
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import Common from './js/common.js'
	
	export default {
		name: "tabs-page",
		data() {
			return {
				editableTabsValue: '',
				editableTabs: [],
				tabIndex: '',
			}
		},
		mounted() {
			this.update()
		},
		methods: {
			update(){
				this.editableTabsValue = Common.editableTabsValue
				this.editableTabs = Common.editableTabs
				this.tabIndex = Common.tabIndex
			},
			addTab(targetName) {
				let self = this
				Common.addTab(targetName,function(){
					self.update()
					console.log('1')
				})
				
			},
			removeTab(targetName) {
				Common.removeTab(targetName)
				this.update()
			},
		},
		watch: {
			editableTabsValue(newValue, oldValue) {
				console.log("a: "+newValue, oldValue);
			}
		},
	}
</script>

<style>
</style>
