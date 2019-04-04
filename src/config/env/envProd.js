const host = 'https://f2e-srp.miaomaicar.com/';
const formHost = 'http://47.110.147.127:8082/';

export const env = {
  HOST: host,
  LOGIN_HOST: `https://sso.miaomaicar.com/login.htm`,
  REDIRECTION_URL: {
    QuickOrder: `${host}as/#/QuickOrder`, // 组织维修开单
    MaintenanceHistory: `${host}as/#/MaintenanceHistory`, // 组织跳转地址
    AddEvaluationOrder: `${host}as/#/AddEvaluationOrder`, // 跳转新增估价单
    ViewValuationList: `${host}as/#/ViewValuationList`, // 跳转估价单查看
    ReturnOfWorkOrders: `${host}as/#/ReturnOfWorkOrders`, // 退料
    DetailsOfDelivery: `${host}as/#/DetailsOfDelivery`, // 确定退料
    DeliveryReturns: `${host}as/#/DeliveryReturns`, // 发料管理跳转地址
    SendMaterialOne: `${host}as/#/SendMaterialOne`, // 发料退料管理跳转地址
    Historical: `${host}as/#/Historical`, // 历史跳转地址
    WorksheetIssue: `${host}as/#/WorksheetIssue`, // 工单发料
    WorksheetOut: `${host}as/#/WorksheetOut`, // 工单发料出库
    LookBeforeWork: `${host}as/#/LookBeforeWork`,
    LookQueryWork: `${host}as/#/LookQueryWork`, // 查看维修工单
    FrontAssignOrder: `${host}as/#/FrontAssignOrder`, //前装工单
    DecorationWorkOrdeManagement:`${host}as/#/DecorationWorkOrdeManagement`, //装潢工单管理
    DecorationOrder:`${host}as/#/DecorationOrder`, //装潢工单
    LookDecorationWorkOrdeManagement: `${host}as/#/LookDecorationWorkOrdeManagement`,  //查看装潢工单

    AfterAslaAdrees: `${formHost}WebReport/ReportServer?reportlet=/saas/Print_OrdSettlement.cpt`, // 售后结算单
    CommentAdrees: `${formHost}WebReport/ReportServer?reportlet=/saas/Print_WeiTuoWeiXiuGuJiaDan.cpt`, //委托维修估价单
    GoodsOutAdrees: `${formHost}ReportServer?reportlet=/saas/Print_GoodsRelease.cpt`, // 商品出库单
  },
  SERVER_URL: {
    baseUrl: 'https://vs-srp.souche.com/', // 整车
    platUrl: 'https://pb-srp.souche.com/', // 平台
    masUrl: 'https://md-srp.souche.com/', // 主数据
    cusUrl: 'https://cs-srp.souche.com/', // 客商
    balanceUrl: 'https://sc-srp.souche.com/', // 结算中心
    saleUrl: 'https://as-srp.souche.com/', // 售后
    filesUrl: 'http://10.255.254.54:11080/', // 音频下载

  },
};
