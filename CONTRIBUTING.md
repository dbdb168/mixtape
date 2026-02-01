# Contributing to Mixtape

Thank you for your interest in contributing to Mixtape! This document provides guidelines and information for contributors.

## 🎯 Project Philosophy

Mixtape was built to bring back the emotional art of making mixtapes. When contributing, please keep these principles in mind:

1. **Simplicity over features** - Don't add complexity unless it adds real value
2. **Privacy-first** - Minimize data collection, no tracking cookies
3. **Nostalgia matters** - The cassette aesthetic is intentional, maintain it
4. **Accessibility** - The app should work for everyone

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mixtape.git
   cd mixtape
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/mixtape.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your credentials (see `docs/manual-setup-steps.md`)

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📝 How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**Include in your bug report:**
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Console errors (if any)

### Suggesting Features

We love feature suggestions! Please include:
- Clear description of the feature
- Why it would be valuable
- Potential implementation approach
- Any relevant examples or mockups

### Pull Requests

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run build  # Ensure it builds without errors
   npm run lint   # Check for linting issues
   ```

4. **Commit with a clear message**
   ```bash
   git commit -m "feat: add amazing new feature"
   # or
   git commit -m "fix: resolve issue with track playback"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changes you made and why
   - Include screenshots for UI changes

## 📋 Code Style

### General Guidelines

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Keep components small and focused
- Use meaningful variable and function names

### File Naming

- React components: `PascalCase.tsx` (e.g., `TrackList.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDuration.ts`)
- Pages: lowercase with hyphens (e.g., `why-no-music/page.tsx`)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes (no code change)
refactor: code restructuring
test: add or update tests
chore: maintenance tasks
```

## 🏗️ Project Structure

```
src/
├── app/           # Next.js pages and API routes
├── components/    # Reusable React components
├── lib/           # Utilities, API clients, types
└── styles/        # Global styles and fonts
```

### Key Files

| File | Purpose |
|------|---------|
| `src/app/create/client.tsx` | Main create mixtape interface |
| `src/app/m/[token]/client.tsx` | Listen page for shared mixtapes |
| `src/lib/musickit/` | Apple Music API integration |
| `src/lib/supabase/` | Database client and types |
| `src/lib/email.ts` | SendGrid email integration |

## 🔐 Security Guidelines

**Never commit:**
- API keys or secrets
- `.env.local` files
- Private keys (`.pem`, `.p8`)
- User data or emails

**Always:**
- Use environment variables for secrets
- Validate and sanitize user input
- Follow the existing security patterns
- Report security vulnerabilities privately

## 🧪 Testing

Currently, the project doesn't have automated tests. This is a great area for contribution!

**Testing manually:**
1. Create a mixtape with various track counts (1, 5, 10)
2. Test both email and link sharing
3. Open shared links in different browsers
4. Check mobile responsiveness
5. Verify admin dashboard loads correctly

## 📚 Documentation

Documentation improvements are always welcome:
- Fix typos or unclear instructions
- Add missing information
- Improve code comments
- Create tutorials or guides

## 🎨 Design Guidelines

The visual design follows a "retro cassette" aesthetic:

- **Colors:** Dark purples (#1a0a28, #050210), primary purple (#a413ec)
- **Typography:** Pixel font for labels, handwriting font for cassette
- **UI Elements:** Boombox, cassette tapes, jewel cases
- **Animations:** Spinning reels, subtle glows

Please maintain visual consistency with existing designs.

## 💡 Ideas for Contribution

### Good First Issues
- Improve error messages
- Add loading states
- Fix mobile styling issues
- Improve accessibility (ARIA labels, keyboard nav)
- Add more preview samples

### Bigger Projects
- Spotify integration
- Reply mixtapes feature
- Collaborative mixtapes
- PWA/offline support
- Internationalization (i18n)
- Automated testing

## 📬 Getting Help

- **Questions:** Open a GitHub Discussion
- **Bugs:** Open a GitHub Issue
- **Security:** Email privately (don't open public issues)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Mixtape! 🎵
