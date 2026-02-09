import { useState, useEffect } from 'react'

const API_BASE_URL = 'https://doc.usbooths.com'

// Endpoints organizados por categoría
const ENDPOINTS = {
  'PUBLIC API': [
    { name: 'API Health', path: '/api/health', method: 'GET' },
    { name: 'Get Users', path: '/api/users', method: 'GET' },
    { name: 'Get Products', path: '/api/products', method: 'GET' },
    { name: 'Get Categories', path: '/api/categories', method: 'GET' },
    { name: 'Get Galleries', path: '/api/galleries', method: 'GET' },
  ],
  'CLIENT/STORE': [
    { name: 'Get Home Data', path: '/api/home', method: 'GET' },
    { name: 'Get Cart', path: '/api/cart', method: 'GET' },
    { name: 'Get Orders', path: '/api/orders', method: 'GET' },
    { name: 'Get Quotes', path: '/api/quotes', method: 'GET' },
  ],
  'ADMIN PORTAL': [
    { name: 'Dashboard Stats', path: '/api/admin/dashboard', method: 'GET' },
    { name: 'Manage Users', path: '/api/admin/users', method: 'GET' },
    { name: 'Manage Products', path: '/api/admin/products', method: 'GET' },
    { name: 'Manage Orders', path: '/api/admin/orders', method: 'GET' },
  ],
  'CONTENT & CMS': [
    { name: 'Get Content', path: '/api/content', method: 'GET' },
    { name: 'Get Media', path: '/api/media', method: 'GET' },
    { name: 'Get Pages', path: '/api/pages', method: 'GET' },
  ]
}

function App() {
  const [endpointStatus, setEndpointStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState('PUBLIC API')
  const [overallStats, setOverallStats] = useState({
    total: 0,
    healthy: 0,
    unhealthy: 0,
    avgResponseTime: 0
  })

  const checkEndpoint = async (endpoint) => {
    const startTime = Date.now()
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: { 'Accept': 'application/json' }
      })

      const responseTime = Date.now() - startTime

      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime,
        statusCode: response.status,
        lastChecked: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        statusCode: 0,
        error: error.message,
        lastChecked: new Date().toISOString()
      }
    }
  }

  const checkAllEndpoints = async () => {
    setLoading(true)
    const newStatus = {}
    let totalHealthy = 0
    let totalEndpoints = 0
    let totalResponseTime = 0

    for (const category of Object.keys(ENDPOINTS)) {
      for (const endpoint of ENDPOINTS[category]) {
        const key = `${category}-${endpoint.path}`
        const status = await checkEndpoint(endpoint)
        newStatus[key] = status

        totalEndpoints++
        if (status.status === 'healthy') totalHealthy++
        totalResponseTime += status.responseTime
      }
    }

    setEndpointStatus(newStatus)
    setOverallStats({
      total: totalEndpoints,
      healthy: totalHealthy,
      unhealthy: totalEndpoints - totalHealthy,
      avgResponseTime: Math.round(totalResponseTime / totalEndpoints)
    })
    setLoading(false)
    setLastCheck(new Date())
  }

  useEffect(() => {
    checkAllEndpoints()

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      checkAllEndpoints()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    return status === 'healthy' ? '#10b981' : '#ef4444'
  }

  const getStatusIcon = (status) => {
    return status === 'healthy' ? '✓' : '✗'
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>US Booths API</h1>
          <p className="version">Health Monitor — v1.0</p>
        </div>

        <div className="sidebar-search">
          <input type="text" placeholder="Search endpoints..." />
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">GENERAL</div>
            <button
              className={`nav-item ${selectedCategory === 'Overview' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('Overview')}
            >
              Overview
            </button>
          </div>

          {Object.keys(ENDPOINTS).map(category => (
            <div key={category} className="nav-section">
              <div className="nav-label">{category}</div>
              <button
                className={`nav-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <h2>{selectedCategory}</h2>
          <button onClick={checkAllEndpoints} className="refresh-btn" disabled={loading}>
            {loading ? '🔄 Checking...' : '🔄 Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{overallStats.total}</div>
            <div className="stat-label">Total Endpoints</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#10b981' }}>{overallStats.healthy}</div>
            <div className="stat-label">Healthy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ef4444' }}>{overallStats.unhealthy}</div>
            <div className="stat-label">Unhealthy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{overallStats.avgResponseTime}ms</div>
            <div className="stat-label">Avg Response</div>
          </div>
        </div>

        {/* Base URL Section */}
        {selectedCategory === 'Overview' && (
          <>
            <div className="base-url-section">
              <h3>Base URL</h3>
              <div className="url-info">
                <div><strong>API Base:</strong> <span className="url">{API_BASE_URL}</span></div>
                <div><strong>Version:</strong> <span className="url">/api/v1/...</span></div>
              </div>
            </div>

            <div className="api-stats-section">
              <h3>API Statistics</h3>
              <ul>
                <li><strong>Public Endpoints:</strong> {ENDPOINTS['PUBLIC API'].length} endpoints (no authentication required)</li>
                <li><strong>Client/Store Endpoints:</strong> {ENDPOINTS['CLIENT/STORE'].length} endpoints (public store, mixed auth)</li>
                <li><strong>Admin Endpoints:</strong> {ENDPOINTS['ADMIN PORTAL'].length} endpoints (authentication required)</li>
                <li><strong>Content Endpoints:</strong> {ENDPOINTS['CONTENT & CMS'].length} endpoints (CMS integration)</li>
              </ul>
            </div>

            <div className="last-check-section">
              <p>Last Check: {lastCheck.toLocaleString()}</p>
              <p>Auto-refresh: Every 60 seconds</p>
            </div>
          </>
        )}

        {/* Endpoints List */}
        {selectedCategory !== 'Overview' && (
          <div className="endpoints-section">
            <h3>Endpoints</h3>
            <div className="endpoints-list">
              {ENDPOINTS[selectedCategory]?.map((endpoint) => {
                const key = `${selectedCategory}-${endpoint.path}`
                const status = endpointStatus[key]

                return (
                  <div key={key} className="endpoint-card">
                    <div className="endpoint-header">
                      <div className="endpoint-method">{endpoint.method}</div>
                      <div className="endpoint-name">{endpoint.name}</div>
                      {status && (
                        <div
                          className={`endpoint-status ${status.status}`}
                          style={{ color: getStatusColor(status.status) }}
                        >
                          {getStatusIcon(status.status)} {status.status}
                        </div>
                      )}
                    </div>
                    <div className="endpoint-path">{endpoint.path}</div>
                    {status && (
                      <div className="endpoint-metrics">
                        <span>Response: {status.responseTime}ms</span>
                        <span>Status Code: {status.statusCode || 'N/A'}</span>
                        <span className="endpoint-time">
                          Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    {status?.error && (
                      <div className="endpoint-error">
                        Error: {status.error}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
