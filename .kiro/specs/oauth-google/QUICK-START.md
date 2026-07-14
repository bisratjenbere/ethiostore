# Google OAuth - 10 Minute Quick Start

**Status**: Ready to Implement  
**Time**: 10-15 minutes  

---

## ⚡ Fast Track Setup

### Step 1: Get Google Credentials (5 min)

1. **Go to**: https://console.cloud.google.com/
2. **Create Project** → Name: "ProStore" → Create
3. **Enable API**: Search "Google+ API" → Enable
4. **OAuth Consent**:
   - Go to: APIs & Services → OAuth consent screen
   - External → Create
   - App name: ProStore
   - Your email → Save
5. **Create Credentials**:
   - APIs & Services → Credentials
   - Create Credentials → OAuth Client ID
   - Web application
   - Name: ProStore Web
   - Authorized origins: `http://localhost:3000`
   - Redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Create
   - **COPY** Client ID & Secret

### Step 2: Update .env (1 min)

Add to your `.env` file:

```env
AUTH_GOOGLE_ID=your-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-secret
```

### Step 3: Test (2 min)

```bash
# Restart server
npm run dev

# Visit
http://localhost:3000/sign-in

# Click "Sign in with Google"
```

---

## ✅ Success Checklist

- [ ] Google button appears on sign-in page
- [ ] Google button appears on sign-up page
- [ ] Clicking opens Google auth
- [ ] After auth, redirected back logged in
- [ ] Name appears in header
- [ ] Cart preserved (if had items)

---

## 🎯 What You Get

**Before**:
```
Sign In
[Email input]
[Password input]
[Sign In button]
```

**After**:
```
Sign In
[🔵 Sign in with Google] ← NEW!
─── or continue with ───
[Email input]
[Password input]
[Sign In button]
```

---

## 🚨 Quick Troubleshooting

**"Missing AUTH_GOOGLE_ID"**
→ Check `.env` has the variables, restart server

**"Redirect URI mismatch"**
→ Check redirect URI is: `http://localhost:3000/api/auth/callback/google`

**Button doesn't appear**
→ Clear cache, hard refresh (Ctrl+Shift+R)

---

## 📚 Full Guide

See: `.kiro/specs/oauth-google/IMPLEMENTATION-GUIDE.md`

---

**That's it! Google OAuth in 10 minutes.** ✨

