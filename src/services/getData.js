import fetch, { filesExport } from '../config/fetch';

/* 基础数据值--平台接口 */
export const getBasValueByBasCategoryNo = data => fetch('sysBaseValueJson/getBasValueByBasCategoryNo.json', data, 'GET', 'platUrl'); // 数据目录查询基础数据列表信息
export const getGlobalMdmRegion = data => fetch('globalMdmRegionJson/getGlobalMdmRegion.json', data, 'GET', 'platUrl'); // 省市区
export const getDicDataByCategoryCode = data => fetch('sysDataDicJson/getDicDataByCategoryCode.json', data, 'GET', 'platUrl'); // 数据字典值
export const queryMdmCarModelTreeVoTree = data => fetch('mdmCarModelJson/queryMdmCarModelTreeVoTree.json', data, 'GET', 'platUrl'); // 查询三级联动车型
export const getHrEmpMstrByOrgId = data => fetch('hrEmployeeMstrJson/getHrEmpMstrByOrgId.jso', data, 'GET', 'platUrl'); // 查询门店下的员工信息
export const getCarModelVo = data => fetch('mdmCarModelJson/getCarModelVo.json', data, 'GET', 'platUrl'); // 车型
export const querySpecialMdmCarModelTreeVoTree = data => fetch('mdmcarmodeljson/queryMdmCarModelNew.json', data, 'GET', 'platUrl'); // 车型信息选择

// http://saas-as-svc.singleunit.dev.dasouche.net/loginApi/getLoginInfo.json

/* 客商 */
export const querySupplierTypeByID = data => fetch('supplierJson/querySupplierTypeByID', data, 'GET', 'cusUrl'); // 查询供应商
export const findCustomerById = data => fetch('findCustomerById.json', data, 'GET', 'cusUrl'); // 查看车主
export const findCusCarInfoFastlyByCusId = data => fetch('findCusCarInfoFastlyByCusId.json', data, 'GET', 'cusUrl'); // 更新车辆
export const findCusLinkCarInfoByCusIdAndVin = data => fetch('findCusLinkCarInfoByCusIdAndVin.json', data, 'GET', 'cusUrl'); // 查看所有车辆信息
export const updateCustomerCar = data => fetch('updateCustomerCar.json', data, 'POST', 'cusUrl'); // 修改车主车辆
export const saveCustomerCar = data => fetch('saveCustomerCar.json', data, 'POST', 'cusUrl'); // 新增车主
export const queryRelationshipByCriteria = data => fetch('carRelationshipJson/queryRelationshipByCriteria.json', data, 'GET', 'cusUrl'); // 人车关系查询
export const getCarInfoBykeywords = data => fetch('getCarInfoBykeywords.json', data, 'GET', 'cusUrl'); // 车牌、vin码校验
export const queryUnifiedSocialCreditCode = data => fetch('supplierJson/queryUnifiedSocialCreditCode.json', data, 'GET', 'cusUrl'); // 获取统一社会信用代码
export const getPersonalCustomerByMobileNo = data => fetch('getPersonalCustomerByMobileNo', data, 'GET', 'cusUrl')//维修工单
export const listCustomer = data => fetch('listCustomer', data, 'POST', 'cusUrl')//查询客户

/* 售后 ---主数据接口 */
export const listMdmWorkHourPrice = data => fetch('mdmWorkHourPriceJson/listMdmWorkHourPrice.json', data, 'GET', 'masUrl'); // 获取工时单价
export const queryWorkItem = data => fetch('workItemJson/queryWorkItem.json', data, 'POST', 'masUrl'); // 查询工项和价格
export const queryFastProduct = data => fetch('fastProductJson/queryFastProduct.json', data, 'GET', 'masUrl'); // 快捷商品模糊搜索
export const queryComboGoodsForPage = data => fetch('fastProductJson/queryComboGoodsForPage.json', data, 'GET', 'masUrl');
export const queryComboGoodsDet = data => fetch('fastProductJson/queryComboGoodsDet.json', data, 'GET', 'masUrl');
export const queryWorkItemPage = data => fetch('workItemJson/queryWorkItemPage.json', data, 'POST', 'masUrl'); //查询工项和价格-分页
export const queryGroupGoodsForPage = data => fetch('fastProductJson/queryGroupGoodsForPage.json', data, 'GET', 'masUrl');
export const queryGroupGoodsDet = data => fetch('fastProductJson/queryGroupGoodsDet.json', data, 'GET', 'masUrl')
export const queryFastProductForPage = data => fetch('fastProductJson/queryFastProductForPage.json', data, 'GET', 'masUrl');

