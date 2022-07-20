<template>
  <div style="opacity: 0.9">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getRoleList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtnStatus">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          align="center"
          width="55">
      </el-table-column>
      <el-table-column
          prop="name"
          label="姓名"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="code"
          align="center"
          label="唯一编码"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="remark"
          align="center"
          label="描述"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="status"
          align="center"
          label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status===1" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.status===0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[5, 10]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="600px"
        append-to-body
        :before-close="handleClose"
        >
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="角色名称" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="唯一编码" prop="code" label-width="100px">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label=0>禁用</el-radio>
            <el-radio :label=1>正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog
        title="分配权限"
        :visible.sync="permDialogVisible"
        append-to-body
        width="600px">
      <el-form :model="permForm" ref="permForm">
        <el-tree
            :data="permTreeData"
            show-checkbox
            ref="permTree"
            :default-expand-all=true
            node-key="id"
            :check-strictly=true
            :props="defaultProps">
        </el-tree>
      </el-form>

      <span slot="footer" class="dialog-footer">
			    <el-button @click="permDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="submitPermFormHandle">确 定</el-button>
			</span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      searchForm: {},
      delBtnStatus: true,
      tableData: [],
      multipleSelection: [],
      total: 0,
      size: 5,
      current: 1,
      dialogVisible: false,
      permDialogVisible:false,
      editForm: {},
      editFormRules: {
        name: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入唯一编码', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
      permTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permForm:{}
    }
  },
  created() {
    this.getRoleList()
    this.$axios.get('/sys/menu/list').then(res=>{
      this.permTreeData = res.data.data;
    })
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.delBtnStatus = val.length===0;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.getRoleList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getRoleList();
    },
    resetForm() {
      this.$refs.editForm.resetFields();
      this.editForm = {}
    },
    handleClose(){
      this.$refs.editForm.resetFields();
      this.editForm = {}
      this.dialogVisible = false;
    },
    getRoleList() {
      this.$axios.get("/sys/role/list", {
        params: {
          name: this.searchForm.name,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        console.log("/sys/role/list->",res.data)
        this.tableData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    submitForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm)
              .then(res => {
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose: () => {
                    this.getRoleList()
                  }
                });

                this.dialogVisible = false
                this.$refs.editForm.resetFields();
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    editHandle(id) {
      this.$axios.get('/sys/role/info/' + id).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    delHandle(id) {
      let ids = []
      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
        })
      }
      this.$axios.post("/sys/role/delete", ids).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        });
      })
    },
    permHandle(id) {
      this.permDialogVisible = true
      this.$axios.get("/sys/role/info/" + id).then(res => {
        console.log("permHandle->/sys/role/info/",res.data.data)
        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
        this.permForm = res.data.data
      })
    },
    submitPermFormHandle() {
      let menuIds = this.$refs.permTree.getCheckedKeys()
      console.log(menuIds)
      this.$axios.post('/sys/role/perm/' + this.permForm.id, menuIds).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        });
        this.$refs.permForm.resetFields();
        this.permDialogVisible = false
      })
    }
  },
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 20px;
}
</style>