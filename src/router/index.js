import Vue from 'vue';
import Router from 'vue-router';
import views from '@/views';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'welcome',
    component: views.system.Welcome,
    meta: {
      auth: 'login',
    },
  }, {
    path: '/system/languages',
    name: 'languages',
    component: views.system.Languages,
    meta: {
      auth: 'login',
    },
  }, {
    path: '/login',
    name: 'login',
    component: views.public.Login,
    meta: {
      auth: false,
    },
  }, {
    path: '/projects',
    name: 'projects',
    component: views.project.Projects,
    meta: {
      auth: 'login',
    },
  }, {
    path: '/projects/:pid/',
    component: views.project.Project,
    children: [{
      path: '',
      component: views.project.ViewConfigurations,
      meta: {
        auth: 'login',
      },
    }, {
      path: 'edit',
      name: 'edit-project',
      component: views.project.Configurations,
      meta: {
        auth: 'login',
      },
    }, {
      path: 'apis/add',
      name: 'add-api',
      component: views.project.Api,
      meta: {
        auth: 'login',
      },
    }, {
      path: 'apis/:apiid',
      name: 'view-api',
      component: views.project.ViewApi,
      meta: {
        auth: 'login',
      },
    }, {
      path: 'apis/:apiid/edit',
      name: 'edit-api',
      component: views.project.Api,
      meta: {
        auth: 'login',
      },
    }],
  }],
});
