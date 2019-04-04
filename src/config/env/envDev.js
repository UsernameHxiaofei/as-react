
const host = 'http://dev.srp.dasouche.net/';
const formHost = 'https://finereport.bzmaster.cn:8898/';

export const env = {
  HOST: host,
  LOGIN_HOST: `${host}#/login`,
  REDIRECTION_URL: {
    QuickOrder: `${host}as/#/QuickOrder`, // 组织跳转地址 addOrder
    MaintenanceHistory: `${host}as/#/MaintenanceHistory`, // 组织跳转地址 history
    AddEvaluationOrder: `${host}as/#/AddEvaluationOrder`, // 组织跳转地址 JupOrder
    ViewValuationList: `${host}as/#/ViewValuationList`, // 组织跳转地址 LookOrder

    ReturnOfWorkOrders: `${host}as/#/ReturnOfWorkOrders`, // 退料 MaterialWithdrawal
    DetailsOfDelivery: `${host}as/#/DetailsOfDelivery`, // 确定退料 DeliveryAndWithdrawal

    DeliveryReturns: `${host}as/#/DeliveryReturns`, // 发料退料管理跳转地址 DeliveryReturnsCopy
    SendMaterialOne: `${host}as/#/SendMaterialOne`, //  发料管理跳转地址 SendMaterialOneCopy
    Historical: `${host}as/#/Historical`, // 历史跳转地址 HistoricalCopy
    WorksheetIssue: `${host}as/#/WorksheetIssue`, // 工单发料
    WorksheetOut: `${host}as/#/WorksheetOut`, // 工单发料出库
    LookBeforeWork: `${host}as/#/LookBeforeWork`, // 查看前装工单
    LookQueryWork: `${host}as/#/LookQueryWork`, // 查看维修工单
    FrontAssignOrder: `${host}as/#/FrontAssignOrder`,
    DecorationWorkOrdeManagement:`${host}as/#/DecorationWorkOrdeManagement`,
    DecorationOrder:`${host}as/#/DecorationOrder`,
    LookDecorationWorkOrdeManagement: `${host}as/#/LookDecorationWorkOrdeManagement`,  //查看装潢工单

    AfterAslaAdrees: `${formHost}WebReport/ReportServer?reportlet=/saas/Print_OrdSettlement.cpt`, // 售后结算单
    CommentAdrees: `${formHost}WebReport/ReportServer?reportlet=/saas/Print_WeiTuoWeiXiuGuJiaDan.cpt`, //委托维修估价单
    GoodsOutAdrees: `${formHost}ReportServer?reportlet=/saas/Print_GoodsRelease.cpt`, // 商品出库单
  },
  SERVER_URL: {
    baseUrl: 'http://saas-vs-svc.singleunit.dev.dasouche.net/', // 整车
    platUrl: 'http://saas-pb-svc.singleunit.dev.dasouche.net/', // 平台
    masUrl: 'http://saas-md-svc.singleunit.dev.dasouche.net/', // 主数据
    cusUrl: 'http://saas-cs-svc.singleunit.dev.dasouche.net/', // 客商
    balanceUrl: 'http://saas-sc-svc.singleunit.dev.dasouche.net/', // 结算中心
    supplymentUrl: 'http://saas-mrp-svc.singleunit.dev.dasouche.net/', // 集采
    invUrl: 'http://saas-inv-svc.singleunit.dev.dasouche.net/', // 进销存
    saleUrl: 'http://saas-as-svc.singleunit.dev.dasouche.net/', // 售后
    filesUrl: 'http://10.255.254.54:11080/', // 音频下载
  },
};