/* 售后 ---售后接口 */
export const updateCustomerById = data => fetch('customerJson/updateCustomerById.json', data, 'POST', 'saleUrl'); // 更新车主
export const deleteCusCarFastlyInfo = data => fetch('carOwnerCustomerJson/deleteCusCarFastlyInfo.json', data, 'GET', 'saleUrl'); // 删除车辆
export const listWorkOrderHistoryFastlyByCusId = data => fetch('workOrderHistroyJson/listWorkOrderHistoryFastlyByCusId.json', data, 'GET', 'saleUrl'); // 查看维修历史信息
export const mapWorkOrderHistroyDto = data => fetch('workOrderHistroyJson/mapWorkOrderHistroyDto.json ', data, 'POST', 'saleUrl') //维修历史
export const querylistWorkOrder = data => fetch('workOrderManagementJson/listWorkOrder.json', data, 'POST', 'saleUrl'); //工单查询接口
export const getWorkOrderDeposit = data => fetch('workOrderManagementJson/getWorkOrderDeposit.json', data, 'GET', 'saleUrl'); //获取工单定金
export const cancelWorkOrderSettlement = data => fetch('workOrderManagementJson/cancelWorkOrderSettlement.json', data, 'GET', 'saleUrl'); //取消工单结算
export const pushWorkOrderDeposit = data => fetch('workOrderManagementJson/pushWorkOrderDeposit.json', data, 'GET', 'saleUrl'); //定金推送
export const invalidWorkOrder = data => fetch('workOrderManagementJson/invalidWorkOrder.json', data, 'GET', 'saleUrl'); //工单作废
export const saveWorkOrder = data => fetch('workOrderJson/saveWorkOrder.json', data, 'POST', 'saleUrl'); //保存/更新快捷开单信息
export const queryWorkOrder = data => fetch('workOrderJson/queryWorkOrder.json', data, 'POST', 'saleUrl'); //查看快捷开单信息/工单结算
export const settlementConfirm = data => fetch('workOrderJson/settlementConfirm.json', data, 'POST', 'saleUrl'); //查看快捷开单信息/工单结算
export const querySettlementGoodsInventory = data => fetch('workOrderJson/querySettlementGoodsInventory.json', data, 'GET', 'saleUrl'); //查看快捷开单信息/工单结算/* ---- */
export const getLoginInfo  = data => fetch('saas/sso/httpApi/getAuth.json', data, 'GET', 'saleUrl')//登录信息
// export const getLoginInfo  = data => fetch('loginApi/getLoginInfo.json', data, 'GET', 'saleUrl')//登录信息-单独模块
export const queryWorkSetting = data => fetch('afterSaleSettingJson/queryWorkSetting.json', data, 'GET', 'saleUrl'); // 查询售后系统设置
export const saveWorkSetting = data => fetch('afterSaleSettingJson/saveWorkSetting.json ', data, 'POST', 'saleUrl') //保存系统设置

