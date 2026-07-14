# Kiro Project Documentation

Welcome to the ProStore e-commerce project documentation. This directory contains all the guidance and specifications needed to understand and complete this project.

## 📁 Directory Structure

```
.kiro/
├── README.md                          # This file - documentation guide
├── PROJECT-STATUS.md                  # Current status & quick reference
├── steering/                          # Always-active guidance files
│   ├── project-overview.md           # Project architecture & context
│   ├── coding-standards.md           # Code patterns & conventions
│   ├── database-patterns.md          # Prisma & database usage
│   └── component-patterns.md         # React component guidelines
└── specs/                            # Feature implementation specs
    └── order-management.md           # Order creation & history
```

## 🚀 Quick Start

### For AI Agents Starting Work

1. **Read First**: `PROJECT-STATUS.md` - Get immediate context on what's done and what's needed
2. **Understand Architecture**: `steering/project-overview.md` - Learn the tech stack and structure
3. **Learn Patterns**: Read relevant steering files based on your task:
   - Creating components? → `component-patterns.md`
   - Database work? → `database-patterns.md`
   - Server actions? → `coding-standards.md`
4. **Implement Feature**: Read the spec file for what you're building
5. **Follow Patterns**: Match existing code style exactly

### For Human Developers

All these files serve as comprehensive documentation for the project. They document:
- How the codebase is structured
- What patterns are used throughout
- What features exist and what's missing
- How to implement new features consistently

## 📚 File Descriptions

### `PROJECT-STATUS.md`
**Purpose**: Quick reference for project status
**Use When**: Starting any work session, need overview
**Contains**:
- Current completion status (80%)
- What's implemented vs what's missing
- Quick implementation guides
- Common issues and solutions

### `steering/project-overview.md`
**Purpose**: Complete project context
**Use When**: Need to understand the big picture
**Contains**:
- Technology stack details
- Database schema overview
- Project structure explanation
- Configuration details
- Development commands

### `steering/coding-standards.md`
**Purpose**: Code patterns and conventions
**Use When**: Writing any code (actions, components, forms)
**Contains**:
- File naming conventions
- Component structure patterns
- Server action patterns
- Form handling patterns
- Error handling patterns
- Import organization rules

### `steering/database-patterns.md`
**Purpose**: Prisma and database usage guide
**Use When**: Working with database operations
**Contains**:
- Prisma client setup
- Query patterns
- Mutation patterns
- Transaction patterns
- Data type handling
- Performance best practices

### `steering/component-patterns.md`
**Purpose**: React component guidelines
**Use When**: Creating or modifying UI components
**Contains**:
- Server vs client component rules
- Common component patterns
- Form component patterns
- Display component patterns
- Table patterns
- Accessibility guidelines

### `specs/order-management.md`
**Purpose**: Complete specification for order functionality
**Use When**: Implementing order creation, history, or details
**Contains**:
- Feature requirements
- Database operations needed
- Component specifications
- Testing checklist
- Implementation order

## 🎯 How to Use This Documentation

### Scenario 1: Implementing Order Management
```
1. Read: PROJECT-STATUS.md → See it's the #1 priority
2. Read: specs/order-management.md → Understand requirements
3. Reference: steering/coding-standards.md → Learn server action patterns
4. Reference: steering/database-patterns.md → Learn transaction patterns
5. Reference: steering/component-patterns.md → Learn component patterns
6. Implement following the patterns
7. Test using checklist in spec
```

### Scenario 2: Creating a New Component
```
1. Read: steering/component-patterns.md → Learn patterns
2. Find similar existing component → Use as reference
3. Follow the pattern exactly
4. Ensure proper TypeScript types
5. Handle all states (loading, error, empty, success)
```

### Scenario 3: Database Operation
```
1. Read: steering/database-patterns.md → Learn patterns
2. Check if operation needs transaction → Multi-step = YES
3. Follow transaction pattern from guide
4. Convert Decimals to strings for client
5. Revalidate affected paths
```

### Scenario 4: Understanding Project Status
```
1. Read: PROJECT-STATUS.md → Get quick overview
2. Check completion percentage
3. See what's blocking completion
4. Follow quick start guide for priority items
```

## 🔑 Key Principles

### 1. Pattern Consistency
All code should follow established patterns. Find similar existing code and match its structure.

### 2. Server-First
Use server components by default. Only use client components when you need:
- User interaction (onClick, onChange)
- React hooks (useState, useEffect)
- Browser APIs

