<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入课程名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程编码" prop="courseCode">
        <el-input
          v-model="queryParams.courseCode"
          placeholder="请输入课程编码"
          clearable
          @keyup.enter.native="handleQuery"
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
          v-hasPermi="['system:course:add']"
        >添加课程</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:course:remove']"
        >批量删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="courseName" />
      <el-table-column label="编码" align="center" prop="courseCode" />
      <el-table-column label="开课时间" align="center" prop="startTime"/>
      <el-table-column label="课程学时" align="center" prop="totalTime" />
      <el-table-column label="教室" align="center" prop="classRoom" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:course:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:course:remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="courseName">
              <el-input v-model="form.courseName" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程编码" prop="courseCode">
              <el-input v-model="form.courseCode" placeholder="请输入编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">

            <el-form-item label="教室" prop="classRoom">
              <el-input v-model="form.classRoom" placeholder="请输入教室" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学时" prop="tatalTime">
              <el-input v-model="form.totalTime" placeholder="请输入学时" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="开课时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请输入开课时间"
              size="default"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="员工列表">
              <el-table v-loading="loading" :data="staffList" @selection-change="handleSelectionChange">
                <el-table-column label="姓名" align="center" prop="staffName" />
                <el-table-column label="职位" align="center" prop="staffPost" />
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-check"
                      @click="addTeacher(scope.row.staffName)"
                    >选择</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已选列表">
              <ul>
                <li v-for="(selectedItem, index) in selectedList" :key="index">
                  {{ selectedItem }}
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-semi-select"
                    @click="deleteTeacher(selectedItem)"
                    v-hasPermi="['system:course:edit']"
                  >移除</el-button>
                </li>
              </ul>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCourse, getCourse, delCourse, addCourse, updateCourse } from "@/api/system/course";
import {listStaff} from "@/api/system/staff";

export default {
  name: "Course",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      courseList: [],
      staffList:[],
      selectedList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      op: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        courseName: undefined,
        courseCode: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        courseName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        courseCode: [
          { required: true, message: "编码不能为空", trigger: "blur" }
        ],
        classRoom: [
          { required: true, message: "教室不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getCourseList();
    this.getStaffList();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listCourse(this.queryParams).then(response => {
        this.courseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getCourseList(){
      this.loading = true;
      listCourse().then(response => {
        this.courseList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    getStaffList() {
      listStaff().then(response => {
        this.staffList = response.rows;
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        courseId: undefined,
        courseName: undefined,
        courseCode: undefined,
        classRoom: undefined,
        startTime: undefined,
        totalTime: undefined,
        teacherList: undefined
      };
      this.selectedList = [];
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
    addTeacher(name) {
      const st = this.selectedList.find(item => item === name);
      if(st == null) {
        this.selectedList.push(name);
      }else {
        this.$modal.msgWarning("该教师已被选择");
      }
    },
    deleteTeacher(name) {
      this.selectedList = this.selectedList.filter(item => item !== name);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.courseId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加课程";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const courseId = row.courseId || this.ids
      getCourse(courseId).then(response => {
        this.form = response.data;
        console.log(this.form.teacherList)
        this.selectedList = JSON.parse(this.form.teacherList);
        // this.selectedList = this.form.teacherList.split(',')
        this.open = true;
        this.title = "修改课程";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.teacherList = JSON.stringify(this.selectedList);
          if (this.form.courseId != undefined) {
            console.log(this.form.teacherList)
            updateCourse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCourse(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const courseIds = row.courseId || this.ids;
      this.$modal.confirm('您确定要删除该课程的信息吗？').then(function() {
        return delCourse(courseIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

  }
};
</script>
