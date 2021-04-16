<template>
  <div v-loading="loading">
    <input
      type="text"
      placeholder="输入城市进行查找天气"
      v-model="searchData"
      style="width: 30%;background: rgb(238, 240, 244);height: 34px;border-radius: 6px;margin-left: 3%;padding-left: 10px;margin-top:20px;"
    />
    <!-- table -->
    <div style="width: 95%;margin-left: 2.5%;margin-top: 30px;border-top: 1px solid #EBEEF5;">
      <el-table
        :data="list"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 100%"
        id="userTable"
      >
        <el-table-column label="城市">{{this.city||"北京"}}</el-table-column>
        <el-table-column prop="fxDate" label="日期"></el-table-column>
        <el-table-column prop="textDay" label="天气情况"></el-table-column>
        <el-table-column prop="tempMax" label="最高温度℃"></el-table-column>
        <el-table-column prop="tempMin" label="最低温度℃"></el-table-column>
        <el-table-column prop="windDirDay" label="风向"></el-table-column>
        <el-table-column prop="windScaleDay" label="风力等级"></el-table-column>
        <el-table-column prop="precip" label="降水量（单位：毫米）"></el-table-column>
        <el-table-column prop="vis" label="可见度"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      searchData: "",
      list: [],
      loading: false,
      city: "",
      timeout: "",
    };
  },
  mounted() {
    //   https://geoapi.heweather.net/v2/city/lookup?
    axios({
      url:
        "https://geoapi.heweather.net/v2/city/lookup?location=" +
        "北京" +
        "&key=3ce705dcb3f44d1e8d7d3d5120db697f", // 接口名字
      method: "get",
    }).then((res) => {
      console.log(res);
      if (res.data.location.length != 0) {
        this.getWeatherByName(res.data.location[0].id);
      } else {
        this.$alert("搜索不到该城市，请重新查询");
      }
    });
  },
  methods: {
    //根据城市id获得天气信息
    getWeatherByName(cityname) {
      this.loading = true;
      axios({
        url:
          "https://devapi.heweather.net/v7/weather/3d?location=" +
          cityname +
          "&key=3ce705dcb3f44d1e8d7d3d5120db697f", // 接口名字
        method: "get",
      }).then((res) => {
        console.log(res);
        if (res.data.daily.length != 0) {
          this.list = res.data.daily;
        } else {
          this.list = [];
        }
        this.loading = false;
      });
    },
  },
  watch: {
    searchData: function () {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (this.searchData.length != 0) {
        this.timeout = setTimeout(() => {
          axios({
            url:
              "https://geoapi.heweather.net/v2/city/lookup?location=" +
              this.searchData +
              "&key=3ce705dcb3f44d1e8d7d3d5120db697f", // 接口名字
            method: "get",
          }).then((res) => {
            console.log(res);
            if (res.data.code == 200) {
              this.city = res.data.location[0].name;
              this.getWeatherByName(res.data.location[0].id);
            } else {
              this.$alert("搜索不到该城市，请重新查询");
            }
          });
        }, 1000);
      }
    },
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