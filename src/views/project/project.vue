<template>
  <el-container class="main-container">
    <el-aside width="auto">
      <div class="project-summary" v-if="project">
        <div class="introduction">{{project.introduction}}</div>
        <el-button-group>
          <el-button plain icon="el-icon-fa-refresh" size="mini" @click="refresh"></el-button>
          <el-button plain icon="el-icon-fa-gear" size="mini" @click="editProject"></el-button>
          <el-button plain icon="el-icon-fa-plus" size="mini" @click="addApi">{{$t('add_api')}}</el-button>
        </el-button-group>
      </div>
      <el-input v-model="keyword" :placeholder="$t('keyword')"></el-input>
      <div class="api-list" v-if="project">
        <div v-for="(api, index) in filteredApis"
          :key="index"
          :class="{ active: api._id === selectedApi }"
          @click="selectApi(api._id)">
          <span>{{api.method}}</span>{{api.url}}
        </div>
      </div>
    </el-aside>
    <el-main>
      <router-view class="view"></router-view>
    </el-main>
  </el-container>
</template>

<script>
import AvatarChip from '@/components/common/avatar-chip';

export default {
  name: 'Project',
  components: {
    AvatarChip,
  },
  data() {
    return {
      keyword: '',
      project: null,
      apis: [],
      selectedApi: '',

      loadingCount: 0,
    };
  },
  computed: {
    filteredApis() {
      return this.apis.filter(api => api.url.includes(this.keyword)).sort((a, b) => {
        if (a.url > b.url) return 1;
        else if (a.url < b.url) return -1;
        else if (a.method > b.method) return 1;
        else if (a.method < b.method) return -1;
        return 0;
      });
    },
  },
  methods: {
    selectApi(id) {
      this.selectedApi = id;
      /*
      this.$router.push({
        name: 'view-api',
        params: {
          apiid: id,
        },
      });
      */
      this.$router.replace(`/projects/${this.id}/apis/${id}`);
    },
    addProject() {
    },
    editProject() {
      this.$router.push({
        name: 'edit-project',
        pid: this.id,
      });
    },
    addApi() {
      this.$router.push(`/projects/${this.id}/apis/add`);
    },
    saved() {
      this.refresh();
    },
    refresh() {
      this.loadingCount++;
      this.$axios.get(`projects/${this.id}`)
        .then(({ data }) => {
          this.project = data;
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('failed_fetching_data'),
          });
        })
        .then(() => {
          this.loadingCount--;
        });

      this.loadingCount++;
      this.$axios.get(`projects/${this.id}/apis`)
        .then(({ data }) => {
          this.apis = data.list;
        }).catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('failed_fetching_data'),
          });
        })
        .then(() => {
          this.loadingCount--;
        });
    },
  },
  created() {
    this.id = this.$route.params.pid;
    this.refresh();
    this.$eventHub.$on('API_UPDATED', () => {
      this.refresh();
    });
  },
  destroyed() {
    this.$eventHub.$off('API_UPDATED');
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height:100%;
  >.el-aside {
    border-right: 1px solid #ccc;
    padding: 0 20px 0 0;
    display: flex;
    flex-direction: column;
  }
  >.el-main {
    padding-top:0;
    padding-right:20px;
  }
}
.project-selector {
  .el-button {
    padding-right: 14px;
    padding-left: 14px;
  }
}
.project-summary {
  padding: 6px 0;
  >div {
    padding: 6px 0;
  }
}
.api-list {
  height: 100%;
  flex-shrink: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top:8px;
  overflow-x: hidden;
  overflow-y: auto;
  >div {
    padding:5px;
    cursor: default;
    span {
      display:inline-block;
      border: 1px solid #ccc;
      color:#aaa;
      font-size: 0.6em;
      margin-right: 5px;
      width: 40px;
      overflow: hidden;
      vertical-align: bottom;
      text-align: center;
      transform: scale(0.6, 1) translate(-16px, 0);
      margin-right: -16px;
    }
    &.active {
      color:#fff;
      background-color: #409EFF;
      span {
        color: #555;
        border: 1px solid #555;
      }
    }
  }
}
</style>
