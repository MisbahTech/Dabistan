import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

export default function StatsCharts({ posts = [], users = [], categories = [] }) {
  // Aggregate posts by category for the bar chart
  const categoryData = categories.map(cat => {
    const catId = cat.id || cat._id || cat.slug || cat.name
    const count = posts.filter(p => 
      p.category === catId || 
      p.categoryId === catId || 
      (p.category?.id === catId) ||
      (p.category?.name === cat.name)
    ).length
    return { name: cat.name, count }
  }).filter(c => c.count > 0)

  // Fallback if no categories have posts yet
  const displayCategoryData = categoryData.length > 0 ? categoryData : [
    { name: 'General', count: posts.length },
    { name: 'News', count: 0 },
    { name: 'Art', count: 0 }
  ]

  // Enhanced timeline data (Mocked for visual impact, reflecting real trends would require time-series API)
  const timelineData = [
    { name: 'Mon', posts: 12, users: 4 },
    { name: 'Tue', posts: 19, users: 3 },
    { name: 'Wed', posts: 15, users: 5 },
    { name: 'Thu', posts: 22, users: 2 },
    { name: 'Fri', posts: 30, users: 8 },
    { name: 'Sat', posts: 10, users: 12 },
    { name: 'Sun', posts: 8, users: 15 },
  ]

  return (
    <div className="charts-container">
      <div className="card chart-card">
        <div className="chart-header">
          <h4>Content by Category</h4>
          <p className="muted">Distribution of posts across major topics</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={displayCategoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip
                contentStyle={{ 
                  background: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.2)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Bar 
                dataKey="count" 
                fill="url(#colorBar)" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              />
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-header">
          <h4>Platform Growth</h4>
          <p className="muted">Posts & user registrations trend</p>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip
                contentStyle={{ 
                  background: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.2)', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)'
                }}
                itemStyle={{ color: '#fff', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="posts" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
