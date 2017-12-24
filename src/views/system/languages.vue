<template>
  <main-layout>
    <section class="search-frame">
      <el-form :inline="true" :model="form" @submit.native.prevent="search(1)">
        <el-form-item :label="$t('keyword')">
          <el-input v-model="form.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(1)">{{$t('search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table
      :data="list"
      border
      height="auto"
      class="list"
      v-loading="loading"
      @sort-change="onSortChange"
      :default-sort = "{prop: 'index', order: 'ascending'}"
      @selection-change="onSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="index"
          :label="$t('index')"
          sortable="custom"
          width="180">
        </el-table-column>
        <el-table-column
          prop="zh-CN"
          :show-overflow-tooltip="true"
          :label="$t('zh-CN')">
        </el-table-column>
        <el-table-column
          prop="en-US"
          :show-overflow-tooltip="true"
          :label="$t('en-US')">
        </el-table-column>
        <el-table-column
          prop="en-US"
          :label="$t('operations')"
          width="180">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="onEdit(scope.$index)">{{$t('edit')}}</el-button>
            <el-button
              size="small"
              type="danger"
              @click="onDelete(scope.$index)">{{$t('delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="pagination.current"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalRecord">
      </el-pagination>
    </section>
    <el-dialog :title="$t('translation')" :visible.sync="showEdit" :close-on-click-modal="false">
      <el-form :model="editingItem" :rules="editingRules" ref="editingForm" label-width="80px">
        <el-form-item :label="$t('index')" prop="index" :error="editingErrors.index">
          <el-input v-model="editingItem.index" :disabled="editingItem._id!=''" @change="onIndexChanged"></el-input>
        </el-form-item>
        <el-form-item :label="$t('zh-CN')" prop="zh-CN" :error="editingErrors['zh-CN']">
          <el-input type="textarea" v-model="editingItem['zh-CN']" @change="resetError('zh-CN')" autosize ></el-input>
        </el-form-item>
        <el-form-item :label="$t('en-US')" prop="en-US" :error="editingErrors['en-US']">
          <el-input type="textarea" v-model="editingItem['en-US']" @change="resetError('en-US')" autosize ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="saveTranslation">{{$t('ok')}}</el-button>
      </span>
    </el-dialog>
    <el-collapse slot="aside" v-model="activeAsideCollapseItems">
      <el-collapse-item class="button-forest" :title="$t('operations')" name="operations">
        <el-button :disabled="selected.length===0" size="small" type="danger" @click="onDeleteSelected">{{$t('delete_selected')+(selected.length>0?('('+selected.length+')'):'')}}</el-button>
        <el-button icon="plus" size="small" @click="onAdd">{{$t('add')}}</el-button>
      </el-collapse-item>
      <el-collapse-item class="button-forest" :title="$t('tips')" name="tips">
        {{$t('tip_example')}}
      </el-collapse-item>
    </el-collapse>
  </main-layout>
</template>

<script>
import MainLayout from '@/components/common/main-layout';

export default {
  name: 'Languages',
  components: {
    MainLayout,
  },
  data() {
    return {
      form: {
        keyword: '',
        sort: 'index',
      },
      list: [
      ],
      pagination: {
        current: 1,
        sizes: [10, 20, 30, 50, 100, 200],
        size: 10,
        totalRecord: 0,
      },
      selected: [],
      editingIndex: -1,
      editingItem: {
        _id: '',
        index: '',
        'zh-CN': '',
        'en-US': '',
      },
      editingRules: {
        index: [
          { required: true, message: '请输入索引', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' },
        ],
        'zh-CN': [
          { required: true, message: '请输入简体中文翻译', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' },
        ],
        'en-US': [
          { required: true, message: '请输入 English(US) 翻译', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' },
        ],
      },
      editingErrors: {
        index: null,
        'zh-CN': null,
        'en-US': null,
      },
      showEdit: false,

      loadingCount: 0,
      activeAsideCollapseItems: ['operations', '2', '3', '4'],
    };
  },
  computed: {
    loading() {
      return this.loadingCount > 0;
    },
  },
  methods: {
    onSortChange({ order, prop }) {
      this.form.sort = (order === 'descending' ? '-' : '') + prop;
      this.search();
    },
    onSelectionChange(val) {
      this.selected = val;
    },
    onAdd() {
      this.editingIndex = -1;
      this.editingItem = {
        _id: '',
        index: '',
        'zh-CN': '',
        'en-US': '',
      };
      this.showEdit = true;
    },
    onEdit(index) {
      this.editingIndex = index;
      this.editingItem = Object.assign({}, this.list[index]);
      this.showEdit = true;
    },
    onDelete(index) {
      this.loadingCount++;
      this.$axios.delete(`admin/system/translations/${this.list[index]._id}`, this.editingItem)
      .then(() => {
        this.$message({
          type: 'success',
          message: this.$i18n.t('operation_finished'),
        });
        this.list.splice(index, 1);
        this.loadingCount--;
      })
      .catch(() => { this.loadingCount--; });
    },
    onDeleteSelected() {
      const ids = [];
      for (let i = 0; i < this.selected.length; i++) {
        ids.push(this.selected[i]._id);
      }

      this.loadingCount++;
      this.$axios.delete(`admin/system/translations/${ids.join(',')}`, this.editingItem)
      .then(() => {
        this.$message({
          type: 'success',
          message: this.$i18n.t('operation_finished'),
        });
        this.search();
        this.loadingCount--;
      })
      .catch(() => { this.loadingCount--; });
    },
    onIndexChanged(index) {
      this.resetError('index');
      this.$nextTick(() => {
        this.editingItem.index = index.replace(/[^a-zA-Z0-9_-]+/gi, '');
      });
    },
    saveTranslation() {
      this.resetErrors();
      const self = this;
      this.$refs.editingForm.validate((valid) => {
        if (valid) {
          this.loadingCount++;
          let request;
          if (this.editingItem._id) {
            request = this.$axios.patch(`admin/system/translations/${this.editingItem._id}`, this.editingItem);
          } else {
            request = this.$axios.post('admin/system/translations', this.editingItem);
          }
          request.then(() => {
            this.$message({
              type: 'success',
              message: this.$i18n.t('operation_finished'),
            });
            this.showEdit = false;
            if (this.editingIndex < 0) {
              this.search();
            } else {
              this.$set(this.list, this.editingIndex, this.editingItem);
            }
          })
          .catch(({ errors }) => {
            if (errors) {
              const keys = Object.keys(errors);
              for (let i = 0; i < keys.length; i++) {
                self.editingErrors[keys[i]] = errors[keys[i]];
              }
            }
          })
          .then(() => {
            this.loadingCount--;
          });
        }
      });
    },
    resetError(key) {
      this.editingErrors[key] = null;
    },
    resetErrors() {
      Object.keys(this.editingErrors).forEach((value) => { this.editingErrors[value] = null; });
    },
    search(page) {
      if (page) this.pagination.current = page;
      this.loadingCount++;
      this.$axios.get('admin/system/translations', {
        params: {
          keyword: this.form.keyword,
          sort: this.form.sort,
          pageSize: this.pagination.size,
          page: this.pagination.current,
        },
      })
        .then(({ data }) => {
          this.list = data.list;
          this.pagination.totalRecord = data.pagination.totalRecord;
          // if (this.pagination.current !== data.page.current) this.pagination.current = data.page.current;
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '数据获取失败',
          });
        })
        .then(() => {
          this.loadingCount--;
        });
    },
    onPageChange(page) {
      this.pagination.current = page;
      this.search();
    },
    onPageSizeChange(size) {
      this.pagination.size = size;
      this.search();
    },
  },
  created() {
    this.search();
  },
};
</script>

<style lang="less" scoped>
</style>
