import { useState, useEffect } from 'react'

const API_BASE_URL = 'https://doc.usbooths.com'

function App() {
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState(new Date())
  const [history, setHistory] = useState([])

  const checkHealth = async () => {
    setLoading(true)
    try {
      const startTime = Date.now()

      // Check API health
      const apiResponse = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }).catch(() => ({ ok: false }))

      const apiResponseTime = Date.now() - startTime
      const apiStatus = apiResponse.ok ? 'healthy' : 'unhealthy'

      // Check database connectivity (through a simple API endpoint)
      const dbStartTime = Date.now()
      const dbResponse = await fetch(`${API_BASE_URL}/api/users?limit=1`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }).catch(() => ({ ok: false }))

      const dbResponseTime = Date.now() - dbStartTime
      const dbStatus = dbResponse.ok ? 'healthy' : 'unhealthy'

      const overallStatus = apiStatus === 'healthy' && dbStatus === 'healthy' ? 'healthy' : 'degraded'

      const newHealthData = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        services: {
          api: {
            status: apiStatus,
            responseTime: apiResponseTime,
            endpoint: `${API_BASE_URL}/api/health`
          },
          database: {
            status: dbStatus,
            responseTime: dbResponseTime,
            endpoint: `${API_BASE_URL}/api/users`
          }
        },
        uptime: calculateUptime()
      }

      setHealthData(newHealthData)

      // Add to history (keep last 20 checks)
      setHistory(prev => {
        const newHistory = [{
          timestamp: new Date().toISOString(),
          status: overallStatus
        }, ...prev]
        return newHistory.slice(0, 20)
      })

    } catch (error) {
      console.error('Health check failed:', error)
      setHealthData({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {}
      })
    } finally {
      setLoading(false)
      setLastCheck(new Date())
    }
  }

  const calculateUptime = () => {
    // Calculate uptime percentage from history
    if (history.length === 0) return 100
    const healthyChecks = history.filter(h => h.status === 'healthy').length
    return ((healthyChecks / history.length) * 100).toFixed(2)
  }

  useEffect(() => {
    checkHealth()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      checkHealth()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return '#10b981'
      case 'degraded': return '#f59e0b'
      case 'unhealthy': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'healthy': return '✓'
      case 'degraded': return '⚠'
      case 'unhealthy': return '✗'
      default: return '?'
    }
  }

  if (loading && !healthData) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Checking API health...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🏥 US Booths API Health Monitor</h1>
        <p className="subtitle">Real-time API status and monitoring</p>
      </header>

      {/* Overall Status */}
      <div className="status-card main-status" style={{ borderLeft: `4px solid ${getStatusColor(healthData?.status)}` }}>
        <div className="status-header">
          <h2>System Status</h2>
          <span className={`status-badge ${healthData?.status}`}>
            {getStatusIcon(healthData?.status)} {healthData?.status?.toUpperCase()}
          </span>
        </div>
        <div className="status-details">
          <div className="detail-item">
            <span className="label">Last Check:</span>
            <span className="value">{lastCheck.toLocaleTimeString()}</span>
          </div>
          <div className="detail-item">
            <span className="label">Uptime (Last 20 checks):</span>
            <span className="value">{calculateUptime()}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Timestamp:</span>
            <span className="value">{new Date(healthData?.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <button onClick={checkHealth} className="refresh-button" disabled={loading}>
          {loading ? '🔄 Checking...' : '🔄 Refresh Now'}
        </button>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {healthData?.services && Object.entries(healthData.services).map(([serviceName, service]) => (
          <div key={serviceName} className="service-card" style={{ borderLeft: `4px solid ${getStatusColor(service.status)}` }}>
            <div className="service-header">
              <h3>{serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}</h3>
              <span className={`status-badge ${service.status}`}>
                {getStatusIcon(service.status)}
              </span>
            </div>
            <div className="service-details">
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`value ${service.status}`}>{service.status}</span>
              </div>
              <div className="detail-row">
                <span className="label">Response Time:</span>
                <span className="value">{service.responseTime}ms</span>
              </div>
              {service.endpoint && (
                <div className="detail-row">
                  <span className="label">Endpoint:</span>
                  <span className="value endpoint">{service.endpoint}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* History Timeline */}
      <div className="history-section">
        <h2>Recent Checks</h2>
        <div className="timeline">
          {history.map((check, index) => (
            <div key={index} className="timeline-item">
              <div
                className="timeline-dot"
                style={{ backgroundColor: getStatusColor(check.status) }}
                title={`${check.status} - ${new Date(check.timestamp).toLocaleString()}`}
              ></div>
            </div>
          ))}
        </div>
        <div className="timeline-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#10b981' }}></div>
            <span>Healthy</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Degraded</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Unhealthy</span>
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="info-section">
        <h2>API Information</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>📍 Base URL</h3>
            <code>{API_BASE_URL}</code>
          </div>
          <div className="info-card">
            <h3>📚 Documentation</h3>
            <a href={API_BASE_URL} target="_blank" rel="noopener noreferrer">
              View API Docs
            </a>
          </div>
          <div className="info-card">
            <h3>🔄 Auto-Refresh</h3>
            <p>Every 30 seconds</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>US Booths Health Monitor • Auto-refreshing every 30 seconds</p>
        <p className="footer-note">Monitoring {Object.keys(healthData?.services || {}).length} services</p>
      </footer>
    </div>
  )
}

export default App
