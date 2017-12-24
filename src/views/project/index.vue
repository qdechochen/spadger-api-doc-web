<template>
  <el-row>
    <el-col :span="6" v-for="(project, index) in projects" :key="index" :offset="index > 0 ? 2 : 0">
      <el-card :body-style="{ padding: '0px' }">
        <div style="padding: 14px;" @click="showProject(project._id)">
          <h2>{{project.name}}</h2>
          <div class="bottom clearfix">
            <avatar-chip
              v-if="project.creator"
              :url="project.creator.avatar | remoteAsset"
              size="s"
              :name="project.creator.name">
            </avatar-chip>
            <time v-if="false" class="created_at">{{$d(new Date(project.meta.created_at), 'short')}}</time>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import AvatarChip from '@/components/common/avatar-chip';

export default {
  name: 'Projects',
  components: {
    AvatarChip,
  },
  data() {
    return {
      projects: [],
    };
  },
  computed: {

  },
  methods: {
    load() {
      this.$axios.get('projects', { params: { select: 'full' } })
        .then(({ data }) => {
          this.projects = data.list;
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('failed_fetching_data'),
          });
        });
    },
    showProject(id) {
      this.$router.push(`/projects/${id}`);
    },
  },
  created() {
    console.log('xx');
    this.load();
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
}
</style>
