# Documentation Migration Commands

Commands to move markdown files to the new `docs/` structure while preserving `.kiro/` folder.

---

## 🚀 Quick Migration (One Command)

### Move Root-Level MD Files to docs/

```bash
# Move all .md files from root (except README.md) to docs/
find . -maxdepth 1 -name "*.md" ! -name "README.md" -exec mv {} docs/ \;
```

**This will move**:
- `CONTRIBUTING.md` → `docs/CONTRIBUTING.md`
- Any other root-level `.md` files

---

## 📂 Step-by-Step Migration

### Step 1: Create Directory Structure

```bash
# Create all subdirectories
mkdir -p docs/getting-started
mkdir -p docs/architecture
mkdir -p docs/guides
mkdir -p docs/design
mkdir -p docs/features
mkdir -p docs/status
mkdir -p docs/deployment
```

### Step 2: Move Root-Level Files

```bash
# Move CONTRIBUTING.md to docs/getting-started/
mv CONTRIBUTING.md docs/getting-started/

# Any other root MD files (if they exist)
find . -maxdepth 1 -name "*.md" ! -name "README.md" -exec echo "Found: {}" \;
```

### Step 3: List Files to Verify

```bash
# List all markdown files (excluding .kiro)
find . -name "*.md" ! -path "./.kiro/*" ! -path "./node_modules/*" ! -path "./.git/*"
```

Expected output:
```
./README.md (stays at root)
./docs/README.md (already created)
./docs/MIGRATION-MAP.md (already created)
./docs/getting-started/CONTRIBUTING.md (moved)
```

---

## 🔍 Find All MD Files (Excluding .kiro)

### List All MD Files Outside .kiro

```bash
find . -name "*.md" ! -path "./.kiro/*" ! -path "./node_modules/*" ! -path "./.git/*" ! -path "./docs/*"
```

### Count MD Files by Location

```bash
# Count files in .kiro (should stay)
echo ".kiro MD files (keeping these):"
find .kiro -name "*.md" | wc -l

# Count files in root (should move to docs)
echo "Root MD files (moving to docs):"
find . -maxdepth 1 -name "*.md" ! -name "README.md" | wc -l

# Count files in docs (new location)
echo "Docs MD files:"
find docs -name "*.md" 2>/dev/null | wc -l
```

---

## 🎯 Selective File Moves

### Move Specific Files (if needed)

```bash
# If you have any other markdown files in root:
# (Check first with find command)

# Example: Move if they exist
[ -f "CHANGELOG.md" ] && mv CHANGELOG.md docs/status/
[ -f "LICENSE.md" ] && mv LICENSE.md docs/
[ -f "SECURITY.md" ] && mv SECURITY.md docs/
```

---

## ✅ Verify Migration

### Check File Locations

```bash
echo "=== Files in docs/ ==="
ls -la docs/

echo -e "\n=== Files in docs/getting-started/ ==="
ls -la docs/getting-started/ 2>/dev/null || echo "Empty"

echo -e "\n=== Root MD files (should only be README.md) ==="
ls -la *.md 2>/dev/null

echo -e "\n=== .kiro MD files (should be unchanged) ==="
find .kiro -name "*.md" | head -5
echo "... (and more)"
```

---

## 📋 Summary of Commands

### Complete Migration Script

```bash
#!/bin/bash

echo "📂 Creating directory structure..."
mkdir -p docs/getting-started
mkdir -p docs/architecture
mkdir -p docs/guides
mkdir -p docs/design
mkdir -p docs/features
mkdir -p docs/status
mkdir -p docs/deployment

echo "📄 Moving root-level markdown files..."
# Move CONTRIBUTING.md if exists
[ -f "CONTRIBUTING.md" ] && mv CONTRIBUTING.md docs/getting-started/ && echo "✓ Moved CONTRIBUTING.md"

# Move any other root MD files (except README.md)
for file in *.md; do
    if [ "$file" != "README.md" ] && [ -f "$file" ]; then
        mv "$file" docs/ && echo "✓ Moved $file to docs/"
    fi
done

echo "✅ Migration complete!"
echo ""
echo "Files in docs/:"
ls -la docs/

echo ""
echo ".kiro files (unchanged):"
find .kiro -name "*.md" | wc -l
echo "MD files found in .kiro/"
```

Save this as `migrate-docs.sh` and run:
```bash
chmod +x migrate-docs.sh
./migrate-docs.sh
```

---

## 🚫 What NOT to Move

These should stay in `.kiro/`:

```bash
# DO NOT move these - they're for AI/tooling:
.kiro/steering/*.md
.kiro/specs/**/*.md
.kiro/README.md
.kiro/*.md (all kiro documentation)
```

---

## 🔄 Undo Migration (If Needed)

```bash
# Move files back from docs/ to root
mv docs/getting-started/CONTRIBUTING.md ./

# Or move all docs back (nuclear option)
# WARNING: This will overwrite!
find docs -maxdepth 1 -name "*.md" ! -name "README.md" ! -name "MIGRATION-MAP.md" -exec mv {} ./ \;
```

---

## 📊 Current State Check

### Run This First to See What Will Be Moved

```bash
echo "=== Current markdown file locations ==="
echo ""
echo "Root level (will move to docs/):"
find . -maxdepth 1 -name "*.md" ! -name "README.md"
echo ""
echo ".kiro files (will NOT move):"
find .kiro -name "*.md" | head -10
echo "... ($(find .kiro -name "*.md" | wc -l) total in .kiro)"
echo ""
echo "Already in docs/:"
find docs -name "*.md" 2>/dev/null | wc -l
```

---

## 🎯 Recommended Execution

### Safe Step-by-Step Process

1. **Check current state**:
   ```bash
   find . -maxdepth 1 -name "*.md"
   ```

2. **Create structure**:
   ```bash
   mkdir -p docs/getting-started docs/architecture docs/guides docs/design docs/features docs/status docs/deployment
   ```

3. **Move CONTRIBUTING.md**:
   ```bash
   mv CONTRIBUTING.md docs/getting-started/
   ```

4. **Verify**:
   ```bash
   ls -la docs/getting-started/
   ls -la .kiro/ | head
   ```

5. **Done!** ✅

---

## 📝 Notes

- ✅ `README.md` stays at root (project entry point)
- ✅ All `.kiro/` files stay in place (for AI/tooling)
- ✅ `node_modules/` and `.git/` are excluded
- ✅ New `docs/` structure is created
- ✅ Root-level MD files move to `docs/`

---

**Current Status**: 
- `.kiro/` has ~50 MD files (staying)
- Root has `README.md` (staying) + possibly `CONTRIBUTING.md` (moving)
- `docs/` has 2 new files (README.md, MIGRATION-MAP.md)

**After migration**:
- Root: `README.md` only
- `docs/`: All documentation
- `.kiro/`: Unchanged (AI/tooling files)

