# Git Workflow Migration Checklist

Track your progress migrating from the current workflow to the recommended GitHub Flow strategy.

## Phase 1: Foundation (Week 1)

### Documentation Setup
- [x] Read `.kiro/GIT-WORKFLOW-STRATEGY.md` - ✅ Created
- [x] Create `CONTRIBUTING.md` - ✅ Created
- [x] Create `.github/pull_request_template.md` - ✅ Created
- [x] Create `.github/CODEOWNERS` - ✅ Created
- [ ] Review and customize all templates for your needs

### Local Git Configuration
- [ ] Set up commit message template
  ```bash
  # Create template file
  curl -o ~/.gitmessage https://gist.githubusercontent.com/.../gitmessage
  # Configure git to use it
  git config --global commit.template ~/.gitmessage
  ```

- [ ] Configure pull strategy
  ```bash
  git config --global pull.rebase true
  ```

- [ ] Set up helpful aliases
  ```bash
  git config --global alias.lg "log --graph --oneline --decorate --all"
  git config --global alias.co checkout
  git config --global alias.cob "checkout -b"
  ```

- [ ] Configure default branch name
  ```bash
  git config --global init.defaultBranch main
  ```

### Branch Cleanup
- [ ] Document or delete `shadow-burglar` branch
  ```bash
  # If it's not needed
  git branch -D shadow-burglar
  git push origin --delete shadow-burglar
  
  # Or if it's a worktree
  git worktree remove .kilo/worktrees/shadow-burglar
  ```

- [ ] Verify only `main` remains
  ```bash
  git branch -a
  ```

## Phase 2: Branch Protection (Week 1)

### GitHub Settings Configuration

- [ ] Enable branch protection for `main`
  1. Go to: `Settings` → `Branches` → `Add rule`
  2. Branch name pattern: `main`

- [ ] Configure protection rules:
  - [ ] ✅ Require a pull request before merging
    - [ ] Required approvals: `0` (for solo dev) or `1` (if team grows)
    - [ ] ✅ Dismiss stale PR approvals when new commits are pushed
    - [ ] ✅ Require review from Code Owners
  
  - [ ] ✅ Require status checks to pass before merging
    - [ ] ✅ Require branches to be up to date before merging
    - Status checks (add after CI is set up):
      - [ ] `lint`
      - [ ] `type-check`
      - [ ] `build`
      - [ ] `migration-check`
  
  - [ ] ✅ Require conversation resolution before merging
  
  - [ ] ✅ Do not allow bypassing the above settings
  
  - [ ] ⬜ Allow force pushes (NEVER check this)
  
  - [ ] ⬜ Allow deletions (NEVER check this)

- [ ] Test branch protection
  ```bash
  # Try to push directly to main (should fail)
  git checkout main
  echo "test" >> test.txt
  git add test.txt
  git commit -m "test: verify protection"
  git push origin main  # Should be rejected
  
  # Clean up
  git reset --hard HEAD~1
  rm test.txt
  ```

### First PR Practice

