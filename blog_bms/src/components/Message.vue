<template>
  <div style="width: 80%;margin-left: 10%;margin-top: 30px;" v-loading="loading">
    <div style="font-size: 24px;display: flex;justify-content: space-between;">
      <span>基本信息</span>
      <button class="button" @click="edit">编辑</button>
    </div>
    <div style="border: 1px solid #aba7a7;margin-top: 7px;margin-bottom: 3px;"></div>
    <div style="line-height: 51px;">
      <span>昵称：</span>
      <input
        type="text"
        v-model="userMessage.nickName"
        :disabled="dFlag"
        :class="[dFlag==false?'input-active':'input']"
      />
    </div>
    <div style="line-height: 51px;">
      <span>特长：</span>
      <input
        type="text"
        v-model="userMessage.specialty"
        :disabled="dFlag"
        :class="[dFlag==false?'input-active':'input']"
      />
    </div>
    <div style="line-height: 51px;">
      <span>电话：</span>
      <input
        type="text"
        v-model="userMessage.phone"
        :disabled="dFlag"
        :class="[dFlag==false?'input-active':'input']"
      />
    </div>
    <div style="line-height: 51px;">
      <span>邮箱：</span>
      <input type="text" v-model="userMessage.email" :disabled="true" class="input" />
    </div>
    <button v-if="dFlag==false" class="button" @click="sure">保存</button>
    <div style="margin-top: 30px;font-size: 24px;display: flex;justify-content: space-between;">
      <span>修改密码</span>
    </div>
    <div style="border: 1px solid #aba7a7;margin-top: 7px;margin-bottom: 3px;"></div>
    <div style="margin-top: 20px;margin-left: 47px;margin-bottom: 10px;">
      <span>新密码：</span>
      <input type="password" class="input-active" v-model="password1" />
    </div>
    <div>
      <span>再输一遍密码：</span>
      <input type="password" class="input-active" v-model="password2" />
      <span v-if="!isCheck">两次输入不一样</span>
    </div>
    <button
      :class="[isCheck==true?'button':'button-grey']"
      :disabled="!isCheck"
      @click="updatePassword"
    >保存</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userMessage: "",
      dFlag: true,
      loading: false,
      password1: "",
      password2: "",
    };
  },
  created() {
    this.$axios.info().then((res) => {
      if (res.code == 200) {
        this.userMessage = res.data;
      }
    });
  },
  computed: {
    isCheck: function () {
      if (
        this.password2.length != 0 &&
        this.password1.length != 0 &&
        this.password1 == this.password2
      ) {
        console.log("true");
        return true;
      } else if (this.password1.length == 0 || this.password2.length == 0) {
        return false;
      } else {
        return false;
      }
    },
  },
  methods: {
    edit() {
      this.dFlag = !this.dFlag;
    },
    sure() {
      var data = {
        NickName: this.userMessage.nickName,
        specialty: this.userMessage.specialty,
        Phone: this.userMessage.phone,
      };
      // console.log(data)      
      this.loading = true;
      this.$axios
        .updateMessage(data)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          }
          this.dFlag = !this.dFlag;
          this.loading = false;
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            this.$alert(error.response.data.msg);
            this.loading = false;
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
    updatePassword() {
      if (this.isCheck) {
        this.loading = true;
        var data = {
          Password: this.password1,
        };
        this.$axios
          .updatePassword(data)
          .then((res) => {
            if (res.code == 200) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
            }
            this.loading = false;
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
              this.$alert(error.response.data.msg);
              this.loading = false;
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
      }
    },
  },
};
</script>

<style scoped>
.button {
  width: 60px;
  height: 35px;
  background-color: #409eff;
  border: #409eff;
  color: white;
  font-size: 16px;
  border-radius: 6px;
}
.button-grey {
  width: 60px;
  height: 35px;
  background-color: grey;
  border: grey;
  color: white;
  font-size: 16px;
  border-radius: 6px;
}
.input-active {
  border: 1px solid #9e9b9b;
  width: 180px;
  height: 30px;
  border-radius: 6px;
  margin-right: 20px;
}
.input {
  border: 0;
}
</style>