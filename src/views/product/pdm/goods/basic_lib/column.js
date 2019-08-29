// tab Header
export const columns = [
  {
    title: '产品编码',
    dataIndex: 'code',
    width: '12%',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    width: '12%'
  },
  {
    title: '规格',
    dataIndex: 'spec',
    width: '12%'
  },
  {
    title: '材质',
    dataIndex: 'cz',
    width: '12%'
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    width: '12%',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: '12%'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '12%',
    scopedSlots: { customRender: 'status' }
  }
]
// tab Header
export const bomColumns = [
  {
    title: '产品编码',
    dataIndex: 'code',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '产品名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' }

  },
  {
    title: '产品规格',
    dataIndex: 'spec',
    scopedSlots: { customRender: 'spec' }
  },
  {
    title: '单位',
    dataIndex: 'unit',
    scopedSlots: { customRender: 'unit' }
  },
  {
    title: '标准用量',
    dataIndex: 'dosage',
    scopedSlots: { customRender: 'dosage' }
  },
  {
    title: '获取途径',
    dataIndex: 'gateway',
    scopedSlots: { customRender: 'gateway' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 120,
    scopedSlots: { customRender: 'operation' }
  }
]

// 弹簧种类
export const springType = [
  { id: 0, name: '压簧' },
  { id: 1, name: '拉簧' },
  { id: 2, name: '扭簧' },
  { id: 3, name: '碟簧' },
  { id: 4, name: '波簧' },
  { id: 5, name: '板簧' }
]

// 选择弹簧种类显示不同产品属性
export const productAttrType = {
  level: false, // 公差等级
  line: false, // 线径
  out: false, // 外径
  height: false, // 自由高度
  turns: false, // 总圈数
  material: false, // 材质
  surface: false, // 表面处理
  pressure: false, // 压并高度
  work: false, // 工作高度
  effective: false, // 有效圈数
  strength: false, // 力值
  rotating: false, // 旋向
  spiralAngle: false, // 螺旋角
  onlength: false, // 展开长度
  inner: false, // 内径
  thickness: false, // 厚度
  wave: false, // 波数
  layer: false, // 层数
  stress: false, // 应力
  stiffness: false, // 刚度
  deformation: false, // 最大变形量
  rotate: false // 旋绕比
}
