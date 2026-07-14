# Documentation Migration Map

This file maps old `.kiro` documentation locations to the new `docs/` structure.

---

## 📂 New Structure

```
docs/
├── README.md                          # Main documentation index
├── getting-started/
│   ├── PROJECT-OVERVIEW.md           # From .kiro/steering/project-overview.md
│   ├── QUICK-START.md                # New consolidated guide
│   └── CONTRIBUTING.md               # From /CONTRIBUTING.md
├── architecture/
│   ├── SYSTEM-DESIGN.md              # From .kiro/SYSTEM-DESIGN-UNDERSTANDING.md
│   ├── DATABASE-SCHEMA.md            # From prisma/schema.prisma + patterns
│   └── API-DESIGN.md                 # Server actions documentation
├── guides/
│   ├── CODING-STANDARDS.md           # From .kiro/steering/coding-standards.md
│   ├── DATABASE-PATTERNS.md          # From .kiro/steering/database-patterns.md
│   ├── COMPONENT-PATTERNS.md         # From .kiro/steering/component-patterns.md
│   └── TESTING-GUIDE.md              # From .kiro/TESTING-GUIDE.md
├── design/
│   ├── DESIGN-OVERVIEW.md            # From .kiro/DESIGN-SYSTEM-OVERVIEW.md
│   ├── DESIGN-TOKENS.md              # From .kiro/DESIGN-SYSTEM-SUMMARY.md
│   ├── COMPONENTS.md                 # From .kiro/DESIGN-SYSTEM-COMPONENTS-COMPLETE.md
│   ├── ANIMATIONS.md                 # From .kiro/DESIGN-SYSTEM-ANIMATIONS.md
│   └── MOBILE-DESIGN.md              # From .kiro/DESIGN-SYSTEM-MOBILE.md
├── features/
│   ├── STRIPE-INTEGRATION.md         # From .kiro/STRIPE-COMPLETE.md + guides
│   ├── EMAIL-NOTIFICATIONS.md        # From .kiro/EMAIL-SETUP-COMPLETE.md
│   ├── GOOGLE-OAUTH.md               # From .kiro/GOOGLE-OAUTH-COMPLETE.md
│   ├── CLOUDINARY-SETUP.md           # From .kiro/CLOUDINARY-SETUP.md
│   ├── ADMIN-PANEL.md                # From .kiro/ADMIN-PANEL-COMPLETE.md
│   ├── PRODUCT-SEARCH.md             # From .kiro/specs/product-search-filter/
│   └── IMAGE-UPLOAD.md               # From .kiro/specs/image-upload/
├── status/
│   ├── PROJECT-STATUS.md             # From .kiro/PROJECT-STATUS.md
│   ├── FEATURE-AUDIT.md              # From .kiro/FEATURE-AUDIT-REPORT.md
│   ├── REMAINING-FEATURES.md         # From .kiro/REMAINING-FEATURES.md
│   └── CHANGELOG.md                  # New file for version history
└── deployment/
    ├── DEPLOYMENT-GUIDE.md           # From .kiro/WHATS-NEXT.md + deployment info
    ├── ENVIRONMENT-SETUP.md          # From .env.example with explanations
    └── TROUBLESHOOTING.md            # From various troubleshooting sections
```

---

## 🔄 File Mappings

### Getting Started
| New Location | Old Location | Status |
|--------------|--------------|--------|
| `docs/getting-started/PROJECT-OVERVIEW.md` | `.kiro/steering/project-overview.md` | ✅ Move |
| `docs/getting-started/QUICK-START.md` | `.kiro/GETTING-STARTED.md` + `.kiro/README.md` | ✅ Consolidate |
| `docs/getting-started/CONTRIBUTING.md` | `/CONTRIBUTING.md` | ✅ Move |

### Architecture
| New Location | Old Location | Status |
|--------------|--------------|--------|
| `docs/architecture/SYSTEM-DESIGN.md` | `.kiro/SYSTEM-DESIGN-UNDERSTANDING.md` | ✅ Move |
| `docs/architecture/DATABASE-SCHEMA.md` | Extract from `prisma/schema.prisma` | ✅ Create |
| `docs/architecture/API-DESIGN.md` | Extract from coding-standards.md | ✅ Create |

### Development Guides
| New Location | Old Location | Status |
|--------------|--------------|--------|
| `docs/guides/CODING-STANDARDS.md` | `.kiro/steering/coding-standards.md` | ✅ Move |
| `docs/guides/DATABASE-PATTERNS.md` | `.kiro/steering/database-patterns.md` | ✅ Move |
| `docs/guides/COMPONENT-PATTERNS.md` | `.kiro/steering/component-patterns.md` | ✅ Move |
| `docs/guides/TESTING-GUIDE.md` | `.kiro/TESTING-GUIDE.md` | ✅ Move |

