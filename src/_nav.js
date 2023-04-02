export default [
  {
    component: 'CNavItem',
    name: '主页',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: '验证',
  },
  {
    component: 'CNavItem',
    name: '列表',
    to: '/batch/list',
    icon: 'cil-drop',
  },
  {
    component: 'CNavItem',
    name: '添加',
    to: '/batch/add',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavTitle',
    name: '验证任务',
  },
  {
    component: 'CNavItem',
    name: '我的任务',
    to: '/batch/add',
    icon: 'cil-drop',
  },
]
