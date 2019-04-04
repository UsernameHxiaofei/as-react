export { default as global } from './global';
export { default as demo } from './demo';
// 维修开单
export * from '@/pages/QuickOrder/modules';

// 导入估价单模块的状态
export * from '@/pages/ValuationManagement/modules';
export * from '@/pages/ViewValuationList/modules';
export * from '@/pages/ConstructionOrderManagement/modules';
export * from '@/pages/Team/modules';
export * from '@/pages/TechnicianTeam/modules';
export * from '@/pages/StationManagement/modules';
export * from '@/pages/TechnicianStation/modules';
export * from '@/pages/LookQueryWork/modules';

// 导入发料管理模块的状态
export * from '@/pages/IssueManagement/modules';

// 导入前装、装潢模块的状态
export * from '@/pages/FrontAssign/modules';
export * from '@/pages/DecorationWorkOrder/modules';

//客户看板
export * from '@/pages/ClientBoard/modules';
