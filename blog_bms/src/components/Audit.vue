<template>
  <el-form ref="form" :model="form" label-width="80px" class="form">
    <el-form-item label="文章标题">
      <el-input v-model="detail.article_title" disabled></el-input>
    </el-form-item>
    <el-form-item label="文章摘要">
      <el-input v-model="detail.article_desc" disabled></el-input>
    </el-form-item>
    <el-form-item label="文章日期">
      <el-input v-model="detail.article_date" disabled></el-input>
    </el-form-item>
    <el-form-item label="文章作者">
      <el-input v-model="detail.user.user_name" disabled></el-input>
    </el-form-item>
    <el-form-item label="文章标签">
      <el-select
        v-model="detail.label"
        placeholder="请选择"
        multiple="true"
        style="width:100%"
        disabled
      >
        <el-option
          v-for="item in labels"
          :key="item.label_id"
          :label="item.label_name"
          :value="item.label_id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="文章封面">
      <el-input v-model="detail.article_img_url"></el-input>
    </el-form-item> -->
    <el-form-item label="文章内容">
      <!-- <article v-html="detail.article_content" ></article> -->
      <mavon-editor
        class="md"
        :value="detail.article_content"
        :subfield="prop.subfield"
        :defaultOpen="prop.defaultOpen"
        :toolbarsFlag="prop.toolbarsFlag"
        :editable="prop.editable"
        :scrollStyle="prop.scrollStyle"
      ></mavon-editor>
    </el-form-item>
    <el-form-item label="文章状态">
      <el-input v-model="detail.article_status" disabled></el-input>
    </el-form-item>
    <el-form-item label="文章审核" v-if="detail.article_status !== '已发表'">
      <el-button type="primary" @click="onPass">通过</el-button>
      <el-button type="primary" @click="onDisPass">不通过</el-button>
      <el-input
        style="margin-top:20px"
        type="textarea"
        v-model="result"
        placeholder="请输入不同意的理由"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      detail: {},
      labels: [],
      result: "",
    };
  },
  mounted() {
    Promise.all([
      this.$axios.articleById({ article_id: this.$route.params.id }),
      this.$axios.tagList(),
    ]).then((res) => {
      let temp = res[0].data[0].label;
      let labels = temp.map((v) => {
        return v.label_id;
      });
      res[0].data[0].label = labels;
      res[0].data[0].article_date = this.timestampToTime(
        res[0].data[0].article_date
      );
      res[0].data[0].article_status = ["未发表", "已发表", "已删除", "未审核"][
        res[0].data[0].article_status
      ];
      console.log(res[0].data[0]);
      this.detail = res[0].data[0];
      this.labels = res[1].data;
    });
  },
  methods: {
    onPass() {
      this.$axios
        .articleAudit({ article_id: this.detail.article_id, article_status: 1 })
        .then((res) => {
          if (res.code == 200) {
            if (res.code == 200) {
              this.$message({
                message: "更新状态成功",
                type: "success",
              });
              this.$router.push({
                path: `/ArticleList`,
              });
            }
          }
        });
    },
    onDisPass() {
            this.$axios
        .articleAudit({ article_id: this.detail.article_id, article_status: 0 })
        .then((res) => {
          if (res.code == 200) {
            if (res.code == 200) {
              this.$message({
                message: "更新状态成功",
                type: "success",
              });
              this.$router.push({
                path: `/ArticleList`,
              });
            }
          }
        });
    },
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
  },
  computed: {
    prop() {
      let data = {
        subfield: false, // 单双栏模式
        defaultOpen: "preview", //edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true,
      };
      return data;
    },
  },
};
</script>

<style scoped>
.form {
  width: 90%;
  margin-left: 5%;
  margin-top: 20px;
}
</style>
