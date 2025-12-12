# Konstantin Grotov - Personal Website

A modern, maintainable personal website built with Vue.js, TypeScript, Tailwind CSS, and Shadcn-Vue components. This site showcases my experience as a Machine Learning Researcher and my research publications.

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Migration Guide](MIGRATION_GUIDE.md)** - Migrate from old HTML site
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to GitHub Pages
- **[Checklist](CHECKLIST.md)** - Pre-deployment verification
- **This README** - Full project documentation

---

## 🚀 Features

- **Modern Stack**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS for utility-first styling
- **Components**: Shadcn-Vue for beautiful, accessible components
- **Data-Driven**: All content stored in JSON files for easy maintenance
- **Responsive**: Mobile-friendly design
- **Animations**: Custom typewriter effect on the home page
- **GitHub Pages**: Automated deployment via GitHub Actions

## 📁 Project Structure

```
vue-site/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn-Vue components
│   │   ├── Header.vue    # Site header with navigation
│   │   └── Footer.vue    # Site footer with social links
│   ├── views/
│   │   ├── Home.vue      # Home page with intro
│   │   ├── Experience.vue # Work experience timeline
│   │   └── Research.vue  # Publications list
│   ├── composables/
│   │   └── useTypewriter.ts # Typewriter effect logic
│   ├── data/
│   │   ├── profile.json      # Personal info & bio
│   │   ├── experience.json   # Work experience data
│   │   └── publications.json # Research publications
│   ├── router/
│   │   └── index.ts      # Vue Router configuration
│   └── lib/
│       └── utils.ts      # Utility functions
├── public/
│   └── images/          # Static images
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Pages deployment
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📝 Updating Content

### Profile Information

Edit `src/data/profile.json`:
```json
{
  "name": "Your Name",
  "location": "Your Location",
  "title": "Your Title",
  "titles": ["Title 1", "Title 2"],
  "bio": ["Paragraph 1", "Paragraph 2"],
  "image": "/images/your-image.jpg",
  "social": {
    "linkedin": "https://...",
    "scholar": "https://...",
    "github": "https://..."
  }
}
```

### Work Experience

Edit `src/data/experience.json`:
```json
[
  {
    "id": "unique-id",
    "date": "2024",
    "company": "Company Name",
    "description": "Your role description"
  }
]
```

### Publications

Edit `src/data/publications.json`:
```json
[
  {
    "id": "unique-id",
    "date": "2024",
    "title": "Paper Title",
    "venue": "Conference Name",
    "award": "Optional award text",
    "abstract": "Paper abstract",
    "link": "https://..."
  }
]
```

## 🚢 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Setup Steps:

1. **Push your code to GitHub**

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Build and deployment", select "GitHub Actions" as the source

3. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Automatic deployment:**
   - GitHub Actions will automatically build and deploy your site
   - Your site will be available at `https://yourusername.github.io/`

### Custom Domain (Optional):

1. Add a `CNAME` file in the `public/` directory with your domain
2. Configure your domain's DNS settings to point to GitHub Pages
3. Enable custom domain in repository settings

## 🎨 Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:
```javascript
colors: {
  'light-blue': '#87CEEB',
  'blue-active': '#2a8bcd',
  'dark-blue': '#1a5a7a',
}
```

### Fonts

The JetBrains Mono font is used for headings and code-like text. You can change fonts in:
- `tailwind.config.js` for Tailwind configuration
- `src/App.vue` for the font import

### Adding New Pages

1. Create a new component in `src/views/`
2. Add a route in `src/router/index.ts`
3. Add a navigation link in `src/components/Header.vue`

## 📦 Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend build tool
- **Vue Router** - Official router for Vue.js
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn-Vue** - Re-usable component library based on Radix Vue
- **Font Awesome** - Icon library

## 📄 License

This project is open source and available for personal use.

## 🙋‍♂️ Contact

Konstantin Grotov
- LinkedIn: [/in/grotov](https://www.linkedin.com/in/grotov/)
- GitHub: [@konstantgr](https://github.com/konstantgr/)
- Google Scholar: [Profile](https://scholar.google.com/citations?user=_CvGAcQAAAAJ&hl/)

---

Built with ❤️ using Vue.js, TypeScript, and Tailwind CSS