### Design System
| New Location | Old Location | Status |
|--------------|--------------|--------|
| `docs/design/DESIGN-OVERVIEW.md` | `.kiro/DESIGN-SYSTEM-OVERVIEW.md` | ✅ Move |
| `docs/design/DESIGN-TOKENS.md` | `.kiro/DESIGN-SYSTEM-SUMMARY.md` | ✅ Move |
| `docs/design/COMPONENTS.md` | `.kiro/DESIGN-SYSTEM-COMPONENTS-COMPLETE.md` | ✅ Move |
| `docs/design/ANIMATIONS.md` | `.kiro/DESIGN-SYSTEM-ANIMATIONS.md` | ✅ Move |
| `docs/design/MOBILE-DESIGN.md` | `.kiro/DESIGN-SYSTEM-MOBILE.md` | ✅ Move |

### Features & Integrations
| New Location | Old Location | Status |
|--------------|--------------|--------|
| `docs/features/STRIPE-INTEGRATION.md` | `.kiro/STRIPE-COMPLETE.md` + specs | ✅ Consolidate |
| `docs/features/EMAIL-NOTIFICATIONS.md` | `.kiro/EMAIL-SETUP-COMPLETE.md` + specs | ✅ Consolidate |
| `docs/features/GOOGLE-OAUTH.md` | `.kiro/GOOGLE-OAUTH-COMPLETE.md` + specs | ✅ Consolidate |
| `docs/features/CLOUDINARY-SETUP.md` | `.kiro/CLOUDINARY-SETUP.md` + specs | ✅ Consolidate |
| `docs/features/ADMIN-PANEL.md` | `.kiro/ADMIN-PANEL-COMPLETE.md` + specs | ✅ Consolidate |
| `docs/features/PRODUCT-SEARCH.md` | `.kiro/specs/product-search-filter/*` | ✅ Consolidate |
| `docs/features/IMAGE-UPLOAD.md` | `.kiro/specs/image-upload/*` | ✅ Consolidate |

### Project Status
| New Location | Old Location | Status |
|--------------|--------------|--------|
| `docs/status/PROJECT-STATUS.md` | `.kiro/PROJECT-STATUS.md` | ✅ Move |
| `docs/status/FEATURE-AUDIT.md` | `.kiro/FEATURE-AUDIT-REPORT.md` | ✅ Move |
| `docs/status/REMAINING-FEATURES.md` | `.kiro/REMAINING-FEATURES.md` | ✅ Move |
| `docs/status/CHANGELOG.md` | Various *-COMPLETE.md files | ✅ Create |

### Deployment
| New Location | Old Location | Status |
|--------------|--------------|--------|
| `docs/deployment/DEPLOYMENT-GUIDE.md` | `.kiro/WHATS-NEXT.md` + deployment notes | ✅ Consolidate |
| `docs/deployment/ENVIRONMENT-SETUP.md` | `.env.example` + setup guides | ✅ Create |
| `docs/deployment/TROUBLESHOOTING.md` | Various troubleshooting sections | ✅ Consolidate |

---

## 📦 Files to Keep in .kiro/

Some files should stay in `.kiro/` for tooling/AI purposes:

### Steering Files (Active Patterns)
- `.kiro/steering/project-overview.md` - Keep for AI context
- `.kiro/steering/coding-standards.md` - Keep for AI context
- `.kiro/steering/database-patterns.md` - Keep for AI context
- `.kiro/steering/component-patterns.md` - Keep for AI context

**Reason**: These are actively loaded by AI agents during development

### Spec Files (Feature Implementations)
- `.kiro/specs/*/` - Keep all spec directories
  - `admin-panel/`
  - `email-notifications/`
  - `image-upload/`
  - `oauth-google/`
  - `product-search-filter/`
  - `stripe-payment/`
  - `order-management.md`

**Reason**: These contain step-by-step implementation checklists

---

## 🗑️ Files to Archive/Remove

These files are outdated or superseded:

### Deprecated Design Files
- `.kiro/DESIGN-IMPLEMENTATION-SUMMARY.md` - Superseded by COMPONENTS.md
- `.kiro/DESIGN-SYSTEM-PHASE1-COMPLETE.md` - Historical, archive
- `.kiro/DESIGN-SYSTEM-PAGES.md` - Incorporated into other docs
- `.kiro/PHASE2-COMPLETE-SUMMARY.md` - Historical, archive
- `.kiro/PHASE1-TESTING-GUIDE.md` - Superseded by TESTING-GUIDE.md

### Deprecated Status Files
- `.kiro/IMPLEMENTATION-COMPLETE.md` - Historical
- `.kiro/FINAL-SUMMARY.md` - Superseded by PROJECT-STATUS.md
- `.kiro/FEATURE-PRIORITY-SUMMARY.md` - Incorporated into REMAINING-FEATURES.md
- `.kiro/WHAT-YOU-HAVE-VS-NEED.md` - Incorporated into FEATURE-AUDIT.md

