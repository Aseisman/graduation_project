<template>
  <el-form ref="form" :model="form" label-width="80px" class="form">
    <el-form-item label="标签名称">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="标签描述">
      <el-input v-model="form.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">修改标签</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        description: "",
        id:"",
      },
    };
  },
  mounted(){
    this.form={
        id:this.$route.query.id,
        name:this.$route.query.name,
        description:this.$route.query.description
    }
  },
  methods: {
    onSubmit() {
      this.$axios
        .tagAdd({
          label_name: this.form.name,
          label_description: this.form.description,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          } else {
            this.$message({
              type: "warning",
              message: "参数不全!",
            });
          }
        });
    },
  },
};
</script>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
