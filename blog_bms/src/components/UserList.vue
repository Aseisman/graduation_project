<template>
  <div v-loading="loading">
    <!-- 搜索框+注册 -->
    <div style="margin-top: 20px;width:100%;">
      <!-- <input
        type="text"
        placeholder="输入用户姓名、身份证进行查找"
        style="width: 30%;background: rgb(238, 240, 244);height: 34px;border-radius: 6px;margin-left: 3%;padding-left: 10px;"
      />-->
      <el-select
        v-model="option"
        placeholder="请选择"
        style="position: relative;right: -930px;"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- <el-button
        type="primary"
        icon="el-icon-connection"
        style="width: 110px;height: 34px;padding: 0px;background-color: rgb(48, 208, 172);border-color: rgb(48, 208, 172);line-height: 34px;position: relative;right: -792px;}"
        @click="publishQuestion"
      ></el-button> -->
    </div>
    <!-- table -->
    <div
      style="width: 95%;margin-left: 2.5%;margin-top: 30px;border-top: 1px solid #EBEEF5;"
    >
      <el-table
        :data="userList"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        style="width: 100%"
        id="userTable"
      >
        <el-table-column
          prop="user_name"
          label="用户名"
          width="400"
        ></el-table-column>
        <el-table-column
          prop="user_email"
          label="邮箱"
          width="200"
          sortable
        ></el-table-column>
        <el-table-column
          prop="user_phone"
          label="手机"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="user_sex"
          label="性别"
          width="200"
          :formatter="
            (row, column, cellValue, index) => {
              return cellValue == 0 ? '男' : '女';
            }
          "
        ></el-table-column>
        <el-table-column label="状态" prop="article_status">
          <template slot-scope="scope">
            <el-tag :type="['', 'danger'][scope.row.is_allow]">{{
              ["正常", "禁用"][scope.row.is_allow]
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.is_allow == 1"
              type="text"
              size="small"
              style="font-size: 15px;"
              @click="recover(scope)"
              >恢复</el-button
            >
            <el-button
              v-if="scope.row.is_allow == 0"
              type="text"
              size="small"
              style="color:#da4343; font-size: 15px;"
              @click="del(scope)"
              >禁用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        :page-size="6"
        :current-page="1"
        @current-change="pageChange"
        style="text-align: right;margin-right: 75px;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      requestData: {
        pageNum: 0,
        pageSize: 6,
      },
      userList: [],
      count: 0,
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "0",
          label: "正常",
        },
        {
          value: "1",
          label: "禁用",
        },
      ],
      currentPage: 1,
      option: "全部",
    };
  },
  mounted() {
    this.loading = true;
    this.$axios.userList(this.requestData).then((res) => {
      if (res.code == 200) {
        this.userList = res.data.list;
        this.count = res.data.count;
      }
      this.loading = false;
    });
  },

  methods: {
    updateList() {
      this.loading = true;
      this.$axios.userList(this.requestData).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.list;
          this.count = res.data.count;
        }
        this.loading = false;
      });
    },
    pageChange(e) {
      this.requestData.pageNum = e - 1;
      this.$axios.userList(this.requestData).then((res) => {
        if (res.code == 200) {
          this.list = res.data.list;
          this.count = res.data.count;
          this.currentPage = e;
        }
        this.loading = false;
      });
    },
    del(e) {
      var that = this;
      this.$confirm("此操作将禁用该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // console.log(e);
        var d = {
          user_id: e.row.user_id,
          status: 1,
        };
        that.$axios.userDelete(d).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "禁用成功!",
            });
            this.updateList();
          }
        });
      });
    },
    recover(e) {
      var that = this;
      this.$confirm("此操作将恢复该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // console.log(e);
        var d = {
          user_id: e.row.user_id,
          status: 0,
        };
        that.$axios.userDelete(d).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "恢复成功!",
            });
            this.updateList();
          }
        });
      });
    },
  },
  watch: {
    option: function() {
      this.requestData.status = this.option;
      this.requestData.pageNum = 0;
      this.$axios.userList(this.requestData).then((res) => {
        if (res.code == 200) {
          this.userList = res.data.list;
          this.count = res.data.count;
          this.currentPage = 1;
        }
      });
    },
  },
};
</script>

<style scoped></style>
