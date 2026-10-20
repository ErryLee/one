import { ShoppingCartOutlined } from '@ant-design/icons';
import {
  App as AntdApp,
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Drawer,
  Flex,
  Grid,
  Row,
  Space,
  Spin,
  Tree,
  Typography,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useState } from 'react';
import { CATEGORY_TREE, categoryIdsFor, categoryName, fetchProducts } from './mock/products';
import { useCartStore } from './store/cart';

const { Title, Text, Paragraph } = Typography;

const treeData = [
  { key: 'all', title: '全部' },
  ...CATEGORY_TREE.map((parent) => ({
    key: parent.id,
    title: parent.name,
    children: parent.children.map((child) => ({
      key: child.id,
      title: child.name,
    })),
  })),
];

function formatPrice(value) {
  return `¥${value.toFixed(2)}`;
}

function Shop() {
  const { message } = AntdApp.useApp();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const items = useCartStore((s) => s.items);
  const cartList = Object.values(items);
  const totalCount = cartList.reduce((sum, row) => sum + row.qty, 0);
  const totalPrice = cartList.reduce(
    (sum, row) => sum + row.product.price * row.qty,
    0,
  );

  const allowedIds = categoryIdsFor(categoryId);
  const visibleProducts = allowedIds
    ? products.filter((product) => allowedIds.includes(product.categoryId))
    : products;

  function selectCategory(id) {
    setCategoryId(id);
    setMobileMenuOpen(false);
  }

  function handleAdd(product) {
    const result = addItem(product);
    if (!result.added) {
      message.warning(`库存不足，仅剩 ${result.stock} 件`);
      return;
    }
    if (result.limited) message.warning('已加入购物车，已达库存上限');
    else message.success('已加入购物车');
  }

  function handleQty(productId, delta) {
    const row = items[productId];
    if (!row) return;
    const result = setQty(productId, row.qty + delta);
    if (result.removed) message.info('已从购物车移除');
    else if (result.limited) message.warning(`库存不足，仅剩 ${result.stock} 件`);
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetchProducts(900)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError('商品加载失败，请稍后重试');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryTree = (
    <Tree
      blockNode
      defaultExpandAll
      selectedKeys={[categoryId]}
      treeData={treeData}
      onSelect={(keys) => {
        if (keys[0]) selectCategory(String(keys[0]));
      }}
    />
  );

  return (
    <div className="shop-page">
      <Flex justify="space-between" align="center" gap={12} className="shop-header">
        <div>
          <Text type="secondary">Demo Shop</Text>
          <Title level={2} style={{ margin: 0 }}>
            商品选购
          </Title>
        </div>
        <Badge count={totalCount} offset={[-4, 4]}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => setCartOpen(true)}
          >
            购物车
          </Button>
        </Badge>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={0} md={6}>
          <Card title="分类" size="small">
            {categoryTree}
          </Card>
        </Col>
        <Col xs={24} md={18}>
          {isMobile ? (
            <Button block style={{ marginBottom: 12 }} onClick={() => setMobileMenuOpen(true)}>
              分类：{categoryName(categoryId)}
            </Button>
          ) : null}

          {loading ? (
            <Flex justify="center" style={{ padding: 64 }}>
              <Spin tip="正在加载商品…" size="large" />
            </Flex>
          ) : null}

          {!loading && error ? <Card>{error}</Card> : null}

          {!loading && !error && visibleProducts.length === 0 ? (
            <Card>这个分类下暂时没有商品</Card>
          ) : null}

          {!loading && !error && visibleProducts.length > 0 ? (
            <Row gutter={[12, 12]}>
              {visibleProducts.map((product) => (
                <Col key={product.id} xs={12} sm={12} md={12} lg={8}>
                  <Card
                    hoverable
                    cover={
                      <div
                        className="product-cover"
                        style={{ background: product.color }}
                      />
                    }
                  >
                    <Flex justify="space-between" gap={8}>
                      <Text type="secondary">{product.category}</Text>
                      <Text type="secondary">库存 {product.stock}</Text>
                    </Flex>
                    <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>
                      {product.name}
                    </Title>
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ minHeight: 44 }}>
                      {product.desc}
                    </Paragraph>
                    <Flex justify="space-between" align="center" gap={8} wrap>
                      <Text strong>{formatPrice(product.price)}</Text>
                      <Button type="primary" size={isMobile ? 'small' : 'middle'} onClick={() => handleAdd(product)}>
                        加入购物车
                      </Button>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : null}
        </Col>
      </Row>

      <Drawer
        title="商品分类"
        placement="top"
        height="70vh"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {categoryTree}
      </Drawer>

      <Drawer
        title="购物车"
        placement={isMobile ? 'bottom' : 'right'}
        height={isMobile ? '78vh' : undefined}
        width={isMobile ? '100%' : 420}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        footer={
          <Flex justify="space-between" align="center" gap={12}>
            <Text>
              合计 <Text strong>{formatPrice(totalPrice)}</Text>
            </Text>
            <Button disabled={cartList.length === 0} onClick={() => setCartOpen(false)}>
              继续选购
            </Button>
          </Flex>
        }
      >
        {cartList.length === 0 ? (
          <Text type="secondary">还没有商品，去挑几件吧。</Text>
        ) : (
          <Flex vertical gap={16}>
            {cartList.map(({ product, qty }) => (
              <Flex key={product.id} justify="space-between" align="center" gap={12}>
                <Flex align="center" gap={10} style={{ minWidth: 0 }}>
                  <span className="cart-swatch" style={{ background: product.color }} />
                  <div style={{ minWidth: 0 }}>
                    <Text ellipsis style={{ display: 'block', maxWidth: isMobile ? 120 : 160 }}>
                      {product.name}
                    </Text>
                    <Text type="secondary">{formatPrice(product.price)}</Text>
                  </div>
                </Flex>
                <Space size={4}>
                  <Button size="small" onClick={() => handleQty(product.id, -1)}>
                    −
                  </Button>
                  <Text style={{ minWidth: 16, textAlign: 'center' }}>{qty}</Text>
                  <Button
                    size="small"
                    disabled={qty >= product.stock}
                    onClick={() => handleQty(product.id, 1)}
                  >
                    +
                  </Button>
                  <Button
                    type="link"
                    danger
                    size="small"
                    onClick={() => {
                      removeItem(product.id);
                      message.info('已从购物车移除');
                    }}
                  >
                    移除
                  </Button>
                </Space>
              </Flex>
            ))}
          </Flex>
        )}
      </Drawer>
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#0f766e',
          borderRadius: 10,
        },
      }}
    >
      <AntdApp>
        <Shop />
      </AntdApp>
    </ConfigProvider>
  );
}