- [ ] Create a test feature branch
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/test-workflow
  ```

- [ ] Make a small change
  ```bash
  echo "Testing workflow" >> README.md
  git add README.md
  git commit -m "docs(readme): test new workflow"
  ```

- [ ] Push and create PR
  ```bash
  git push -u origin feature/test-workflow
  # Open PR on GitHub
  ```

- [ ] Review your own PR
  - [ ] Check that PR template is used
  - [ ] Review the "Files changed" tab
  - [ ] Leave a comment
  - [ ] Approve (if needed)

- [ ] Merge with squash
  - [ ] Use "Squash and merge"
  - [ ] Verify commit message
  - [ ] Delete branch after merge

- [ ] Clean up locally
  ```bash
  git checkout main
  git pull origin main
  git branch -d feature/test-workflow
  ```

- [ ] Verify clean history
  ```bash
  git log --oneline -10
  # Should show single squashed commit
  ```

## Phase 3: CI/CD Pipeline (Week 2)

### GitHub Actions Setup

- [x] Create `.github/workflows/ci.yml` - ✅ Created

- [ ] Test CI locally (optional but recommended)
  ```bash
  # Install act (GitHub Actions local runner)
  # https://github.com/nektos/act
  
  # Run workflows locally
  act pull_request
  ```

- [ ] Create test PR to trigger CI
  ```bash
  git checkout -b feature/test-ci
  echo "// Test" >> lib/utils.ts
  git add lib/utils.ts
  git commit -m "test(ci): verify CI pipeline"
  git push -u origin feature/test-ci
  ```

- [ ] Verify CI runs on GitHub
  - [ ] Go to "Actions" tab
  - [ ] Verify all jobs run: `lint`, `type-check`, `build`, `migration-check`
  - [ ] Check that jobs complete successfully
  - [ ] Review logs if any job fails

- [ ] Add CI status checks to branch protection
  1. Go to: `Settings` → `Branches` → Edit `main` rule
  2. Under "Require status checks to pass"
  3. Add: `lint`, `type-check`, `build`, `migration-check`
  4. Save changes

- [ ] Test CI enforcement
  - [ ] Create PR with linting errors
  - [ ] Verify PR is blocked from merging
  - [ ] Fix errors and push
  - [ ] Verify PR becomes mergeable

- [ ] Clean up test branches
  ```bash
  git checkout main
  git pull origin main
  git branch -d feature/test-ci
  ```

### Optional: Additional CI Jobs

- [ ] Add test job (if you add tests later)
  ```yaml
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
  ```

- [ ] Add Prisma schema validation
  ```yaml
  - run: npx prisma validate
  - run: npx prisma format --check
  ```

## Phase 4: Deployment (Week 2-3)

### Vercel Setup (Recommended for Next.js)

- [ ] Sign up for Vercel account
  - Go to: https://vercel.com/signup

- [ ] Connect GitHub repository
  1. Click "New Project"
  2. Import from GitHub
  3. Select `ethiostore` repository
  4. Configure settings:
     - Framework: Next.js (auto-detected)
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`

