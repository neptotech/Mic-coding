export const IFrameProtocolIde = {
  // 导入IDE内容
  IDE_IMPORT: 'ide_import',
  // 导出IDE内容
  IDE_EXPORT: 'ide_export',
  // 导出作品封面
  IDE_EXPORT_COVER: 'ide_export_cover',
  // 新的IDE工程
  IDE_NEW: 'ide_new',
  // IDE内部硬件切换
  IDE_CHANGE_KIT: 'ide_change_kit',
  // IDE切换语言
  IDE_CHANGE_LAN: 'ide_change_lan',
  // 登录态变化
  IDE_LOGIN_CHANGED: 'ide_login_changed',
  // 设置IDE toolbox
  IDE_SET_TOOLBOX: 'ide_set_toolbox',
  // 得到IDE 的toolbox
  IDE_GET_TOOLBOX: 'ide_get_toolbox',
  // 运行的代码
  IDE_GET_CODE: 'ide_get_code',
  // IDE 开始运行
  IDE_RUN_CODE: 'ide_run_code',
  // IDE 内容变动
  IDE_CONTENT_CHANGED: 'ide_content_changed',
  // 舞台全屏
  IDE_STAGE_FULLSCREEN: 'ide_stage_fullscreen',
  // 模式切换
  IDE_MODE_CHANGED: 'ide_mode_changed',
  // 属性切换
  IDE_PROPERTY_CHANGED: 'ide_property_changed',
  // 展示IDE的组件发送给IDE
  IDE_STATE_CHANGE: 'ide_state_change', // 状态改变
  // 展示IDE的组件主动请求获取IDE数据
  IDE_GET_USER_ANSWER: 'ide_get_user_answer', // 获取IDE答案
  // 展示IDE的组件主动请求获取IDE截图
  IDE_GET_SNAPSHOT: 'ide_get_snapshot', // 获取IDE截图
  // 作业从积木得到代码
  IDE_WORKSPACE_TO_CODE: 'ide_workspace_to_code',
  // IDE的积木定义
  IDE_BLOCKS_DEFINE: 'ide_blocks_define',
  // IDE主动请求父组件
  IDE_REQUIRE_LOGIN: 'ide_require_login', // ide请求登录
  // 通知IDE打开背包
  IDE_OPEN_MY_BAG: 'ide_open_my_bag',
  // IDE主动notify给父组件
  IDE_ENVIRONMENT: 'ide_environment', // ide的环境数据，为对象
  // IDE主动notify给父组件
  IDE_BLOCK_ENVIRONMENT: 'ide_block_environment', // ide积木环境数据，为对象
  // IDE主动notify给父组件
  IDE_PROJECT_SETTING: 'ide_project_setting', // ide的项目设置数据，为对象
  // IDE主动notify给父组件
  IDE_EDIT_RANGE: 'ide_edit_range', // ide的编辑范围，为对象
  // IDE主动notify给父组件
  IDE_DESCRIPTION_POSITION_RANGE: 'ide_description_position_range', // ide的题干位置范围，为对象
  // IDE主动notify给父组件
  IDE_SUPPORT_RANGE: 'ide_support_range', // ide的支持范围，为对象
  // IDE主动notify给父组件
  IDE_BLOCK_CHANGED: 'ide_block_changed', // ide block 发生变化
  // IDE主动notify给父组件
  IDE_CODE_CHANGED: 'ide_code_changed', // ide code 发生变化
  // 作业通知IDE 设置作业中添加的自定义积木的定义
  IDE_DEFINE_TASK_BLOCKS: 'ide_define_task_blocks',
  // IDE 运行前 向作业请求合并有可能存在的其它代码
  IDE_COMBINE_TASK_CODE: 'ide_combine_task_code',
  // IDE 响应作业要求 隐藏上传按钮
  IDE_UPLOAD_BUTTON_VISIBLE: 'ide_upload_button_visible',
};

export const IFrameProtocolHardware = {
  // 付费硬件
  IDE_PAID_HARDWARE: 'ide_paid_hardware',
  // 付费硬件应答
  IDE_PAID_HARDWARE_RSP: 'ide_paid_hardware_rsp',
};

// IFrameMessenger 回调
export const IFrameRsp = {
  RSP_IDE_IMPORT: 'rsp_import',
  RSP_IDE_EXPORT: 'rsp_export',
  RSP_IDE_EXPORT_COVER: 'rsp_export_cover',
  RSP_IDE_NEW: 'rsp_new',
  RSP_IDE_LOGIN_CHANGED: 'rsp_login_changed',
  RSP_IDE_SET_TOOLBOX: 'rsp_set_toolbox',
  RSP_IDE_RESET_TOOLBOX: 'rsp_reset_toolbox',
  RSP_IDE_GET_CODE: 'rsp_get_code',
  RSP_IDE_WORKSPACE_TO_CODE: 'rsp_workspace_to_code',
  RSP_IDE_GET_TOOLBOX: 'rsp_get_toolbox',
  RSP_IDE_BLOCKS_DEFINE: 'rsp_blocks_define',
  RSP_IDE_DEFINE_TASK_BLOCKS: 'rsp_define_task_blocks',
  RSP_IDE_COMBINE_TASK_CODE: 'rsp_combine_task_code',
  RSP_IDE_UPLOAD_BUTTON_VISIBLE: 'rsp_upload_button_visible',
  RSP_IDE_PAIED_HARDWARE: 'rsp_paied_hardware',
};
