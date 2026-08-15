export default function SkeletonLoader({ type = 'cards' }) {
  if (type === 'cards') {
    return (
      <div className="skeleton-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-value" />
            <div className="skeleton-line skeleton-sub" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="skeleton-table">
        <div className="skeleton-table-header" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-table-row">
            <div className="skeleton-circle" />
            <div className="skeleton-line" style={{ width: '30%' }} />
            <div className="skeleton-line" style={{ width: '20%' }} />
            <div className="skeleton-line" style={{ width: '15%' }} />
          </div>
        ))}
      </div>
    );
  }

  return <div className="skeleton-block" />;
}
