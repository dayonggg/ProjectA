<template>
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
</template>

<script>
	import Bus from './Bus'

	export default {
		name: "tool-menu",
		data() {
			return {
				
				}
			}
		},
		props: ['stat'],
		mounted() {
			
		},
		methods: {
			save(){
				
			},
			saveAll(){
				
			},
			publish(){
				
			},
			publishAll(){
				
			},
			openAddScene(){
				
			},
			openAddModel(){
				
			}
		}
	}
</script>

<style>
	.main-menu-addgroup {
		margin: 0px 40px;
	}
</style>
