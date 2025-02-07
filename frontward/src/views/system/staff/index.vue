<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="staffName">
        <el-input
          v-model="queryParams.staffName"
          placeholder="请输入员工姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="staffSex">
        <el-select
          v-model="queryParams.staffSex"
          placeholder="请选择"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="sex in sexes"
            :key="sex.index"
            :label="sex.label"
            :value="sex.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间" prop="startTime">
        <el-date-picker
          v-model="startTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="Start date"
          end-placeholder="End date"
          size="default"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:staff:add']"
        >新增员工</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:staff:remove']"
        >批量删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="staffList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="staffName" />
      <el-table-column label="图像" align="center" prop="staffImg" >
        <template slot-scope="scope">
          <img src="@/assets/images/profile.jpg" alt="Staff Image" style="max-width: 50px; max-height: 50px;">
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="staffSex" />
      <el-table-column label="职位" width="150" align="center" prop="staffPost" />
      <el-table-column label="入职日期" align="center" prop="startTime"/>
      <el-table-column label="最后操作时间" width="100" align="center" prop="lastTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:staff:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:staff:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="stuName">
          <el-input v-model="form.staffName" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="stuSex">
          <el-select
            v-model="form.staffSex"
            placeholder="请选择"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="sex in sexes"
              :key="sex.index"
              :label="sex.label"
              :value="sex.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon avatar-uploader-icon el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="职位" prop="staffPost">
          <el-select
            v-model="form.staffPost"
            placeholder="请选择"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="post in posts"
              :key="post"
              :label="post"
              :value="post"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
            size="default"
          />
        </el-form-item>
        <el-form-item label="归属部门" prop="depId">
          <el-select
            v-model="form.depId"
            placeholder="请选择"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="dep in depList"
              :key="dep.depId"
              :label="dep.depName"
              :value="dep.depId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStaff, getStaff, delStaff, addStaff, updateStaff } from "@/api/system/staff";
import {listDep} from "@/api/system/dep";
// import { Plus } from '@element-plus/icons-vue'
import { Message } from 'element-ui'
import {addUser, getUser, listUser, updateUser} from "@/api/system/user";
export default {
  name: "Staff",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      imageUrl: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      register_form: {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      },
      register_form2: {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      },
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      staffList: [],
      depList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      op: false,
      posts: [
        '班主任',
        '讲师',
        '教务员'
      ],
      sexes: [
        { index: "1",label: "男"},
        { index: "2",label: "女"}
      ],
      startTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staffName: undefined,
        staffSex: undefined,
        sTime: undefined,
        eTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        staffName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDepList();
    this.getConfigKey("sys.user.initPassword").then(response => {
      this.register_form.password = response.msg;
    });
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      if(this.startTime != []){
        this.queryParams.sTime = this.startTime[0];
        this.queryParams.eTime = this.startTime[1];
      }
      console.log(this.queryParams)
      listStaff(this.queryParams).then(response => {
        this.staffList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getDepList(){
      this.loading = true;
      listDep().then(response => {
        this.depList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    getClassName(id) {
      console.log(id===2)
      const cl = this.classList.find(item => item.classId === id);
      // console.log(cl.classId)
      return cl ? cl.className : '';
    },
    getSexName(index) {
      const sex = this.sexes.find(item => item.index === index);
      return sex ? sex.label : '';
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        staffId: undefined,
        staffName: undefined,
        staffImg: undefined,
        staffSex: "1",
        staffPost: undefined,
        startTime: undefined,
        depId: undefined,
        lastTime: undefined,
        userName: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.staffId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增员工";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const staffId = row.staffId || this.ids
      getStaff(staffId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改员工";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {

          const currentDate = new Date();
          const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
          console.log(formattedDate);
          this.form.lastTime = formattedDate;

          if (this.form.staffId != undefined) {
            updateStaff(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            getUser().then(response => {
              this.register_form.roleIds = [2];
            });
            this.register_form.userName = this.form.userName
            this.register_form.nickName = this.form.userName
            console.log("111",this.register_form)
            addStaff(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
            addUser(this.register_form).then(res => {
              this.$modal.msgSuccess("用户注册成功");

              listUser().then(res => {
                const length = res.rows.length;
                this.register_form.userId = res.rows[length - 1].userId
                console.log("11111")
              })
              // 使用setTimeout函数实现2秒延迟
              setTimeout(() => {
                console.log(22222)
                this.register_form.password = ""
                updateUser(this.register_form).then(response => {
                  console.log(response);
                  console.log(123);
                }).catch(error => {
                  // 处理updateUser可能遇到的错误
                  console.error('更新用户信息时出错:', error);
                });
              }, 2000); // 2000毫秒等于2秒
            });
            // addUser(this.register_form).then(res => {
            //   this.$modal.msgSuccess("用户注册成功");
            // })
            // console.log(1111111)
            // updateUser(this.register_form).then(response => {
            //   console.log(response)
            //   console.log(123)
            // });

          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const staffIds = row.staffId || this.ids;
      this.$modal.confirm('您确定要删除该员工的信息吗？').then(function() {
        return delStaff(staffIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleAvatarSuccess(response, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('Avatar picture must be JPG format!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('Avatar picture size can not exceed 2MB!');
        return false;
      }
      return true;
    }

  }
  // components: {
  //   Plus
  // }
};
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: .3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #c0c4cc;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}
</style>
