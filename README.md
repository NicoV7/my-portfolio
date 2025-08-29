# Personal Portfolio

A modern, responsive personal portfolio website built with Next.js, showcasing projects and professional experience with smooth animations and a clean design.

## ✨ Features

- 🎨 **Modern Design** - Clean, professional interface with smooth animations
- 📱 **Responsive** - Optimized for all screen sizes and devices
- 🌙 **Dark/Light Mode** - Theme toggle with system preference detection
- ⚡ **Fast Performance** - Built with Next.js 15 and optimized for speed
- 🖼️ **Project Showcase** - Interactive project gallery with detailed modals
- 🎭 **Smooth Animations** - Framer Motion powered transitions and scroll effects
- 🎯 **TypeScript** - Full type safety and enhanced developer experience

## 🛠️ Technology Stack

- **Framework:** Next.js 15.3.5 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.11
- **Animations:** Framer Motion 12.23.0
- **Runtime:** React 19
- **Build Tool:** Turbopack (Next.js bundler)
- **Deployment Ready:** Vercel optimized

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 📁 Project Structure

```
my-portfolio/
├── public/                 # Static assets
│   ├── *.svg              # Icon files
│   └── ...
├── src/
│   └── app/               # Next.js App Router
│       ├── components/    # Reusable React components
│       │   ├── AnimatedPageWrapper.tsx    # Page transition animations
│       │   ├── FadeInOnScroll.tsx        # Scroll-triggered animations
│       │   ├── ImageScrolller.tsx        # Image gallery component
│       │   ├── ProjectModal.tsx          # Project detail modals
│       │   └── ThemeToggle.tsx           # Dark/light mode toggle
│       ├── projects/      # Projects showcase page
│       ├── api/          # API routes
│       ├── globals.css   # Global styles and Tailwind imports
│       ├── layout.tsx    # Root layout component
│       └── page.tsx      # Home page
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── next.config.ts       # Next.js configuration
```

## 🎨 Project Showcase

The portfolio features a dedicated projects section that includes:

- **Interactive Gallery** - Smooth scrolling image carousel
- **Project Modals** - Detailed project information in elegant overlays
- **Responsive Design** - Optimized viewing experience across all devices
- **Smooth Animations** - Fade-in effects and scroll-based interactions

### Adding New Projects

To add new projects to your showcase:

1. Update the project data in the relevant component
2. Add project images to the `public/` directory
3. Configure project details including title, description, technologies, and links

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing TypeScript and ESLint configuration
- Use Tailwind CSS for styling
- Implement responsive design principles
- Write clean, readable code with proper type annotations

## 🚢 Deployment

This portfolio is optimized for deployment on [Vercel](https://vercel.com):

1. Connect your repository to Vercel
2. Configure build settings (defaults work well)
3. Deploy with automatic builds on every push

For other platforms:
```bash
npm run build
npm start
```

## 📄 License

This project is for personal use. Feel free to fork and adapt for your own portfolio!

## 📞 Contact

For questions or collaboration opportunities, feel free to reach out through the contact form on the portfolio website.

---

⭐ **Star this repo if you found it helpful!**