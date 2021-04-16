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
        :data="list"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        style="width: 100%"
        id="userTable"
      >
        <el-table-column
          prop="article_title"
          label="标题"
          width="400"
        ></el-table-column>
        <el-table-column
          prop="article_date"
          label="时间"
          width="200"
          sortable
          :formatter="
            (row, column, cellValue, index) => timestampToTime(cellValue)
          "
        ></el-table-column>
        <el-table-column
          prop="user.user_name"
          label="作者"
          width="200"
        ></el-table-column>
        <el-table-column label="状态" prop="article_status">
          <template slot-scope="scope">
            <!-- <el-select v-model="scope.row.Status" placeholder="请选择" @change="changeStatus(scope)">
              <el-option value="受理中"></el-option>
              <el-option value="已完成"></el-option>
              <el-option value="待受理"></el-option>
            </el-select> -->
            <el-tag
              :type="
                ['', 'success', 'danger', 'warning'][scope.row.article_status]
              "
              >{{
                ["未发表", "已发表", "已删除", "未审核"][
                  scope.row.article_status
                ]
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="font-size: 15px;"
              @click="answer(scope)"
              >{{
                scope.row.article_status == 1||scope.row.article_status == 2 ? "查看详情" :"审核文章"
              }}</el-button
            >
            <el-button
              v-if="scope.row.article_status !== 2"
              type="text"
              size="small"
              style="color:#da4343; font-size: 15px;"
              @click="del(scope)"
              >删除文章</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" prop="Status">
          <template slot-scope="scope">
            <el-button type="text" size="small" style="font-size: 15px;" @click="del(scope)">删除文章</el-button>
          </template>
        </el-table-column> -->
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
      requestData: {
        pageNum: 0,
        pageSize: 6,
      },
      list: [],
      count: 0,
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "3",
          label: "未审核",
        },
        {
          value: "2",
          label: "已删除",
        },
        {
          value: "1",
          label: "已发表",
        },
        {
          value: "0",
          label: "未发表",
        },
      ],
      currentPage: 1,
      option: "全部",
    };
  },
  created() {
    this.loading = true;
    this.$axios.articleList(this.requestData).then((res) => {
      if (res.code == 200) {
        this.list = res.data.list;
        this.count = res.data.count;
      }
      this.loading = false;
    });
  },
  methods: {
    timestampToTime(timestamp, dayMinSecFlag) {
      const date = new Date(timestamp);
      const Y = date.getFullYear() + "-";
      const M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      const D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      const h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      const m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      const s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      if (!dayMinSecFlag) {
        return Y + M + D;
      }
      return Y + M + D + h + m + s;
    },
    updateList() {
      this.loading = true;
      this.$axios.articleList(this.requestData).then((res) => {
        if (res.code == 200) {
          this.list = res.data.list;
          this.count = res.data.count;
        }
        this.loading = false;
      });
    },
    changeStatus(e) {
      var data = {
        Status: e.row.Status,
        QID: e.row.QID,
      };
      this.$axios.updateStatus(data).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "更新状态成功",
            type: "success",
          });
          this.updateList();
        }
      });
    },
    pageChange(e) {
      this.requestData.pageNum = e - 1;
      this.$axios.articleList(this.requestData).then((res) => {
        if (res.code == 200) {
          this.list = res.data.list;
          this.count = res.data.count;
          this.currentPage = e;
        }
        this.loading = false;
      });
    },
    answer(e) {
      console.log(e.row);
      this.$router.push({
        path: `/Audit/${e.row.article_id}`,
      });
    },
    del(e) {
      var that = this;
      this.$confirm("此操作将永久删除问题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(e);
        var d = {
          article_id: e.row.article_id,
        };
        that.$axios.articleDelete(d).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
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
      this.$axios.articleList(this.requestData).then((res) => {
        if (res.code == 200) {
          this.list = res.data.list;
          this.count = res.data.count;
          this.currentPage = 1;
        }
      });
    },
  },
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
