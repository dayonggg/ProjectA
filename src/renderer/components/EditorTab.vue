<template>
	<editor ref='editor' v-model="code" @init="editorInit" lang="json" theme="xcode" :width="width" :height="height"></editor>
</template>

<script>
	import Bus from './Bus'
	import fs from 'fs'
	import path from 'path'
	import $ from 'Jquery'

	export default {
		name: "editor-tab",
		data() {
			return {
				editor: {},
				code: '',
				width: '600',
				height: '400',
				filePath: '',
			}
		},
		props: {
			json: Object
		},
		components: {
			editor: require('vue2-ace-editor'),
		},
		mounted() {
			this.editor = this.$refs.editor.editor
			this.editor.setShowPrintMargin(false)
			this.updateSize()
			Bus.$on('resize', content => {
				this.updateSize()
			})
			this.filePath = path.join(localStorage.getItem('resDir'), this.json.path,this.json.label)
			fs.exists(this.filePath, e => {
				if (e) {
					this.code = JSON.stringify(JSON.parse(fs.readFileSync(this.filePath).toString()),null, "\t")	
				}
				if (!e) {
					console.log('no')
				}
			})
		},
		methods: {
			editorInit: function() {
				require('brace/ext/language_tools') //language extension prerequsite...
				require('brace/mode/json') //language
				require('brace/snippets/json') //snippet
				require('brace/theme/xcode')
			},
			updateSize() {
				this.$set(this.$data, 'width', $(this.$el).parent().width())
				this.$set(this.$data, 'height', $(this.$el).parent().height())
			}
		}
	}
</script>

<style>
</style>
