<template>
  <el-row :gutter="20">
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <Logo></Logo>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple">
        <el-menu
            :default-active="this.$store.state.user.activePage"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#545c64"
            active-text-color="#ffd04b">
          <el-row>
            <el-col :span="4">
              <div class="grid-content">
                <el-menu-item index="1" style="text-align: center">
                  <i class="el-icon-s-home"></i>
                  <router-link to="/front/frontHome" style="color: white">首页</router-link>
                </el-menu-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-menu-item index="2">
                  <i class="el-icon-view"></i>
                  <router-link to="/front/show" style="color: white">租车</router-link>
                </el-menu-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-menu-item index="3">
                  <i class="el-icon-mouse"></i>
                  <router-link to="/front/login" style="color: white">登录</router-link>
                </el-menu-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-menu-item index="4">
                  <i class="el-icon-mouse"></i>
                  <router-link to="/front/reg" style="color: white">注册</router-link>
                </el-menu-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-menu-item index="5">
                  <i class="el-icon-s-help"></i>
                  <router-link to="/front/help" style="color: white">帮助中心</router-link>
                </el-menu-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-menu-item index="6" style="align-content: center">
                  <i class="el-icon-phone"></i>
                  <router-link to="/front/contact" style="color: white">联系我们</router-link>
                </el-menu-item>
              </div>
            </el-col>
          </el-row>
        </el-menu>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="header-avatar block" v-if="userInfo.username">
        <el-row>
          <el-col :span="8">
            <el-avatar size="medium" :src="userInfo.avatar" @click.native="toBack"></el-avatar>
          </el-col>
          <el-col :span="16">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :underline="false">
                  <el-link type="info" @click="toPersonalCenter">个人中心</el-link>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Logo from '@/components/logo'

export default {
  name: "Header",
  components: {Logo},
  data() {
    return {}
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      console.log("userInfo", this.userInfo)
      this.$store.commit("setActivePage", key)
    },
    logout() {
      this.$axios.post("/logout").then(res => {
        localStorage.clear()
        sessionStorage.clear()
        this.$store.commit("resetState")
        this.$router.push("/front/frontHome")
      })
    },
    toBack() {
      this.$router.push({name: 'BackNavIndex'});
    },
    toPersonalCenter() {
      let tab = {name: "sys:center:info", title: "个人中心"}
      this.$store.commit("addTab", tab)
      this.$router.push("/uc")
    }
  },
  computed: {
    userInfo: {
      get() {
        return this.$store.state.user.userInfo;
      }
    }
  }
}
</script>

<style scoped>
.el-row {
  position: relative;
}

.el-col {
  color: white;
}

.bg-purple-dark {
  /*background: #555d65;*/
}

.bg-purple {
  /*background: #555d65;*/
}

.bg-purple-light {
  /*background: #555d65;*/
}

.grid-content {
  border-radius: 4px;
  min-height: 30px;
  text-align: center;
  justify-content: center;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.el-menu {
  width: 700px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.header-avatar {
  float: right;
  width: 150px;
  margin-top: 15px;
}

.el-dropdown {
  position: relative;
  margin-top: 10px;
  color: white;
}
</style>