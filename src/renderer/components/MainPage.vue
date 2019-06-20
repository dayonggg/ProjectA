<template>
	<el-container class="main-page" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="加载中"
	 element-loading-background="rgba(0, 0, 0, 0.5)">
		<el-header height="30px">
			<top></top>
		</el-header>
		<el-container>
			<el-aside class="main-left" width="240px">
				<el-container>
					<el-header height="25px" class="main-left-ctrl">
						<i class="el-icon-arrow-left" @click="showLeft"></i>
					</el-header>
					<el-container>
						<!-- 文件列表 -->
						<f-tree class="f-tree"></f-tree>
					</el-container>
					<el-footer height="35px">
						<i class="el-icon-setting" ></i>
					</el-footer>
				</el-container>
			</el-aside>
			<el-main>
				<tabs-page ref="tabspage"></tabs-page>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import $ from 'Jquery'
	import D from './Common/data.js'
	import Bus from './Bus.js'
	import FTree from './FTree/FTree'
	import TabsPage from './Tabs/TabsPage'
	import Top from './Top/Top'
	
	export default {
		name: "main-page",
		data() {
			return {
				fullscreenLoading:true,
				treeVisible:true
			}
		},
		components: {
			FTree,
			TabsPage,
			Top
		},
		mounted() {
			D.init()
			Bus.$on('initDone',content=>{
				if(content){
					this.fullscreenLoading = false
				}else{
					console.error('加载失败文件列表失败')
				}
			})
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
