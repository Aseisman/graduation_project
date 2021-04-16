<template>
  <el-container class="container">
    <!-- 旁边 -->
    <el-aside width="15%">
      <!-- brand -->
      <el-image :src="brand" class="brand"></el-image>
      <!-- 列表 -->
      <el-menu
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        background-color="transparent"
        text-color="rgb(249,249,249)"
        active-text-color="rgb(249,249,249)"
        router
        unique-opened
      >
        <el-menu-item
          v-for="(item,i) in navList"
          :key="i"
          :index="item.name"
          @click="changeTitle(item.navItem)"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{item.navItem}}</span>
        </el-menu-item>
        <el-menu-item @click="SignOut()">
          <i class="el-icon-switch-button"></i>
          <span slot="title">退出系统</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <!-- 237, 244, 250 -->
      <el-header height="70px">
        <el-row :gutter="20">
          <el-col :span="18">
            <div style="border-radius: 4px;min-height: 36px;font-size:15px;">
              当前页：
              <i class="el-icon-edit" style="font-size:20px;margin-right:10px;"></i>
              <span slot="title">{{title}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              style="border-radius: 4px;min-height: 36px;display: flex;justify-content: space-evenly; align-items: center"
            >
              <el-image :src="avator" class="avator"></el-image>
              欢迎您：{{username}}！
            </div>
          </el-col>
        </el-row>
      </el-header>
      <!-- main -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function () {
    return {
      brand: require("../assets/images/brand.png"),
      msg: "Welcome to Your Vue.js App",
      avator: require("../assets/images/avator.jpg"),
      down: require("../assets/images/down.png"),
      isCollapse: false,
      navList: [],
      title: "首页",
      username: "管理员",
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    changeTitle(name) {
      this.title = name;
    },
    SignOut: function () {
      //删除本地token，
      localStorage.clear();
      //跳到登录界面
      this.$router.push("/");
    },
  },
  mounted() {
    //管理员名称
    const userMessage = JSON.parse(localStorage.getItem("userMessage"));
    this.username = userMessage.nickName;
    //功能显示
    this.navList = [
      { name: "/Home", navItem: "首页", icon: "el-icon-discount" },
      {
        name: "/TagList",
        navItem: "标签管理",
        icon: "el-icon-magic-stick",
      },
      { name: "/ArticleList", navItem: "文章管理", icon: "el-icon-service" },
      { name: "/UserList", navItem: "用户管理", icon: "el-icon-user" },
      { name: "/Message", navItem: "个人信息", icon: "el-icon-coin" },
    ];
    //标题的显示
    switch (this.$route.name) {
      case "Message":
        this.title = "个人信息";
        break;
      case "Home":
        this.title = "首页";
        break;
      case "TagList":
        this.title = "标签管理";
      case "ArticleList":
        this.title = "文章管理";
        break;
      case "RecordList":
        this.title = "用户管理";
        break;
    }
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  background: rgb(237, 244, 250);
}
.el-aside {
  /* background: linear-gradient(
    rgb(67, 135, 199),
    rgb(58, 170, 186),
    rgb(50, 201, 174)
  ); */
  background: linear-gradient(
    #589ab9,#3c7da9,
    #4e4376
  );
  color: white;
  height: 100%;
}
.brand {
  width: 64%;
  margin-top: 40px;
  margin-left: 16%;
  margin-bottom: 20px;
}
.el_submenu__title:hover,
.el-submenu:hover,
.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.4) !important ;
}
/* .el-menu-item.is_active {
  
  
} */
.el-menu {
  border-right: 0 !important;
}
.el-menu-item {
  margin-top: 10px;
  background-color: transparent !important;
}
.el-menu-item i {
  color: inherit;
  margin-right: 20px;
  margin-left: 10px;
}
.el-header {
  background: rgb(255, 255, 255);
  box-shadow: 0px 0px 10px rgb(67, 135, 199, 0.2);
  line-height: 70px;
}
.avator {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.el-main {
  padding: 0;
  margin: 20px;
  background: rgb(255, 255, 255);
}
/* background: -moz-linear-gradient(top, #000000 0%, #ffffff 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#000000), color-stop(100%,#ffffff));
    background: -webkit-linear-gradient(top, #000000 0%,#ffffff 100%);
    background: -o-linear-gradient(top, #000000 0%,#ffffff 100%);
    background: -ms-linear-gradient(top, #000000 0%,#ffffff 100%);
    background: linear-gradient(to bottom, #000000 0%,#ffffff 100%); */
</style>
