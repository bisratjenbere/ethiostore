# Git Workflow Quick Start Guide

Quick reference for daily git operations following our GitHub Flow workflow.

## Daily Commands

### Starting a New Feature

```bash
# 1. Update main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git add .
git commit -m "feat(scope): description of change"

# 4. Push to GitHub
git push -u origin feature/your-feature-name

# 5. Open PR on GitHub
# Visit: https://github.com/bisratjenbere/ethiostore/compare

# 6. After PR merged, clean up
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

### Fixing a Bug

```bash
git checkout main
git pull origin main
git checkout -b bugfix/issue-description

# Fix the bug
git add .
git commit -m "fix(scope): description of fix

Fixes #issue-number"

git push -u origin bugfix/issue-description
# Create PR
```

### Hotfix (Critical Production Bug)

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Fix immediately
git add .
git commit -m "fix(scope): critical fix description"

git push -u origin hotfix/critical-issue
# Create PR with HOTFIX label
# Merge immediately after CI passes
```

## Commit Message Format

```
<type>(<scope>): <subject>
```

### Common Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(products): add review system` |
| `fix` | Bug fix | `fix(cart): prevent negative quantity` |
| `docs` | Documentation | `docs(readme): update setup steps` |
| `style` | Formatting | `style(components): fix indentation` |
| `refactor` | Code improvement | `refactor(actions): simplify logic` |
| `chore` | Maintenance | `chore(deps): update dependencies` |

### Common Scopes

- `products` - Product features
- `cart` - Shopping cart
- `checkout` - Checkout flow
- `auth` - Authentication
- `admin` - Admin panel
- `payments` - Stripe/payments
- `db` - Database/Prisma
- `ui` - UI components

## Branch Names

```
feature/product-reviews
bugfix/cart-validation
hotfix/payment-webhook
chore/update-dependencies
docs/api-documentation
refactor/product-actions
```

## Before Creating PR

```bash
# Check code quality
npm run lint
npx tsc --noEmit
npm run build

# If errors, fix them
git add .
git commit -m "fix: resolve linting errors"
git push
```

## Updating Your Branch

```bash
# Get latest changes from main
git checkout feature/your-branch
git fetch origin
git rebase origin/main

# If conflicts, resolve them
# Then continue
git rebase --continue
git push --force-with-lease origin feature/your-branch
```

## Common Scenarios

### Made Changes on Wrong Branch

```bash
# Stash changes
git stash

# Switch to correct branch
git checkout -b feature/correct-branch

# Apply changes
git stash pop

# Commit
git add .
git commit -m "feat(scope): description"
```

### Accidentally Committed to Main

```bash
# BEFORE pushing
git reset --soft HEAD~1
git stash
git checkout -b feature/proper-branch
git stash pop
git add .
git commit -m "feat(scope): description"
```

### Need to Undo Last Commit

```bash
# Keep changes
git reset --soft HEAD~1

# Discard changes
git reset --hard HEAD~1
```

### Squash Multiple Commits Before PR

```bash
# Squash last 3 commits
git rebase -i HEAD~3

# In editor, change "pick" to "squash" for commits to merge
# Save and close
# Edit commit message
# Force push
git push --force-with-lease origin feature/your-branch
```

## CI Checks

### If CI Fails

1. Check GitHub Actions output
2. Run failing command locally:
   ```bash
   npm run lint        # If lint failed
   npx tsc --noEmit   # If type-check failed
   npm run build      # If build failed
   ```
3. Fix issues
4. Commit and push
5. CI will re-run automatically

## Release Tagging

```bash
# After merging to main
git checkout main
git pull origin main

# Create tag
git tag -a v1.2.0 -m "Release v1.2.0

Features:
- Feature 1
- Feature 2

Bug Fixes:
- Fix 1
"

# Push tag
git push origin v1.2.0

# Create GitHub Release
# Go to: https://github.com/bisratjenbere/ethiostore/releases/new
```

## Helpful Git Aliases

Add to `~/.gitconfig`:

```ini
[alias]
    # Quick status
    s = status -s
    
    # Pretty log
    lg = log --graph --oneline --decorate --all -20
    
    # Quick commit
    c = commit -m
    
    # Quick checkout
    co = checkout
    
    # Create branch
    cob = checkout -b
    
    # Update from main
    update = !git fetch origin && git rebase origin/main
    
    # Clean merged branches
    cleanup = !git branch --merged main | grep -v 'main$' | xargs git branch -d
    
    # Undo last commit (keep changes)
    undo = reset --soft HEAD~1
```

Usage:
```bash
git s                    # Status
git lg                   # Pretty log
git c "message"          # Quick commit
git co main              # Checkout main
git cob feature/new      # Create new branch
git update               # Update from main
git cleanup              # Delete merged branches
git undo                 # Undo last commit
```

## Pre-Commit Checklist

Before every commit:

- [ ] Code works locally
- [ ] No `console.log` statements
- [ ] No commented-out code
- [ ] Imports organized
- [ ] TypeScript types correct
- [ ] Follow existing patterns
- [ ] Commit message follows convention

## Pre-PR Checklist

Before creating PR:

- [ ] Branch name follows convention
- [ ] All commits follow conventional format
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] Tested feature locally
- [ ] Screenshots for UI changes
- [ ] Updated documentation
- [ ] No sensitive data in code

## Resources

- Full workflow guide: `.kiro/GIT-WORKFLOW-STRATEGY.md`
- Contribution guide: `CONTRIBUTING.md`
- Conventional Commits: https://www.conventionalcommits.org/

## Quick Help

```bash
# Forgot what branch you're on?
git branch --show-current

# See what changed?
git diff

# See what's staged?
git diff --cached

# See commit history
git log --oneline -10

# Check remote URL
git remote -v

# See all branches
git branch -a
```

## Emergency: Undo Everything

```bash
# Discard all local changes
git reset --hard HEAD

# Get back to main state
git checkout main
git reset --hard origin/main
```

⚠️ **Warning:** This will delete all local changes!

---

Keep this guide handy for quick reference! 🚀
