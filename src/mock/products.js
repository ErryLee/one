export const CATEGORY_TREE = [
  {
    id: 'home',
    name: '家居',
    children: [
      { id: 'cups', name: '杯具' },
      { id: 'bottle', name: '保温' },
    ],
  },
  {
    id: 'digital',
    name: '数码',
    children: [
      { id: 'audio', name: '音频' },
      { id: 'gear', name: '外设' },
    ],
  },
  {
    id: 'wear',
    name: '服饰',
    children: [
      { id: 'tops', name: '上装' },
      { id: 'bags', name: '包袋' },
    ],
  },
];

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: '日式陶瓷马克杯',
    price: 49,
    categoryId: 'cups',
    category: '杯具',
    stock: 128,
    desc: '哑光釉面，400ml，适合咖啡与茶。',
    color: '#c4785a',
  },
  {
    id: 'p2',
    name: '无线降噪耳机',
    price: 599,
    categoryId: 'audio',
    category: '音频',
    stock: 46,
    desc: '主动降噪，续航约 30 小时。',
    color: '#2f3a4a',
  },
  {
    id: 'p3',
    name: '亚麻短袖衬衫',
    price: 189,
    categoryId: 'tops',
    category: '上装',
    stock: 72,
    desc: '透气亚麻，夏季通勤休闲两用。',
    color: '#7a8f6a',
  },
  {
    id: 'p4',
    name: '便携保温杯',
    price: 129,
    categoryId: 'bottle',
    category: '保温',
    stock: 210,
    desc: '316 不锈钢，保温 12 小时。',
    color: '#4a6fa5',
  },
  {
    id: 'p5',
    name: '机械键盘 68 键',
    price: 399,
    categoryId: 'gear',
    category: '外设',
    stock: 2,
    desc: '热插拔轴体，RGB 灯效。库存较少，便于试用上限提示。',
    color: '#5c4a6e',
  },
  {
    id: 'p6',
    name: '极简帆布托特包',
    price: 159,
    categoryId: 'bags',
    category: '包袋',
    stock: 95,
    desc: '大容量内袋，适合日常出行。',
    color: '#a67c52',
  },
];

export function categoryName(categoryId) {
  if (categoryId === 'all') return '全部';
  for (const parent of CATEGORY_TREE) {
    if (parent.id === categoryId) return parent.name;
    const child = parent.children?.find((item) => item.id === categoryId);
    if (child) return child.name;
  }
  return '全部';
}

/** 选中父级时包含其全部子分类 */
export function categoryIdsFor(categoryId) {
  if (categoryId === 'all') return null;
  const parent = CATEGORY_TREE.find((item) => item.id === categoryId);
  if (parent) return [parent.id, ...(parent.children ?? []).map((item) => item.id)];
  return [categoryId];
}

/**
 * 模拟服务端异步拉取商品列表
 * @param {number} delayMs 延迟毫秒数
 */
export function fetchProducts(delayMs = 800) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS.map((item) => ({ ...item })));
    }, delayMs);
  });
}
