<template>
	<el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab" @tab-click="clickTab">
		<el-tab-pane v-for="(item, index) in editableTabs" :key="item.label" :label="item.label" :name="item.label">
			<span slot="label"><i v-show="!item.saved">*</i>{{item.label}}</span>
			<table-tab ref='table-tab' v-if="item.extname == '.xlsx'" :id="item.label" :target="item"></table-tab>
			<config-tab v-if="item.extname == 'conf'" :id="item.label" :cfg='item'></config-tab>
			<editor-tab ref='editor-tab' v-if="item.extname == '.ls' || item.extname == '.lh' || item.extname == '.lmat'|| item.extname == '.lav'"
			 :id="item.label" :json="item"></editor-tab>
			<image-tab v-if="item.extname == '.png' || item.extname == '.jpg' || item.extname == '.jpeg'" :id="item.label" :img="item"></image-tab>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import $ from 'Jquery'
	import Bus from '../Bus.js'
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
			Bus.$on('current-tab-saved', content => {
				if(!$.isEmptyObject(content)){
					this.setEditStat(content)
				}
				
			})
			Bus.$on('save-tab', content => {
				if(content){
					this.saveTarget(this.editableTabsValue)
					this.sendAllSavedStat()
				}
			})
			Bus.$on('save-all', content => {
				if(content){
					$.each(this.editableTabs,(key,value)=>{
						if(!value.saved){
							this.saveTarget(value.label)
							value.saved = true
						}
					})
					this.sendAllSavedStat()
				}
				
			})
		},
		methods: {
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
				Bus.$emit('current-tab-saved', this.getEditStat())
			},
			removeTab(targetName) {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				let close = true
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
				
				tabs.forEach((tab,index)=>{
					if(tab.label === targetName){
						close = tab.saved
					}
				})
				
				if (close) {
					this.editableTabsValue = activeName
					this.editableTabs = tabs.filter(tab => tab.label !== targetName)
				} else {
					this.$confirm('修改未保存，确认要放弃保存修改的内容吗？')
						.then(_ => {
							this.editableTabsValue = activeName
							this.editableTabs = tabs.filter(tab => tab.label !== targetName)
							Bus.$emit('current-tab-saved', this.getEditStat())
							this.sendAllSavedStat()
							done()
						})
						.catch(_ => {})
				}
				
			},
			clickTab(targetName) {
				Bus.$emit('current-tab-saved', this.getEditStat())
			},
			getIndexOfTabs() {
				let index = -1
				$.each(this.editableTabs, (key, value) => {
					if (value.label == this.editableTabsValue) {
						index = key
					}
				})
				return index
			},
			setEditStat(obj){
				$.each(this.editableTabs,(key,value)=>{
					if(obj.label == value.label){
						value.saved = obj.saved
					}
				})
			},
			getEditStat() {
				let index = this.getIndexOfTabs()
				if(index>-1){
					return this.editableTabs[index]
				}else{
					return {}
				}
			},
			saveTarget(id){
				$.each(this.$refs,(i,v1)=>{
					$.each(v1,(j,v2)=>{
						if(id == v2.$el.id){
							console.log(v2)
							v2.save()
							
						}
					})
				})
			},
			sendAllSavedStat(){
				let stat = true
				$.each(this.editableTabs,(key,value)=>{
					if(value.saved == false){
						stat = false
					}
				})
				Bus.$emit('tabs-saved',stat)
			}
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