- [ ] Configure environment variables
  - [ ] `DATABASE_URL` (production database)
  - [ ] `AUTH_SECRET` (generate new for production)
  - [ ] `STRIPE_SECRET_KEY` (use live keys, not test)
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET` (get from Stripe dashboard)
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `NEXT_PUBLIC_APP_NAME`
  - [ ] `NEXT_PUBLIC_SERVER_URL` (your production domain)
  - [ ] Email configuration (SMTP settings)

- [ ] Enable automatic deployments
  - [ ] Production: Deploy on push to `main`
  - [ ] Preview: Deploy on every PR
  - [ ] Comments: Enable Vercel bot comments on PRs

- [ ] Test deployment
  - [ ] Create a test PR
  - [ ] Verify preview deployment is created
  - [ ] Visit preview URL and test
  - [ ] Merge PR
  - [ ] Verify production deployment

- [ ] Set up custom domain (optional)
  - [ ] Add domain in Vercel settings
  - [ ] Configure DNS records
  - [ ] Verify SSL certificate

### Alternative: Manual Deployment Setup

If not using Vercel, document your deployment process:

- [ ] Document build command
- [ ] Document environment variables
- [ ] Document database migration steps
- [ ] Document deployment steps
- [ ] Create deployment script

## Phase 5: Release Management (Week 3-4)

### Initial Release

- [ ] Create first release tag
  ```bash
  git checkout main
  git pull origin main
  
  git tag -a v1.0.0 -m "Release v1.0.0 - Initial Production Release
  
  Features:
  - Product catalog with search and filtering
  - Shopping cart with session persistence
  - Complete checkout flow
  - Stripe payment integration
  - Admin panel for management
  - Email notifications
  - User authentication
  
  Tech Stack:
  - Next.js 16
  - PostgreSQL with Prisma
  - Stripe payments
  - Cloudinary images
  "
  
  git push origin v1.0.0
  ```

- [ ] Create GitHub Release
  1. Go to: https://github.com/bisratjenbere/ethiostore/releases/new
  2. Select tag: `v1.0.0`
  3. Release title: `v1.0.0 - Initial Release`
  4. Click "Generate release notes"
  5. Add any additional context
  6. Publish release

### Release Cadence

- [ ] Decide on release schedule
  - [ ] Weekly releases (recommended for active development)
  - [ ] Bi-weekly releases
  - [ ] Monthly releases
  - [ ] On-demand releases

- [ ] Document release process
  ```markdown
  1. Ensure all PRs for release are merged
  2. Update version in package.json (optional)
  3. Create release tag
  4. Create GitHub Release with notes
  5. Announce to users (if applicable)
  ```

### Hotfix Practice

- [ ] Practice hotfix workflow (use test scenario)
  ```bash
  # Simulate critical bug
  git checkout main
  git pull origin main
  git checkout -b hotfix/test-hotfix
  
  # Make fix
  echo "// Hotfix" >> lib/utils.ts
  git add lib/utils.ts
  git commit -m "fix(critical): test hotfix workflow
  
  This is a practice hotfix to test the process.
  
  Fixes #999"
  
  git push -u origin hotfix/test-hotfix
  ```

- [ ] Create hotfix PR
  - [ ] Label as "hotfix"
  - [ ] Mark as high priority
  - [ ] Skip approval if critical (document exception)

- [ ] Merge and tag
  ```bash
  # After merge
  git checkout main
  git pull origin main
  git tag -a v1.0.1 -m "Hotfix v1.0.1: Test hotfix"
  git push origin v1.0.1
  ```

- [ ] Document hotfix in releases

## Phase 6: Team Onboarding (When Team Grows)

### Documentation

- [ ] Add team members to GitHub repository
- [ ] Share `.kiro/GIT-WORKFLOW-QUICKSTART.md` with team
- [ ] Review `CONTRIBUTING.md` with team
- [ ] Schedule workflow training session

### Configuration Updates

- [ ] Update CODEOWNERS with new team members
  ```
  /app/admin/ @bisratjenbere @newteammember
  ```

- [ ] Adjust branch protection
  - [ ] Increase required approvals to `1` or more
  - [ ] Enable "Require review from Code Owners"

- [ ] Set up code review assignments
  - Go to: `Settings` → `Code review assignment`
  - Enable automatic review requests

## Ongoing Maintenance

### Weekly

- [ ] Review open PRs
- [ ] Merge approved PRs
- [ ] Clean up merged branches
  ```bash
  git remote prune origin
  git branch --merged main | grep -v 'main$' | xargs git branch -d
  ```

### Monthly

- [ ] Review and update documentation
- [ ] Check CI/CD performance
- [ ] Review branch protection rules
- [ ] Update dependencies
  ```bash
  git checkout -b chore/update-dependencies
  npm update
  npm audit fix
  git add package*.json
  git commit -m "chore(deps): update dependencies"
  ```

### Quarterly

- [ ] Review workflow effectiveness
- [ ] Update this checklist
- [ ] Train team on new practices
- [ ] Review and archive old releases

## Success Metrics

Track these metrics to measure workflow adoption:

- [ ] % of commits using conventional format: _____%
- [ ] % of changes going through PRs: _____%
- [ ] Average PR review time: _____ hours
- [ ] Number of direct commits to main: _____ (goal: 0)
- [ ] CI pass rate: _____%
- [ ] Number of hotfixes per month: _____
- [ ] Deployment frequency: _____ per week
- [ ] Failed deployments: _____ (goal: 0)

## Troubleshooting

### Common Issues

1. **Can't push to main**
   - ✅ Expected behavior - create a PR instead

2. **CI failing on PR**
   - Run checks locally first
   - Review CI logs on GitHub
   - Fix issues and push again

3. **Merge conflicts**
   - Update branch with `git rebase origin/main`
   - Resolve conflicts
   - Force push with `--force-with-lease`

4. **Lost changes**
   - Check `git reflog`
   - Recover with `git checkout <commit-hash>`

### Getting Help

- Review documentation in `.kiro/` folder
- Check GitHub issues
- Ask team members
- Review Git documentation: https://git-scm.com/doc

## Completion Certificate

When you've completed all phases:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   🎉 Git Workflow Migration Complete! 🎉                │
│                                                         │
│   Your repository now follows professional              │
│   git workflow practices used by senior                 │
│   engineering teams in production.                      │
│                                                         │
│   ✅ Branch protection enabled                          │
│   ✅ CI/CD pipeline configured                          │
│   ✅ Automated deployments                              │
│   ✅ Release management                                 │
│   ✅ Team onboarding ready                              │
│                                                         │
│   Next: Keep learning and improving!                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Date completed: ________________

---

Good luck with your migration! 🚀
