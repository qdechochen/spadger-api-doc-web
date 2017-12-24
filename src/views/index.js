import Login from './public/login';
import Welcome from './public/welcome';
import Languages from './system/languages';
import Projects from './project/index';
import Project from './project/project';
import ViewConfigurations from './project/view-configurations';
import Configurations from './project/configurations';
import ViewApi from './project/view-api';
import Api from './project/api';

export default {
  public: {
    Login,
    Welcome,
  },
  system: {
    Languages,
  },
  project: {
    Projects,
    Project,
    ViewConfigurations,
    Configurations,
    ViewApi,
    Api,
  },
};
