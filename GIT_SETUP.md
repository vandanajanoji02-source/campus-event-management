# Git & GitHub Setup Guide

## Initialize Git Repository

```bash
cd campus-event-management

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Campus Event Management System"
```

## Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "+" in top right → "New repository"
3. Name: `campus-event-management`
4. Description: "A MERN Stack Campus Event Management System for BCA freshers"
5. Choose "Public" or "Private"
6. Click "Create repository"

## Connect Local to GitHub

```bash
# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/campus-event-management.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

## Common Git Commands

### Before Making Changes
```bash
# See current branch
git branch

# See status of files
git status

# See commit history
git log --oneline
```

### Making Changes
```bash
# Create new feature branch
git checkout -b feature/add-notifications

# View differences
git diff

# Stage specific files
git add src/components/Navbar.js

# Or stage all changes
git add .

# Commit with message
git commit -m "Add notification feature"

# Push to GitHub
git push origin feature/add-notifications
```

### Creating Pull Requests
1. Push your branch to GitHub
2. Go to repository on GitHub
3. Click "Compare & pull request"
4. Add description
5. Request reviews
6. Merge to main after approval

## Branching Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Integration branch

### Feature Branches
```bash
git checkout -b feature/user-notifications
git checkout -b feature/event-filters
git checkout -b fix/login-bug
```

## .gitignore is Configured

The following files are already ignored:
- `node_modules/`
- `.env` (environment variables)
- `.DS_Store` (Mac files)
- Build artifacts

## GitHub Best Practices

### Commit Messages
✅ Good:
```
"Add user authentication with JWT"
"Fix event capacity validation"
"Update event search functionality"
```

❌ Bad:
```
"fixed stuff"
"update"
"asdhjkl"
```

### Pull Request Description Template
```markdown
## Description
What does this PR do?

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Attach screenshots of UI changes
```

## Collaboration Tips

1. **Before starting work**
   ```bash
   git pull origin main
   git checkout -b feature/your-feature
   ```

2. **While working**
   - Commit frequently with clear messages
   - Keep commits focused on one change

3. **Before merging**
   ```bash
   # Sync with latest main
   git pull origin main
   
   # Resolve any conflicts
   # Then push
   git push origin feature/your-feature
   ```

4. **Code Review Checklist**
   - Does it work as intended?
   - Is code clean and readable?
   - Are comments included?
   - Are tests passing?

## Setting Up CI/CD (Optional)

### GitHub Actions Example
Create `.github/workflows/test.yml`:
```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install backend dependencies
      run: cd backend && npm install
    
    - name: Install frontend dependencies
      run: cd frontend && npm install
    
    - name: Run linter
      run: cd backend && npm run lint
```

## Troubleshooting

### "Permission denied (publickey)"
- Generate SSH key: `ssh-keygen -t ed25519`
- Add to GitHub: Settings → SSH and GPG keys
- Use SSH URL instead of HTTPS

### "Merge conflicts"
```bash
# See conflicts
git status

# Edit files to resolve conflicts
# Then
git add .
git commit -m "Resolve merge conflicts"
git push
```

### "Accidentally committed to main"
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Create new branch
git checkout -b feature/correct-branch
git commit -m "correct message"
```

### "Want to see old version of file"
```bash
# Show file as it was in specific commit
git show COMMIT_HASH:path/to/file.js

# Revert file to previous version
git checkout COMMIT_HASH -- path/to/file.js
```

## Backup Strategy

Even though code is on GitHub:
- Regularly push code
- Use branches to keep history
- Tag releases: `git tag v1.0.0`
- Push tags: `git push --tags`

## References
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Your repository is ready for collaboration and deployment!** 🚀
