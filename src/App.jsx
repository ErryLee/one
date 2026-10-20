import { useEffect, useState } from 'react';
import CategoryMenu from './CategoryMenu';
import { categoryIdsFor, categoryName, fetchProducts } from './mock/products';
import { useCartStore } from './store/cart';

function formatPrice(value) {
  return `¥${value.toFixed(2)}`;
}

let toastSeq = 0;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('all');
  const [expanded, setExpanded] = useState(['home', 'digital', 'wear']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

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

  function pushToast(message) {
    const id = ++toastSeq;
    setToasts((list) => [...list, { id, message }].slice(-3));
    window.setTimeout(() => {
      setToasts((list) => list.filter((item) => item.id !== id));
    }, 1800);
  }

  function handleAdd(product) {
    const result = addItem(product);
    if (!result.added) {
      pushToast(`库存不足，仅剩 ${result.stock} 件`);
      return;
    }
    pushToast(result.limited ? '已加入购物车，已达库存上限' : '已加入购物车');
  }

  function handleQty(productId, delta) {
    const row = items[productId];
    if (!row) return;
    const result = setQty(productId, row.qty + delta);
    if (result.removed) pushToast('已从购物车移除');
    else if (result.limited) pushToast(`库存不足，仅剩 ${result.stock} 件`);
  }

  function selectCategory(id) {
    setCategoryId(id);
    setMobileMenuOpen(false);
  }

  function toggleExpanded(id) {
    setExpanded((list) =>
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id],
    );
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

  useEffect(() => {
    if (!cartOpen) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [cartOpen]);

  return (
    <div className="page">
      <header className="header">
        <div className="header-text">
          <p className="eyebrow">Demo Shop</p>
          <h1>商品选购</h1>
        </div>
        <button
          type="button"
          className="cart-btn"
          onClick={() => setCartOpen(true)}
          aria-expanded={cartOpen}
          aria-controls="cart-panel"
        >
          购物车
          {totalCount > 0 ? <span className="badge">{totalCount}</span> : null}
        </button>
      </header>

      <div className="shop">
        <aside className="category-side">
          <p className="category-title">分类</p>
          <CategoryMenu
            selectedId={categoryId}
            onSelect={selectCategory}
            expanded={expanded}
            onToggle={toggleExpanded}
          />
        </aside>

        <main className="main">
          <div className="category-mobile">
            <button
              type="button"
              className="category-toggle"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span>分类：{categoryName(categoryId)}</span>
              <span>{mobileMenuOpen ? '收起' : '展开'}</span>
            </button>
            {mobileMenuOpen ? (
              <div className="category-panel">
                <CategoryMenu
                  selectedId={categoryId}
                  onSelect={selectCategory}
                  expanded={expanded}
                  onToggle={toggleExpanded}
                />
              </div>
            ) : null}
          </div>

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

          {!loading && !error && visibleProducts.length === 0 ? (
            <div className="state-box">
              <p>这个分类下暂时没有商品</p>
            </div>
          ) : null}

          {!loading && !error && visibleProducts.length > 0 ? (
            <section className="grid" aria-label="商品列表">
              {visibleProducts.map((product) => (
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
                      <button
                        type="button"
                        className="add-btn"
                        onClick={() => handleAdd(product)}
                      >
                        加入购物车
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : null}
        </main>
      </div>

      {cartOpen ? (
        <div className="cart-layer" role="presentation">
          <button
            type="button"
            className="cart-backdrop"
            aria-label="关闭购物车"
            onClick={() => setCartOpen(false)}
          />
          <aside
            id="cart-panel"
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="购物车"
          >
            <div className="drawer-handle" aria-hidden="true" />
            <div className="drawer-head">
              <h2>购物车</h2>
              <button
                type="button"
                className="ghost close-btn"
                onClick={() => setCartOpen(false)}
              >
                关闭
              </button>
            </div>
            {cartList.length === 0 ? (
              <p className="empty">还没有商品，去挑几件吧。</p>
            ) : (
              <ul className="cart-list">
                {cartList.map(({ product, qty }) => (
                  <li key={product.id}>
                    <div className="cart-item-main">
                      <span
                        className="cart-swatch"
                        style={{ background: product.color }}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="cart-name">{product.name}</p>
                        <p className="cart-sub">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <div className="qty">
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label={`减少${product.name}`}
                        onClick={() => handleQty(product.id, -1)}
                      >
                        −
                      </button>
                      <span className="qty-num">{qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label={`增加${product.name}`}
                        disabled={qty >= product.stock}
                        onClick={() => handleQty(product.id, 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => {
                          removeItem(product.id);
                          pushToast('已从购物车移除');
                        }}
                      >
                        移除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="drawer-foot">
              <div className="drawer-total">
                <span>合计</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
              <button
                type="button"
                className="checkout-btn"
                disabled={cartList.length === 0}
                onClick={() => setCartOpen(false)}
              >
                继续选购
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="toasts" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
