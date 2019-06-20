<template>
	<editor ref='editor' v-model="code" @init="editorInit" lang="json" theme="xcode" :width="width" :height="height"></editor>
</template>

<script>
	import Bus from '../Bus'
	import fs from 'fs'
	import $ from 'Jquery'
	import D from '../Common/data.js'

	export default {
		name: "editor-tab",
		data() {
			return {
				editor: {},
				code: '',
				fcode: '',
				width: '600',
				height: '400',
				saved: true
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
			fs.readFile(this.json.file, (err, data) => {
				if (err) {
					this.$message.error('未找到该文件')
				} else {
					this.code = data.toString()
					this.fcode = data.toString()
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
		},
		watch: {
			code: {
				handler(nv) {
					if (nv != this.fcode) {
						this.saved = false
					}
				}
			},
			saved: {
				handler() {
					Bus.$emit('page-state', {
						label: this.$el.id,
						saved: this.saved
					})
				}
			}
		}
	}
</script>

<style>
</style>
