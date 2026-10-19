import { useEffect, useState } from 'react';
import { fetchProducts } from './mock/products';
import { useCartStore } from './store/cart';

function formatPrice(value) {
  return `¥${value.toFixed(2)}`;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const items = useCartStore((s) => s.items);
  const cartList = Object.values(items);
  const totalCount = cartList.reduce((sum, row) => sum + row.qty, 0);
  const totalPrice = cartList.reduce(
    (sum, row) => sum + row.product.price * row.qty,
    0,
  );

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

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Demo Shop</p>
          <h1>商品选购</h1>
        </div>
        <button
          type="button"
          className="cart-btn"
          onClick={() => setCartOpen((v) => !v)}
        >
          购物车
          {totalCount > 0 ? <span className="badge">{totalCount}</span> : null}
        </button>
      </header>

      <main className="main">
        {loading ? (
          <div className="state-box" aria-live="polite">
            <div className="spinner" />
            <p>正在加载商品…</p>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="state-box error">
            <p>{error}</p>
          </div>
        ) : null}

        {!loading && !error ? (
          <section className="grid" aria-label="商品列表">
            {products.map((product) => (
              <article key={product.id} className="card">
                <div
                  className="thumb"
                  style={{ background: product.color }}
                  aria-hidden="true"
                />
                <div className="card-body">
                  <div className="meta">
                    <span className="tag">{product.category}</span>
                    <span className="stock">库存 {product.stock}</span>
                  </div>
                  <h2>{product.name}</h2>
                  <p className="desc">{product.desc}</p>
                  <div className="card-footer">
                    <strong>{formatPrice(product.price)}</strong>
                    <button type="button" onClick={() => addItem(product)}>
                      加入购物车
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </main>

      {cartOpen ? (
        <aside className="drawer" aria-label="购物车">
          <div className="drawer-head">
            <h2>购物车</h2>
            <button type="button" className="ghost" onClick={() => setCartOpen(false)}>
              关闭
            </button>
          </div>
          {cartList.length === 0 ? (
            <p className="empty">还没有商品，去挑几件吧。</p>
          ) : (
            <ul className="cart-list">
              {cartList.map(({ product, qty }) => (
                <li key={product.id}>
                  <div>
                    <p className="cart-name">{product.name}</p>
                    <p className="cart-sub">
                      {formatPrice(product.price)} × {qty}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => removeItem(product.id)}
                  >
                    移除
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="drawer-foot">
            <span>合计</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