/* 售后 ---估价单 */
export const listEvaluateOrder = data => fetch('evaluateOrderJson/listEvaluateOrder.json', data, 'POST', 'saleUrl')//估价单
export const invalidEvaluateOrder = data => fetch('evaluateOrderJson/invalidEvaluateOrder.json', data, 'GET', 'saleUrl')//作废
export const queryWorkOrderNoPage = data => fetch('evaluateOrderJson/queryWorkOrderNoPage.json', data, 'GET', 'saleUrl')//查看估价单
export const saveEvaluateOrder = data => fetch('evaluateOrderJson/saveEvaluateOrder.json', data, 'POST', 'saleUrl')//保存估价单
export const listWorkProcessOrder = data => fetch('workProcessOrderJson/listWorkProcessOrder.json', data, 'POST', 'saleUrl')//获取施工单
export const findListMdmWorkTeamByPage = data => fetch('mdmWorkTeamManagementJson/findListMdmWorkTeamByPage.json', data, 'GET', 'saleUrl')//获取班组
export const deleteMdmWorkTeam = data => fetch('mdmWorkTeamManagementJson/deleteMdmWorkTeam.json', data, 'GET', 'saleUrl')//删除班组
export const saveMdmWorkTeam = data => fetch('mdmWorkTeamManagementJson/saveMdmWorkTeam.json', data, 'POST', 'saleUrl')//保存班组
export const queryWorkProcessOrder = data => fetch('workProcessOrderJson/queryWorkProcessOrder.json', data, 'GET', 'saleUrl')//查看施工单
export const copyWorkOrder = data => fetch('workOrderJson/copyWorkOrder.json', data, 'GET', 'saleUrl')//复制工单
export const getStationList = data => fetch('stationManagementJson/getStationList.json', data, 'POST', 'saleUrl')//工位列表
export const findListMdmWorkTeamNoPage = data => fetch('mdmWorkTeamManagementJson/findListMdmWorkTeamNoPage.json', data, 'GET', 'saleUrl')//班组列表
export const queryWorkProcessInfoLinkWorkHour = data => fetch('workProcessOrderJson/queryWorkProcessInfoLinkWorkHour.json', data, 'GET', 'saleUrl')//获取派工单信息
export const checkWorkProcessOrder = data => fetch('workProcessOrderJson/checkWorkProcessOrder.json', data, 'POST', 'saleUrl')//获取派工单信息
export const dispatchingWorkProcessOrder = data => fetch('workProcessOrderJson/dispatchingWorkProcessOrder.json', data, 'POST', 'saleUrl')//施工单派工
export const revokeWorkProcessOrder = data => fetch('workProcessOrderJson/revokeWorkProcessOrder.json', data, 'GET', 'saleUrl')//施工单派工
export const convertWorkProcessOrder = data => fetch('workProcessOrderJson/convertWorkProcessOrder.json', data, 'POST', 'saleUrl')//施工单转工单
export const getMdmWorkLocationForPage = data => fetch('stationManagementJson/getMdmWorkLocationForPage.json', data, 'GET', 'saleUrl')
export const saveWorkLocation = data => fetch('stationManagementJson/saveWorkLocation.json', data, 'POST', 'saleUrl') //保存新增工位
export const deleteWorkLocation = data => fetch('stationManagementJson/deleteWorkLocation.json', data, 'GET', 'saleUrl') //删除工位
export const findListMdmWorkTeamEmployeeByWorkTeamId = data => fetch('mdmWorkTeamManagementJson/findListMdmWorkTeamEmployeeByWorkTeamId.json', data, 'GET', 'saleUrl') //根据班组id查看技师
export const getTechnicianVo = data => fetch('hrEmployeeMstrJson/getTechnicianVo.json', data, 'GET', 'platUrl') //查看技师
export const getMdmOrgDepartmentMstr = data => fetch('mdmDepartmentMstrJson/getMdmOrgDepartmentMstr.json', data, 'GET', 'platUrl') //部门
export const getMdmDutyMstr = data => fetch('mdmDutyMstrJson/getMdmDutyMstr.json', data, 'GET', 'platUrl') //职务
export const batchSaveMdmWorkTeamEmployee = data => fetch('mdmWorkTeamManagementJson/batchSaveMdmWorkTeamEmployee.json', data, 'POST', 'saleUrl') //添加技师
export const deleteListMdmWorkTeamEmployee = data => fetch('mdmWorkTeamManagementJson/deleteListMdmWorkTeamEmployee.json', data, 'POST', 'saleUrl') //删除技师
export const getStationLists = data => fetch('stationManagementJson/getStationList.json', data, 'GET', 'saleUrl') //工位技师
export const getEmployeeByWorkLocation = data => fetch('stationManagementJson/getEmployeeByWorkLocation.json', data, 'GET', 'saleUrl') //工位所有的技师
export const deleteWorkLocationEmployee = data => fetch('stationManagementJson/deleteWorkLocationEmployee.json', data, 'POST', 'saleUrl') //删除工位技师
export const saveWorkLocationEmployee = data => fetch('stationManagementJson/saveWorkLocationEmployee.json', data, 'POST', 'saleUrl') //批量添加工位技师
export const getWoMaterialInfo = data => fetch('woMaterialManagerJson/getWoMaterialInfo.json', data, 'GET', 'saleUrl') //查看工单材料
export const findMdmWorkTeamAndLocationByEmpId = data => fetch('workProcessOrderJson/findMdmWorkTeamAndLocationByEmpId.json', data, 'GET', 'saleUrl') //根据技师查班组工位
export const getEmployeeByWorkLocations = data => fetch('stationManagementJson/getEmployeeByWorkLocation.json', data, 'GET', 'saleUrl') //根据工位查技师
export const workOrderItemInvReturn = data => fetch('workOrderIssuedListJson/workOrderItemInvReturn.json', data, 'POST', 'saleUrl') //退料
export const getIssuedOrderListReturn = data => fetch('workOrderIssuedListJson/getIssuedOrderListReturn.json', data, 'POST', 'saleUrl') //发料单列表-工单发料退库界面
export const getIssuedOrderList = data => fetch('workOrderIssuedListJson/getIssuedOrderList.json', data, 'POST', 'saleUrl') //发料列表查询-工单发料页面
export const queryOneWorkSetting = data => fetch('afterSaleSettingJson/queryOneWorkSetting.json', data, 'POST', 'saleUrl') //获取售后设置
export const findListInvSendHistory = data => fetch('workOrderIssuedListJson/findListInvSendHistory.json', data, 'GET', 'saleUrl') //获取售后设置
export const getIssuedOrderStatus = data => fetch('workOrderIssuedListJson/getIssuedOrderStatus.json', data, 'GET', 'saleUrl') //获取工单状态
export const saveWorkOrderMaterial = data => fetch('workOrderJson/saveWorkOrderMaterial.json', data, 'POST', 'saleUrl') //保存工单发料
export const woMaterialDelivery = data => fetch('woMaterialManagerJson/woMaterialDelivery.json', data, 'POST', 'saleUrl') //发料出库
export const findListMdmWorkTeamEmployee = data => fetch('mdmWorkTeamManagementJson/findListMdmWorkTeamEmployee.json', data, 'GET', 'saleUrl') //发料出库
export const finishWorkOrder = data => fetch('workOrderJson/finishWorkOrder.json', data, 'GET', 'saleUrl') //工单完工
export const reworkWorkOrder = data => fetch('workOrderJson/reworkWorkOrder.json', data, 'GET', 'saleUrl') //工单返工
export const findIssuedWarehouseByGoodsDet = data => fetch('workOrderIssuedListJson/findIssuedWarehouseByGoodsDet.json', data, 'POST', 'saleUrl')
export const listFrontLoadingLWorkOrder = data => fetch('workOrderManagementJson/listFrontLoadingLWorkOrder.json', data, 'POST', 'saleUrl') //前装工单列表

/* 售后---前装、装潢 */
export const queryCarInventory = data => fetch('workOrderJson/queryCarInventory.json', data, 'GET', 'saleUrl') //发料出库
export const listDecorationLWorkOrder = data => fetch('workOrderManagementJson/listDecorationLWorkOrder.json', data, 'POST', 'saleUrl') //发料出库
/* 售后---售后预约 */
export const getAppointmentOrder = data => fetch('workOrderJson/getAppointmentOrder.json', data, 'POST', 'saleUrl') //预约列表
export const workOrderIsExistByAppointmentId = data => fetch('workOrderJson/workOrderIsExistByAppointmentId.json', data, 'GET', 'saleUrl') //预约单反查
export const playMusic = data => fetch('customerBoardJson/boardSpeechSynthesis.json', data, 'POST', 'filesUrl') //音频接口
// 音频接口
// export const playMusic = params => filesExport({
//   baseURL:'http://10.255.254.54:11080/',
//   url: 'customerBoardJson/boardSpeechSynthesis.json',
//   params
// })


















