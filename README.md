# 🔗 NeonSlug - Modern URL Shortener

Fast and modern URL shortener with analytics and link management features.

<p align="center">
  <img src="https://res.cloudinary.com/dy0av590l/image/upload/v1738119885/635shots_so_qrkija.png" alt="NeonSlug Dashboard Preview" width="800"/>
</p>

<div align="center">
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.1.2-000000?style=flat&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat&logo=typescript&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)
  ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
  ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel&logoColor=white)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
  
</div>

## 🌐 Live Demo

Check out the live demo: [neonslug.com](https://neonslug.com)

## ✨ Features

- **Link Management** - Store, edit, and organize your shortened URLs
- **Custom URLs** - Create branded short links with custom slugs
- **Advanced Analytics** - Track clicks, devices, and visitor insights
- **QR Code Generation** - Generate QR codes for easy mobile access
- **Expiry Control** - Set expiration dates for temporary links
- **Link Protection** - Secure links with password protection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16+
- Redis (via Upstash)
- Google OAuth credentials
- GitHub OAuth credentials

### Environment Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/neonslug.git
cd neonslug
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Auth Configuration
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/url_short?schema=public"

# Redis Configuration
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
```

4. Set up the database

```bash
npx prisma db push
```

5. Start the development server

```bash
npm run dev
```

6. Visit `http://localhost:3000`

## 🔧 Development

### Database Management

- Run migrations: `npx prisma migrate dev`
- Reset database: `npx prisma db reset`
- View data: `npx prisma studio`

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the project
2. Create your feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes and commit them

```bash
git commit -m 'Add some amazing feature'
```

4. Push to your branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

**Built with ❤️ by Samux**  
[![Twitter Follow](https://img.shields.io/twitter/follow/SamuxLoL?style=social)](https://twitter.com/SamuxLoL)![Twitter Follow](https://img.shields.io/twitter/follow/SamuxLoL?style=social)](<https://twitter.com/SamuxLoL>)
