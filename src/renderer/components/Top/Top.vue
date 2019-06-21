<template>
	<div class="main-menu-panel">
		<!-- 保存、全部保存、发布 -->
		<!-- <el-button-group class="main-menu-addgroup">
			<el-button icon="iconfont gd-iconsave" @click="reset"></el-button>
		</el-button-group> -->
		<el-button-group class="main-menu-addgroup">
			<el-button icon="iconfont gd-iconsave" @click="save" :disabled="saveBtnDisable"></el-button>
			<el-button icon="iconfont gd-iconcontentsaveall" @click="saveAll" :disabled="saveAllBtnDisable"></el-button>
			<el-button icon="iconfont gd-iconpublish" @click="publish" :disabled="publishBtnDisable"></el-button>
		</el-button-group>
		<!-- 添加场景、模型 -->
		<el-button-group class="main-menu-addgroup">
			<el-button icon="iconfont gd-iconeditor-preview" @click="addScence" :disabled="configed"></el-button>
			<el-button icon="iconfont gd-iconreview-spell" @click="addModle" :disabled="configed"></el-button>
		</el-button-group>
		<add-scene v-if="showAddScene"></add-scene>
	</div>
</template>

<script>
	import $ from 'Jquery'
	import Bus from '../Bus.js'
	import AddScene from '../Dialog/AddScene'

	export default {
		name: "top",
		data() {
			return {
				showAddScene: false,
				configed: false,
				saveBtnDisable: true,
				saveAllBtnDisable: true,
				publishBtnDisable: true,
			}
		},
		components: {
			AddScene
		},
		mounted() {
			Bus.$on('current-tab-saved', content => {
				console.log('content',content)
				if(!$.isEmptyObject(content)){
					this.saveBtnDisable = content.saved
				}else{
					this.saveBtnDisable =true
				}
				
			})
		},
		methods: {
			save() {
				
			},
			saveAll() {

			},
			publish() {

			},
			addScence() {
				this.configed = true
				this.showAddScene = true
			},
			addModle() {

			}
		},
	}
</script>

<style>
	.main-menu-addgroup {
		margin: 0px 40px;
	}

	.main-menu-panel .el-button {
		padding: 3px 14px;
	}
</style>
