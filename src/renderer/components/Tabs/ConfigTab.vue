<template>
	<div>
		<el-divider content-position="left">工作空间</el-divider>
		<el-form label-width="80px" size="mini">
			<el-form-item label="表格目录">
				<el-input v-model="tableDir"></el-input>
			</el-form-item>
			<el-form-item label="资源目录">
				<el-input v-model="resDir"></el-input>
			</el-form-item>
		</el-form>
		<el-divider content-position="left">预设</el-divider>
		<el-form label-width="80px" size="mini">
			<el-form-item class="model-groups" label="模型分组">
				<el-tag :key="group" v-for="group in modelGroups" closable :disable-transitions="false" @close="tagClose(group)">
					{{group}}
				</el-tag>
				<el-input class="input-new-tag" v-if="tagInputVisible" v-model="groupInputValue" ref="saveGroupInput" size="small"
				 @keyup.enter.native="addGroup" @blur="addGroup">
				</el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showGroupInput"> + </el-button>
			</el-form-item>
		</el-form>
		<el-divider content-position="left">表格设定</el-divider>
		<el-form size="mini">
			<el-form-item>
				<el-table :data="tables" height="300" border style="width: 100%">
					<el-table-column type="expand" width="40">
						<template slot-scope="props">
							<el-form label-position="right" inline class="demo-table-expand">
								<el-form-item label="前端导出忽略" v-if="props.row.byClient">
									<ignore-select :itype="!ignoreForServer" :tablename="props.row.label" :selected="props.row.clientIgnore"></ignore-select>
								</el-form-item>
								<el-form-item label="后端导出忽略" v-if="props.row.byServer">
									<ignore-select :itype="ignoreForServer" :tablename="props.row.label" :selected="props.row.serverIgnore"></ignore-select>
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column prop="label" label="表名">
					</el-table-column>
					<el-table-column prop="byClient" label="客户端" width="70">
						<template slot-scope="scope">
							<el-switch :width="25" v-model="scope.row.byClient">
							</el-switch>
						</template>
					</el-table-column>
					<el-table-column prop="byServer" label="服务器" width="70">
						<template slot-scope="scope">
							<el-switch :width="25" v-model="scope.row.byServer">
							</el-switch>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="disabled" label="是否可见" width="80">
						<template slot-scope="scope">
							<el-switch :width="25" v-model="!scope.row.disabled">
							</el-switch>
						</template>
					</el-table-column> -->
				</el-table>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import Bus from '../Bus'
	import IgnoreSelect from './IgnoreSelect'

	export default {
		name: "config-tab",
		data() {
			return {
				config: JSON.parse(localStorage.getItem('config')),

				tableDir: localStorage.getItem('tableDir'),
				resDir: localStorage.getItem('resDir'),
				modelGroups: [],
				tables: table.tableTree,
				tagInputVisible: false,
				groupInputValue: '',
				ignoreForServer: true,
				saved: true
			}
		},
		components: {
			IgnoreSelect
		},
		props: {
			cfg: Object
		},
		mounted() {
			console.log(this.cfg)
			this.modelGroups = this.config.content.treeData[1].lhDir
			Bus.$on('updataIgnore', content => {
				let t = this.tables
				for (let i = 0; i < t.length; i++) {
					if (t[i].label == content.tablename) {
						if (content.type) {
							t[i].serverIgnore = content.ignore
						} else {
							t[i].clientIgnore = content.ignore
						}
					}
				}
			})

		},
		methods: {
			tagClose(group) {
				this.$confirm('确定要删除 ' + group + ' 分组吗？')
					.then(_ => {
						this.modelGroups.splice(this.modelGroups.indexOf(group), 1)
					})
					.catch(_ => {})
			},
			showGroupInput() {
				this.tagInputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveGroupInput.$refs.input.focus()
				})
			},
			addGroup() {
				let groupInputValue = this.groupInputValue
				if (groupInputValue) {
					this.modelGroups.push(groupInputValue)
				}
				this.tagInputVisible = false
				this.groupInputValue = ''
			},
			save() {
				localStorage.setItem('tableDir', this.tableDir)
				localStorage.setItem('resDir', this.resDir)
				table.save()
				this.saved = true
			}
		},
		watch: {
			config: {
				handler() {
					this.saved = false
				},
				deep: true
			},
			tables: {
				handler() {
					this.saved = false
				},
				deep: true
			},
			tableDir: {
				handler() {
					this.saved = false
				}
			},
			resDir: {
				handler() {
					this.saved = false
				}
			},
			saved: {
				handler() {
					let self = this
					Bus.$emit('page-state', {
						label: '设置',
						saved: self.saved
					})
				}
			}
		}
	}
</script>

<style>
	.el-divider__text,
	.el-link {
		font-size: 15px !important;
		font-weight: 600 !important;
	}

	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px !important;
		margin-left: 10px;
		vertical-align: bottom;
	}

	.el-table td,
	.el-table th {
		padding: 4px 0px !important;
	}

	.el-table .el-switch__core {
		height: 15px;
	}

	.el-switch.is-checked .el-switch__core::after {
		margin-left: -12px !important;
	}

	.el-switch__core:after {
		width: 11px !important;
		height: 11px !important;
	}

	.demo-table-expand {
		padding: 5px 10px 5px 10px;
		margin-left: 18px;
		border-left: 1px #409EFF dotted;
	}

	.demo-table-expand label {
		width: 100px;
		color: #409EFF;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
</style>
