import { CATEGORY_TREE } from './mock/products';

export default function CategoryMenu({ selectedId, onSelect, expanded, onToggle }) {
  return (
    <nav className="category-tree" aria-label="商品分类">
      <button
        type="button"
        className={`tree-item${selectedId === 'all' ? ' active' : ''}`}
        onClick={() => onSelect('all')}
      >
        全部
      </button>
      {CATEGORY_TREE.map((parent) => {
        const open = expanded.includes(parent.id);
        return (
          <div key={parent.id} className="tree-group">
            <div className="tree-parent">
              <button
                type="button"
                className={`tree-item${selectedId === parent.id ? ' active' : ''}`}
                onClick={() => onSelect(parent.id)}
              >
                {parent.name}
              </button>
              <button
                type="button"
                className="tree-chevron"
                aria-expanded={open}
                aria-label={open ? `收起${parent.name}` : `展开${parent.name}`}
                onClick={() => onToggle(parent.id)}
              >
                {open ? '−' : '+'}
              </button>
            </div>
            {open ? (
              <div className="tree-children">
                {parent.children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    className={`tree-item${selectedId === child.id ? ' active' : ''}`}
                    onClick={() => onSelect(child.id)}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
