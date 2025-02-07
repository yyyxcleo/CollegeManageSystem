<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学员姓名" prop="stuName">
        <el-input
          v-model="queryParams.stuName"
          placeholder="请输入学员姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学号" prop="stuCode">
        <el-input
          v-model="queryParams.stuCode"
          placeholder="请输入学号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最高学历" prop="stuEdu">
        <el-select
          v-model="queryParams.stuEdu"
          placeholder="请选择"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="edu in edus"
            :key="edu"
            :label="edu"
            :value="edu"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级" prop="stuClass">
        <el-select
          v-model="queryParams.stuClass"
          placeholder="请选择"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="cl in classList"
            :key="cl.classId"
            :label="cl.className"
            :value="cl.classId"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="岗位名称" prop="postName">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.postName"-->
      <!--          placeholder="请输入岗位名称"-->
      <!--          clearable-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="状态" prop="status">-->
      <!--        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable>-->
      <!--          <el-option-->
      <!--            v-for="dict in dict.type.sys_normal_disable"-->
      <!--            :key="dict.value"-->
      <!--            :label="dict.label"-->
      <!--            :value="dict.value"-->
      <!--          />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
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
          v-hasPermi="['system:stu:add']"
        >添加学员</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:stu:remove']"
        >批量删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" >
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="stuName" />
      <el-table-column label="学号" align="center" prop="stuCode" />
      <el-table-column label="班级" width="150" align="center" prop="stuClass" >
        <template slot-scope="scope">
          {{ getClassName(scope.row.stuClass) }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="stuSex" >
        <template slot-scope="scope">
          {{ getSexName(scope.row.stuSex) }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="stuTel"/>
      <el-table-column label="最高学历" align="center" prop="stuEdu" />
      <el-table-column label="违纪次数" align="center" prop="stuNum" />
      <el-table-column label="违纪扣分" align="center" prop="stuScore" />
      <el-table-column label="最后操作时间" width="100" align="center" prop="lastTime"/>
      <!--      <el-table-column label="创建时间" align="center" prop="createTime" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.createTime) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:stu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-warning"
            @click="handleMistake(scope.row)"
            v-hasPermi="['system:stu:edit']"
          >违纪</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:stu:remove']"
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
        <el-form-item label="姓名" prop="stuName">
          <el-input v-model="form.stuName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="学号" prop="stuCode">
          <el-input v-model="form.stuCode" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="性别" prop="stuSex">
          <el-select
            v-model="form.stuEdu"
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
        <el-form-item label="手机号" prop="stuTel">
          <el-input v-model="form.stuTel" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="最高学历" prop="stuEdu">
          <el-select
            v-model="form.stuEdu"
            placeholder="请选择"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="edu in edus"
              :key="edu"
              :label="edu"
              :value="edu"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级" prop="stuClass">
          <el-select
            v-model="form.stuClass"
            placeholder="请选择"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="cl in classList"
              :key="cl.classId"
              :label="cl.className"
              :value="cl.classId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="op" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="违纪扣分" prop="perScore">
          <el-input v-model="form.perScore" />
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
import { listStu, getStu, delStu, addStu, updateStu } from "@/api/system/stu";
import {listClass} from "@/api/system/class";

export default {
  name: "Stu",
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
      stuList: [],
      classList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      op: false,
      edus: [
        '初中',
        '高中',
        '大专',
        '本科',
        '硕士',
        '博士'
      ],
      sexes: [
        { index: "1",label: "男"},
        { index: "2",label: "女"}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        stuName: undefined,
        stuCode: undefined,
        stuEdu: undefined,
        stuClass: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stuName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        stuCode: [
          { required: true, message: "学号不能为空", trigger: "blur" }
        ],
        // stuSex: [
        //   { required: true, message: "性别不能为空", trigger: "blur" }
        // ],
        stuTel: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        stuClass: [
          { required: true, message: "所属班级不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getClassList();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listStu(this.queryParams).then(response => {
        this.stuList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getClassList(){
      this.loading = true;
      listClass().then(response => {
        console.log(response)
        this.classList = response.rows;
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
        stuId: undefined,
        stuName: undefined,
        stuCode: undefined,
        stuSex: "1",
        stuTel: undefined,
        stuEdu: undefined,
        stuClass: undefined,
        lastTime: undefined,
        stuNum: undefined,
        stuScore: undefined,
        perScore: undefined
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
      this.ids = selection.map(item => item.stuId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学生";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const stuId = row.stuId || this.ids
      getStu(stuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生";
      });
    },
    handleMistake(row) {
      this.reset();
      const stuId = row.stuId || this.ids
      getStu(stuId).then(response => {
        this.form = response.data;
        this.op = true;
        this.title = "学生违纪处理";
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

          if (this.form.stuId != undefined && this.form.perScore == undefined) {
            updateStu(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else if(this.form.perScore == undefined) {
            addStu(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          } else {
            // 将字符串转换为整数并相加
            this.form.stuScore = parseInt(this.form.stuScore) + parseInt(this.form.perScore);
            this.form.stuNum += 1;
            updateStu(this.form).then(response => {
              this.$modal.msgSuccess("处理成功");
              this.op = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const stuIds = row.stuId || this.ids;
      this.$modal.confirm('您确定要删除该学员的信息吗？').then(function() {
        return delStu(stuIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

  }
};
</script>
