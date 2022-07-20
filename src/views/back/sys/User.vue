<template>
  <div style="opacity: 0.9">
    <el-form :inline="true">
      <el-form-item>
        <el-input
            v-model="searchForm.username"
            placeholder="用户名"
            clearable
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getUserList">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true" v-if="hasAuth('sys:user:save')">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatus" v-if="hasAuth('sys:user:delete')">批量删除</el-button>
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
          label="头像"
          align="center"
          width="50">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
          align="center"
          width="120">
      </el-table-column>
      <el-table-column
          prop="role"
          align="center"
          label="角色名称">
        <template slot-scope="scope">
          <el-tag size="small" type="info" v-for="item in scope.row.sysRoles">{{item.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="phone"
          align="center"
          label="手机号">
      </el-table-column>
      <el-table-column
          prop="creditValue"
          align="center"
          label="信用值">
      </el-table-column>
      <el-table-column
          prop="status"
          align="center"
          label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="created"
          align="center"
          width="200"
          label="创建时间"
      >
      </el-table-column>
      <el-table-column
          prop="icon"
          width="250px"
          label="操作">

        <template slot-scope="scope">
          <el-button type="text" @click="roleHandle(scope.row.id)">分配角色</el-button>
          <el-divider direction="vertical"></el-divider>

          <el-button type="text" @click="repassHandle(scope.row.id, scope.row.username)">重置密码</el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5,10]"
        :current-page="current"
        :page-size="size"
        :total="total">
    </el-pagination>

    <!--新增对话框-->
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="600px"
        append-to-body
        :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm">
        <el-form-item class="avatar_item" label="头像" prop="avatar" style="width: 380px;">
          <Upload @getUrl="setUrl" class="avatar">
            <el-button slot="uploadBtn" type="primary" class="upload_btn">上传头像</el-button>
            <div slot="uploadBtn" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </Upload>
        </el-form-item>
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
          <el-alert
              title="初始密码为111111"
              :closable="false"
              type="info"
              style="line-height: 12px;"
          ></el-alert>
        </el-form-item>
        
        <el-form-item label="手机号"  prop="phone" label-width="100px">
          <el-input v-model="editForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="信用值"  prop="creditValue" label-width="100px">
          <el-input v-model="editForm.creditValue" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态"  prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reSetEditForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px" append-to-body>

      <el-form :model="roleForm" ref="roleForm">
        <el-tree
            :data="roleTreeData"
            show-checkbox
            ref="roleTree"
            :check-strictly=true
            node-key="id"
            :default-expand-all=true
            :props="defaultProps">
        </el-tree>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="submitRoleHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from "@/components/upload";
export default {
  name: "User",
  components:{Upload},
  data(){
    return{
      searchForm:{},
      dialogVisible:false,
      delBtlStatus:true,
      tableData:[],
      roleDialogFormVisible:false,
      roleForm:{},
      current:1,
      size:4,
      total:0,
      editForm:{},
      editFormRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机哈奥', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
      roleTreeData:  [],
      treeCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
    }
  },
  created() {
    this.getUserList();
    this.$axios.get("/sys/role/list").then(res => {
      this.roleTreeData = res.data.data.records
    })
  },
  methods:{
    getUserList() {
      this.$axios.get("/sys/user/list", {
        params: {          
          username: this.searchForm.username,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.records
        console.log("getUserList->res.data.data.records",res.data.data.records)
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogVisible = false
      this.editForm = {}
    },
    reSetEditForm(){
      this.$refs.editForm.resetFields()
      this.dialogVisible = false
      this.editForm = {}
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
      console.log("user.vuw->delHandle",ids)
      this.$axios.post("/sys/user/delete", ids).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose:() => {
            this.getUserList()
          }
        });
      })
    },
    handleSelectionChange(val) {
      console.log("handleSelectionChange->勾选")
      console.log(val)
      this.multipleSelection = val;

      this.delBtlStatus = val.length === 0;
    },
    roleHandle(id) {
      this.$axios.get("/sys/user/info/" + id).then(res => {
        const sysuser = res.data.data
        var roleIds = []
        sysuser.sysRoles.forEach(row => {
          roleIds.push(row.id)
        })
        console.log("roleIds")
        console.log(roleIds)
        this.roleForm = res.data.data
        console.log("this.treeCheckedKeys")
        console.log(this.treeCheckedKeys)
        this.$axios.get("/sys/role/list").then(res => {
          this.roleTreeData = res.data.data.records
          this.$refs.roleTree.setCheckedKeys(roleIds);
        })
      })
      this.roleDialogFormVisible = true
    },
    repassHandle(id, username) {

      this.$confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post("/sys/user/repass", id).then(res => {
          this.$message({
            showClose: true,
            message: '恭喜你，操作成功',
            type: 'success',
            onClose: () => {
            }
          });
        })
      })
    },
    editHandle(id) {
      this.$axios.get('/sys/user/info/' + id).then(res => {
        console.log("editHandle->/sys/user/info/->editForm",res.data.data)
        this.editForm = res.data.data
        this.dialogVisible = true
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getUserList()
    },
    handleClose() {
      this.$refs.editForm.resetFields();
      this.dialogVisible = false
      this.editForm = {}
    },
    submitForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/user/' + (this.editForm.id?'update' : 'save'), this.editForm)
              .then(res => {
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose:() => {
                    this.getUserList()
                  }
                });
                this.$refs.editForm.resetFields();
                this.dialogVisible = false
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitRoleHandle() {
      let roleIds = this.$refs.roleTree.getCheckedKeys()

      console.log("submitRoleHandle->roleId",roleIds)
      console.log("/sys/user/role/->userID",this.roleForm.id)

      this.$axios.post('/sys/user/role/' + this.roleForm.id, roleIds).then(res => {
        this.$message({
          showClose: true,
          message: '恭喜你，操作成功',
          type: 'success',
          onClose:() => {
            this.getUserList()
          }
        });
        this.roleDialogFormVisible = false
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    setUrl(url){
      console.log("url",url);
      this.editForm.avatar = url
    },
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 20px;
}

.avatar_item{
  position: relative;
  margin-left: 60px;
}

</style>