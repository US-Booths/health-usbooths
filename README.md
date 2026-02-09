# US Booths API Health Monitor

Real-time health monitoring dashboard for the US Booths API.

## Features

- ✅ Real-time health checks for API and database services
- 🔄 Auto-refresh every 30 seconds
- 📊 Response time monitoring
- 📈 Historical uptime tracking (last 20 checks)
- 🎨 Professional UI with color-coded status indicators
- 📱 Fully responsive design

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients and animations

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit `http://localhost:3000` to view the dashboard.

## Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in Vercel
3. Set the domain to `health.usbooths.com`
4. Deploy!

## Environment

The dashboard monitors:
- **API Endpoint**: `https://doc.usbooths.com/api/health`
- **Database Check**: `https://doc.usbooths.com/api/users`

## Configuration

To change the API base URL, edit `API_BASE_URL` in `src/App.jsx`:

```javascript
const API_BASE_URL = 'https://doc.usbooths.com'
```

## DNS Configuration

To set up `health.usbooths.com`:

1. Go to AWS Route 53
2. Select the `usbooths.com` hosted zone
3. Create a new CNAME record:
   - **Name**: `health`
   - **Type**: `CNAME`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: `300`

## License

MIT