### Deprecated UX Files
- `.kiro/UX-AUDIT-ANALYSIS.md` - Historical analysis
- `.kiro/UX-GAPS-ANALYSIS.md` - Issues resolved
- `.kiro/UX-IMPROVEMENTS-COMPLETE.md` - Historical

### Deprecated Workflow Files
- `.kiro/WORKFLOW-SUMMARY.md` - Incorporated into CONTRIBUTING.md
- `.kiro/WORKFLOW-IMPLEMENTATION-COMPLETE.md` - Historical
- `.kiro/WORKFLOW-MIGRATION-CHECKLIST.md` - Completed
- `.kiro/GIT-WORKFLOW-QUICKSTART.md` - Incorporated into CONTRIBUTING.md
- `.kiro/GIT-WORKFLOW-STRATEGY.md` - Incorporated into CONTRIBUTING.md
- `.kiro/GIT-RECOVERY-NOTES.md` - Historical

### Deprecated Homepage Files
- `.kiro/HOMEPAGE-PRODUCTION-ANALYSIS.md` - Historical
- `.kiro/HOMEPAGE-INTEGRATION-COMPLETE.md` - Completed
- `.kiro/HOMEPAGE-IMPLEMENTATION-GUIDE.md` - Completed
- `.kiro/HOMEPAGE-QUICK-REFERENCE.md` - Superseded
- `.kiro/HOMEPAGE-READY-SUMMARY.md` - Superseded
- `.kiro/HOMEPAGE-BEFORE-AFTER.md` - Historical

### Deprecated Setup Files
- `.kiro/STRIPE-SETUP.md` - Superseded by STRIPE-INTEGRATION.md
- `.kiro/STRIPE-INTEGRATION-GUIDE.md` - Consolidated
- `.kiro/STRIPE-TESTING-CHECKLIST.md` - Incorporated
- `.kiro/STRIPE-VISUAL-SUMMARY.md` - Incorporated

### Deprecated Feature Files
- `.kiro/NEXT-FEATURES-ROADMAP.md` - Superseded by REMAINING-FEATURES.md
- `.kiro/NEXT-STEPS.md` - Superseded by WHATS-NEXT.md
- `.kiro/IMAGE-UPLOAD-FEATURE-SUMMARY.md` - Superseded by docs

---

## ✅ Migration Checklist

### Phase 1: Create New Structure (Done)
- [x] Create `docs/` directory
- [x] Create subdirectories (getting-started, architecture, guides, design, features, status, deployment)
- [x] Create `docs/README.md` index

### Phase 2: Move Core Documentation
- [ ] Move steering files to `docs/guides/`
- [ ] Move design system files to `docs/design/`
- [ ] Move status files to `docs/status/`
- [ ] Consolidate feature docs to `docs/features/`

### Phase 3: Create New Consolidated Files
- [ ] Create `docs/architecture/DATABASE-SCHEMA.md`
- [ ] Create `docs/architecture/API-DESIGN.md`
- [ ] Create `docs/getting-started/QUICK-START.md`
- [ ] Create `docs/deployment/ENVIRONMENT-SETUP.md`
- [ ] Create `docs/deployment/TROUBLESHOOTING.md`
- [ ] Create `docs/status/CHANGELOG.md`

### Phase 4: Update References
- [ ] Update README.md links
- [ ] Update CONTRIBUTING.md links
- [ ] Update internal doc cross-references
- [ ] Update .gitignore if needed

### Phase 5: Archive Old Files
- [ ] Move deprecated files to `.kiro/archive/`
- [ ] Update .kiro/README.md with new structure
- [ ] Keep active steering and spec files

---

## 🎯 Benefits of New Structure

### For Developers
✅ **Clearer organization** - Grouped by purpose  
✅ **Easier navigation** - Logical hierarchy  
✅ **Better discoverability** - Topic-based folders  
✅ **Less redundancy** - Consolidated similar docs  

### For Documentation
✅ **Professional structure** - Industry standard  
✅ **Maintainable** - Clear ownership per topic  
✅ **Scalable** - Easy to add new docs  
✅ **Version control** - Cleaner git history  

### For Project
✅ **More professional** - Standard docs/ folder  
✅ **Better onboarding** - Clear entry points  
✅ **Reduced confusion** - No duplicate info  
✅ **Easier deployment** - Could publish to docs site  

---

## 📝 Notes

- `.kiro/steering/` files should remain for AI agent context
- `.kiro/specs/` files should remain for implementation tracking
- Historical files should be moved to `.kiro/archive/` for reference
- Main `README.md` should link to `docs/README.md`

---

**Status**: Planning Complete  
**Ready for**: Migration Execution  
**Estimated Time**: 30-45 minutes

