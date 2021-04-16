<template>
  <div v-loading="loading">
    <div style="margin-top: 20px;width:100%;">
      <el-button
        type="primary"
        icon="el-icon-connection"
        style="width: 110px;height: 34px;padding: 0px;background-color: rgb(48, 208, 172);border-color: rgb(48, 208, 172);line-height: 34px;position: relative;left:80%;}"
        @click="newLabel"
        >新增标签</el-button
      >
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
        id="tagsTable"
      >
        <el-table-column label="标签名" prop="label_name"></el-table-column>
        <el-table-column
          prop="label_description"
          label="标签描述"
        ></el-table-column>
        <el-table-column label="操作" prop="Status">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="font-size: 15px;"
              @click="edit(scope)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.$axios.tagList().then((res) => {
      console.log(res);
      if (res.code == 200) {
        this.list = res.data;
      }
      this.loading = false;
    });
  },
  methods: {
    newLabel:function(){
      this.$router.push({
        path: "/TagAdd",
      });
    },
    edit:function(e){
      console.log(e);
      this.$router.push({
        path:"/TagUpdate",
        query:{
          id:e.row.label_id,
          name:e.row.label_name,
          description:e.row.label_description
        }
      })
    }
  },
};
</script>

<style scoped>
input {
  border: 0px;
  background-color: none;
  outline: none;
}
input:focus {
  outline: none;
}
</style>