### 3. Type Safety
Everything must be properly typed. No `any` types unless absolutely necessary.

### 4. Error Handling
All server actions must:
- Use try-catch blocks
- Return `{ success: boolean; message: string }`
- Use `formatError()` utility

### 5. Validation
All inputs must be validated with Zod schemas before processing.

### 6. Transactions
Multi-step database operations must use Prisma transactions for atomicity.

### 7. Revalidation
After data mutations, revalidate affected paths to keep UI in sync.

## 📖 Documentation Conventions

### Steering Files
- Always active (auto-included in AI context)
- Define patterns and rules
- Updated rarely, only when patterns change
- Named descriptively: `purpose-description.md`

### Spec Files
- Feature-specific implementation guides
- Detailed requirements and checklists
- Step-by-step implementation order
- Testing criteria
- Named after feature: `feature-name.md`

### Code Examples in Docs
All code examples are:
- ✅ Real patterns from the project
- ✅ Copy-paste ready
- ✅ Fully typed
- ✅ Production-ready

## 🛠️ Maintaining Documentation

### When to Update Steering Files
- New pattern introduced project-wide
- Technology stack changes
- Architectural decisions made
- Best practices evolved

### When to Update Spec Files
- Feature requirements change
- New features needed
- Testing criteria updated
- Implementation approach changes

### When to Update PROJECT-STATUS
- Feature completed
- New priority identified
- Blockers resolved
- Completion percentage changes

## 🎓 Learning Path

### For Complete Beginners
```
Day 1: Read project-overview.md
Day 2: Read coding-standards.md  
Day 3: Read database-patterns.md
Day 4: Read component-patterns.md
Day 5: Read order-management.md spec
Day 6: Start implementation
```

### For Experienced Developers
```
Step 1: Skim PROJECT-STATUS.md (5 min)
Step 2: Skim project-overview.md (10 min)
Step 3: Reference patterns as needed during work
Step 4: Read spec for feature you're implementing
```

## 🔍 Finding Information

### "How do I create a server action?"
→ `steering/coding-standards.md` → Server Actions Pattern

### "How do I use Prisma transactions?"
→ `steering/database-patterns.md` → Transaction Patterns

### "How do I build a form component?"
→ `steering/component-patterns.md` → Form Component Pattern

### "What needs to be built next?"
→ `PROJECT-STATUS.md` → Missing Features section

### "How do I implement orders?"
→ `specs/order-management.md` → Complete specification

### "What's the database schema?"
→ `steering/project-overview.md` → Database Schema section

### "What tech stack is used?"
→ `steering/project-overview.md` → Technology Stack section

## ✅ Best Practices

1. **Read Before Coding**: Always read relevant docs before starting
2. **Match Existing Patterns**: Find similar code and replicate the pattern
3. **Check Specs**: Follow implementation order in spec files
4. **Test Incrementally**: Don't wait until everything is done
5. **Update Docs**: If patterns change, update steering files
6. **Ask Questions**: If unclear, refer to similar existing code

## 🆘 Troubleshooting

### Can't Find Pattern
1. Check all steering files
2. Search existing codebase for similar code
3. Check specs for examples

### Pattern Conflicts
1. Steering files take precedence
2. Newer patterns override older ones
3. Consistency is key - match majority pattern

### Missing Information
1. Check PROJECT-STATUS for known gaps
2. Check similar features for guidance
3. Follow general Next.js/React best practices

## 🎯 Success Metrics

**Documentation is successful when:**
- ✅ AI agents can start working immediately
- ✅ Patterns are clear and consistent
- ✅ Examples are copy-paste ready
- ✅ All features have specs
- ✅ Status is always up to date

**Code is successful when:**
- ✅ Follows all steering file patterns
- ✅ Passes all spec checklists
- ✅ Handles all edge cases
- ✅ Maintains type safety
- ✅ Properly tested

## 📞 Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run lint            # Run ESLint

# Database
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open Prisma GUI
npx prisma db seed      # Seed database

# Testing
# (Manual testing - follow spec checklists)
```

## 🔗 Related Files

- **Root README**: `../README.md` - Project description
- **Prisma Schema**: `../prisma/schema.prisma` - Database models
- **Package JSON**: `../package.json` - Dependencies
- **Constants**: `../lib/constants/index.ts` - App configuration

---

**Remember**: This documentation is your guide to maintaining consistency and quality throughout the project. When in doubt, refer back to these files!

*Last Updated: When steering files and specs were created*
