export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary', onClick }) {
  return (
    <div className={`stats-card card-color-${color}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="stats-card-header">
        <span className="stats-title">{title}</span>
        <div className="stats-icon-wrapper">
          <Icon size={22} />
        </div>
      </div>
      <div className="stats-value">{value}</div>
      {subtitle && <div className="stats-subtitle">{subtitle}</div>}
    </div>
  );
}
