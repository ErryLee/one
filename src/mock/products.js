const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: '日式陶瓷马克杯',
    price: 49,
    category: '家居',
    stock: 128,
    desc: '哑光釉面，400ml，适合咖啡与茶。',
    color: '#c4785a',
  },
  {
    id: 'p2',
    name: '无线降噪耳机',
    price: 599,
    category: '数码',
    stock: 46,
    desc: '主动降噪，续航约 30 小时。',
    color: '#2f3a4a',
  },
  {
    id: 'p3',
    name: '亚麻短袖衬衫',
    price: 189,
    category: '服饰',
    stock: 72,
    desc: '透气亚麻，夏季通勤休闲两用。',
    color: '#7a8f6a',
  },
  {
    id: 'p4',
    name: '便携保温杯',
    price: 129,
    category: '家居',
    stock: 210,
    desc: '316 不锈钢，保温 12 小时。',
    color: '#4a6fa5',
  },
  {
    id: 'p5',
    name: '机械键盘 68 键',
    price: 399,
    category: '数码',
    stock: 33,
    desc: '热插拔轴体，RGB 灯效。',
    color: '#5c4a6e',
  },
  {
    id: 'p6',
    name: '极简帆布托特包',
    price: 159,
    category: '服饰',
    stock: 95,
    desc: '大容量内袋，适合日常出行。',
    color: '#a67c52',
  },
];

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
