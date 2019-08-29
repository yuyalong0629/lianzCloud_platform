/**
 * @description: API统一管理
 * @param {Object} api [API]
 * @return: api
 */
const api = {
  // register
  sendCode: '/api/ic/user/user/phone/regyzm',
  register: '/api/ic/user/user/register',
  existPhone: '/api/ic/user/user/phone', // 验证手机号是否注册

  // login
  login: '/api/ic/user/user/login',
  loginByAuthKey: '/api/ic/user/user/loginByAuthKey', // 使用authKey登录系统
  // reset
  reSendCode: '/api/ic/user/user/phone/resetPwdYzm',
  retrieve: '/api/ic/user/user/resetPwd',
  // nav
  getNav: '/api/ic/auth/auth/menu',
  navPermission: '/api/ic/auth/auth/functionPage', // 权限
  // 客户关系管理
  removeCustomer: '/api/ic/crm/customer/removeCustomer', // 删除
  custIndustry: '/api/ic/user/dict/', // 行业字典表
  addCustomerAndMallUser: '/api/ic/crm/customer/addCustomerAndMallUser', // 新增客户
  getCustomerAndMallUser: '/api/ic/crm/customer/getCustomerAndMallUser', // 客户详情
  updateCustomerAndMallUser: '/api/ic/crm/customer/updateCustomerAndMallUser', // 编辑客户
  companyValidate: '/api/ic/org/company/validate/password', // 登入管理系统时管理员密码校验
  getBackStageUrl: '/api/ic/user/url/backstageurl', // 获取组织架构管理的项目地址
  // showCustomersPage: '/api/ic/crm/customer/showFuzzyCustomerPages', // 条件分页
  showCustomersPage: '/api/ic/crm/customer/listCustomerPages', // 条件分页
  listCustomerNames: '/api/ic/crm/customer/listCustomerNames', // 客户名称模糊搜索
  listCustomerCodes: '/api/ic/crm/customer/listCustomerCodes', // 客户编码模糊搜索
  getUsersLike: '/api/ic/org/company/getUsersLike', // 客户经理模糊搜索
  // 产品分类
  categoryTree: '/api/ic/mall/b/category/tree/', // 列表
  categoryRemove: '/api/ic/mall/b/category/removes', // 删除
  categoryList: '/api/ic/mall/b/category/tree', // 获取公司所有商品分类
  categoryAdd: '/api/ic/mall/b/category', // 添加商品分类
  viewCategory: '/api/ic/mall/b/category/', // 查看商品类目信息
  categorySave: '/api/ic/mall/b/category', // 保存编辑
  // 属性分类
  catattrList: '/api/ic/mall/b/catattr/alllist/', // 初始化Tab列表
  catattrRemove: '/api/ic/mall/b/catattr/removes', // 删除分类的属性
  listCompanyCustsAndCompanySelf: '/api/ic/crm/customer/listCompanyCustsAndCompanySelf', // 获取公司所有客户和公司自己
  catattrSubmit: '/api/ic/mall/b/catattr', // 属性分类信息表单提交
  catattrDetail: '/api/ic/mall/b/catattr/', // 查询分类的属性
  // 商品列表
  // listCompanyGoodsCode: '/api/ic/mall/b/sku/listCompanyGoodsCode', // 列表商家所有商品的商品编码
  listCompanyGoodsCode: '/api/ic/mall/b/sku/listCompanySpringCodes', // 列表商家所有商品的商品编码
  // listCompanyGoodsName: '/api/ic/mall/b/sku/listCompanyGoodsName', // 列表商家所有商品的商品名称
  listCompanyGoodsName: '/api/ic/mall/b/sku/listCompanySpringNames', // 列表商家所有商品的商品名称
  goodsTree: '/api/ic/mall/b/category/tree/', // 商品类目树形列表
  searchGoods: '/api/ic/mall/b/sku/search', // 后台搜索商家商品
  catAllAttrAndOptions: '/api/ic/mall/c/category/catAllAttrAndOptions', // 获取商品分类所有属性和可选项
  uploadFile: '/api/ic/user/file/uploadFile', // 上传文件
  addGoods: '/api/ic/mall/b/sku/add', // 商家添加商品
  getAttrs: '/api/ic/mall/b/cat/attrs', // 查看某个分类的所有属性列表
  goodsView: '/api/ic/mall/b/sku/view', // 查看某个分类的所有属性列表
  goodsUpdate: '/api/ic/mall/b/sku/update', // 商家修改商品信息
  goodsSkuAdd: '/api/ic/mall/b/sku/add', // 商家添加原材料
  setBomAndCraft: '/api/ic/mall/b/sku/setBomAndCraft', // 工厂设置渠道商产品的bom和工艺
  getBomAndCraftPrices: '/api/ic/mall/b/sku/prices/', // 查看价目表
  // 原材料
  bomListCompanyGoodsCode: '/api/ic/mall/b/material/listCompanyMaterialCodes', // 列表商家所有原材料的编码
  bomListCompanyGoodsName: '/api/ic/mall/b/material/listCompanyMaterialNames', // 列表商家所有原材料的名称
  bomCategoryTree: '/api/ic/mall/b/category/bom/tree', // 获取公司所有原材料分类(树形结构)
  bomearch: '/api/ic/mall/b/material/search', // 获取公司所有原材料分类(树形结构)
  bomAdd: '/api/ic/mall/b/material/add',
  bomDelete: '/api/ic/mall/b/sku/del',
  getQueryMaterialBaseInfo: '/api/ic/mall/b/material/queryMaterialBaseInfo', // 获取原材料基本信息
  // 工序管理
  processList: '/api/ic/mall/b/pdm/process/select/list', // 获取工序列表
  processAdd: '/api/ic/mall/b/pdm/process/add', // 添加工序
  processDelete: '/api/ic/mall/b/pdm/process/delete/batch', // 删除工序
  processInfo: '/api/ic/mall/b/pdm/process/select/details/', // 工序详情
  processUpdate: '/api/ic/mall/b/pdm/process/update', // 工序详情
  // 工艺管理
  craftLineList: '/api/ic/mall/b/pdm/craft/select/list', // 获取工艺列表
  craftLineDelete: '/api/ic/mall/b/pdm/craft/delete/batch', // 删除工艺列表
  craftLineInfo: '/api/ic/mall/b/pdm/craft/select/details/', // 查看工艺详情
  craftLineAdd: '/api/ic/mall/b/pdm/craft/add', // 添加工艺
  craftLineUpdate: '/api/ic/mall/b/pdm/craft/update', // 修改工艺
  getlistCustShortNames: '/api/ic/crm/customer/listCustShortNames', // 根据简称模糊搜素
  // 订单
  getOrderNumber: '/api/ic/mall/b/order/like/orderNumber', // 订单编号模糊搜索分页列表
  getOrderList: '/api/ic/mall/b/order/list/', // 后台分页订单列表
  getOrderDetail: '/api/ic/mall/b/order/details/', // 后台通过订单id查询订单详情
  getCompanyAllUsers: '/api/ic/org/userCompany/allUsers', // 查询公司的所有人(客户经理)
  getListCompanyCusts: '/api/ic/crm/customer/listCompanyCusts', // 获取公司所有客户
  getListCompanyList: '/api/ic/crm/customer/listFuzzyCustomers', // 根据名称，简称，编码模糊搜素
  getListCompanyGoods: '/api/ic/mall/b/sku/listCompanyGoods', // 列表商家所有商品基本信息
  orderSave: '/api/ic/mall/b/order/save', // 人工录入订单
  updateOrder: '/api/ic/mall/b/order/update/order', // 后台修改订单
  deletedBatch: '/api/ic/mall/b/order/delete/batch', // 定单批量逻辑删除
  setAddressIvo: '/api/ic/mall/b/order/back/save/addr', // 新建地址
  getAddressList: '/api/ic/mall/b/order/list', // 通过客户id查询收货地址列表
  getSkuPrice: '/api/ic/mall/b/sku/cust/price', // 获取产品客户报价
  getListCompanyCustomGoods: '/api/ic/mall/b/sku/listCompanyCustomGoods', // 列表商家对客户的定制商品基本信息
  // 渠道商分派订单
  getFactoryOrder: '/api/ic/mall/b/order/factory/mall/order', // 查询渠道商订单分页
  delFactoryOrder: '/api/ic/mall/b/order/factory/mall/order/del', // 移除销售订单
  addFactoryOrder: '/api/ic/mall/b/order/factory/sale/order/add', // 分配工厂销售单
  companyList: '/api/ic/org/company/listByType', // 根据类型获取渠道商、工厂、仓库、材料商
  getListCompanySpringGoodsInfo: '/api/ic/mall/b/sku/listCompanySpringGoodsInfo', // 列表商家所有弹簧商品的弹簧信息
  getFactoryPrchase: '/api/ic/mall/b/order/factory/mall/prchase', // 查询工厂销售订单分页
  getManuFactoryPrchase: '/api/ic/mall/b/order/factory/manufactor/prchase', // 工厂查询工厂销售订单分页
  getFactoryPrchaseDetial: '/api/ic/mall/b/order/factory/mall/procurement/detail', // 渠道商查询采购详情
  getListCompanySpringSpecs: '/api/ic/mall/b/sku/listCompanySpringSpecs', // 列表商家所有弹簧的规格
  getListCompanySpringCz: '/api/ic/mall/b/sku/listCompanySpringCz', // 列表商家所有弹簧的材质
  getListCompanyOrderNum: '/api/ic/mall/b/order/factory/mall/order/number', // 模糊查询渠道商订单号
  getListCompanyBasicPage: '/api/ic/mall/b/price/history/list/page', // 列表商家所有商品基本信息
  getTransactionCust: '/api/ic/mall/b/order/channel/transaction/cust', // 渠道商获取已成交客户
  delProcurementDetail: '/api/ic/mall/b/order/factory/mall/procurement/detail/del', // 渠道商取消销售子订单
  updateProcurementDetail: '/api/ic/mall/b/order/factory/mall/prchase/update', //
  getListHitoryChanelInfo: '/api/ic/mall/b/price/history/list/chanel/hitory/price/page', //
  // 工厂
  delFactoryPolicyOrder: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/del', // 工厂订单移除
  getFactoryPolicyOrder: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order', // 查询工厂订单分页
  getFactoryPolicyDetail: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/details', // 工单分单-工厂生产单详情
  putFactoryPolicyOrderAdd: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/add', // 工厂分单到车间
  updateFactoryStatus: '/api/ic/mall/b/order/factory/manufactor/procurement/detail/update', // 厂家更新销售子订单状态
  getFactoryPolicyOrderList: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/list', // 工单分单-工厂生产单
  getFactoryPolicyOrderCz: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/cz', // 工单分单-工厂订单商品材质
  getFactoryPolicyOrderSpec: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/spec', // 工单分单-工厂订单商品规格
  updateFactoryPolicyStatus: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/status', // 工单分单-工厂生产单修改状态
  getListFactoryOrderNum: '/api/ic/mall/b/order/factory/manufactor/prchase/number', // 模糊查询工厂订单号
  getMaterialOrder: '/api/ic/mall/b/materialOrder/suppliersale/ordernum/intelligent/filling', // 供应商销售单号或工厂采购单号的的智能提示
  updateBomCraft: '/api/ic/mall/b/factoryProductionOrder/factory/policy/order/bom/craft', // 工单分单-工厂订单修改bom和工艺
  printProductionOrder: '/api/ic/mall/b/factoryProductionOrder/printProduuctionOrder', // 打印生产工单
  // 入库/出库
  putWarehousing: '/api/ic/mall/b/instorageApply/factory/warehousing/order/list', // 入库-车间生产单分页
  delWarehousing: '/api/ic/mall/b/instorageApply/factory/warehousing/order/del', // 入库-车间生产单移除
  getWarehousingOrderSale: '/api/ic/mall/b/instorageApply/factory/warehousing/order/sale', // 入库-查询生产单对应的销售单、客户名称、数量
  applyWarehousing: '/api/ic/mall/b/instorageApply/factory/warehousing/apply', // 入库-入库申请
  warehousingList: '/api/ic/mall/b/instorageApply/factory/warehousing/list', // 入库-入库列表
  warehousingListDetail: '/api/ic/mall/b/instorageApply/factory/warehousing/details', // 入库-入库详情
  updateWarehousingStatus: '/api/ic/mall/b/instorageApply/factory/warehousing/status/update', // 入库-修改入库状态
  getWarehousingListNum: '/api/ic/mall/b/instorageApply/factory/warehousing/number', // 入库-入库单号模糊查询
  getWarehousingListName: '/api/ic/mall/b/instorageApply/factory/warehousing/name', // 入库-入库生产名称模糊查询
  // 出库
  outStorageApplyTobedistributed: '/api/ic/mall/b/outstorageApply/mallorder/tobedistributed', // 订单出库待分配订单列表
  outStorageApplyOpt: '/api/ic/mall/b/outstorageApply/mallorder/deliver/opt', // 订单发货操作
  outStorageApplyStatusChange: '/api/ic/mall/b/outstorageApply/batch/change/deliver/status', // 批量改变渠道商待发货订单状态待发货单批量移除
  outStorageApplyList: '/api/ic/mall/b/outstorageApply/channelmerchants/deliver/list', // 出库申请单列表
  outStorageApplyDetail: '/api/ic/mall/b/outstorageApply/details/', // 查看出库申请单详情
  outStorageApplyDelete: '/api/ic/mall/b/outstorageApply/delete', // 批量删除
  outStorageApplyStatus: '/api/ic/mall/b/outstorageApply/change/status', // 改变出库单状态
  outStorageApplyUpdate: '/api/ic/mall/b/outstorageApply/update', // 修改出库申请单
  printOrderOutstorage: '/api/ic/mall/b/outstorageApply/printOrderOutstorage', // 打印出库单
  // 工厂采购原材料
  getPurchasingManagement: '/api/ic/mall/b/materialOrder/purchasing/management', // 采购管理工厂端
  selectSupplierList: '/api/ic/mall/b/materialOrder/select/supplier/list', // 通过规格或标准搜索供应商原材料列表
  addSupplierAppend: '/api/ic/mall/b/materialOrder/supplier/append', // 增补供应商
  flushMaterialOrder: '/api/ic/mall/b/materialOrder/flush', // 供应商添加后刷新
  addMaterialOrderMateriala: '/api/ic/mall/b/materialOrder/factory/materiala/require/add', // 添加新材料
  addMaterialOrderSale: '/api/ic/mall/b/materialOrder/supplier/sale/order/add', // 新增供应商销售单确认
  deleteMaterialOrder: '/api/ic/mall/b/materialOrder/batch/delete', // 批量移除待采购单
  getFactoryMaterialRequireCz: '/api/ic/mall/b/materialOrder/SpecOrCz/factoryMaterialRequire/intelligent/filling/', // cz列表
  getFactoryMaterialRequireSpec: '/api/ic/mall/b/materialOrder/SpecOrCz/factoryMaterialRequire/intelligent/filling/', // spec列表
  getFactoryMaterialSupplierList: '/api/ic/mall/b/materialOrder/supplier/sale/order/list', // 供应商销售单列表
  getFactoryMaterialSupplierListDetail: '/api/ic/mall/b/materialOrder/supplier/sale/order/details/', // 供应商销售单详情
  updateSupplierSaleOrder: '/api/ic/mall/b/materialOrder/supplier/sale/order/update', // 修改供应商销售单
  // 审批相关
  getAllProcess: '/api/ic/approve/m/runProcess/listAllProcessByUser', // 全部
  getReviewProcess: '/api//ic/approve/m/runProcess/listReviewProcess', // 待审核
  foRunProcessByStarter: '/api/ic/approve/m/runProcess/listFoRunProcessByStarter', // 自己发起的
  getProcessListToBeRead: '/api/ic/approve/m/process/listProcessListToBeRead', // 待阅
  getSelectProcessCout: '/api/ic/approve/m/runProcess/selectProcessCout', // 获取任务条数
  getRunProcessDetial: '/api/ic/approve/m/runProcess/getDetail', // 获取审批流程
  successAudit: '/api/ic/approve/m/audit/success', // 审批通过
  refusedAudit: '/api/ic/approve/m/audit/refused', // 审批拒绝
  readProcess: '/api/ic/approve/m/process/read', // 查看流程
  searchRunProcess: '/api/ic/approve/m/runProcess/listFoRunProcessDtoByCondition', // 根据条件查询流程
  // 权限
  functionPage: '/api/ic/auth/auth/functionPage' // 获取允许的操作和页面自定义的布局
}

export default api
