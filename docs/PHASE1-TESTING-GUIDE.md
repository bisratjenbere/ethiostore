# Phase 1 - Testing Guide

**Design System**: Modern Minimalist (Navy & Amber)  
**Date**: July 13, 2026  
**Status**: Ready for Testing

---

## 🚀 Quick Start

To see the changes:

```bash
# Start the development server
npm run dev

# Open in browser
# http://localhost:3000
```

---

## 📋 Visual Testing Checklist

### Homepage (`/`)

#### Hero Section
- [ ] Badge displays with amber accent color
- [ ] Heading is large and responsive (shrinks on mobile)
- [ ] Subheading text is balanced and readable
- [ ] Two buttons side by side on desktop
- [ ] Buttons stack vertically on mobile
- [ ] Arrow icon animates on hover (Shop Now button)
- [ ] Button hover effects work (scale, shadow)

#### Value Propositions Section
- [ ] Light gray background section
- [ ] Three columns on desktop
- [ ] Single column on mobile
- [ ] Icon circles have light navy background
- [ ] Icons are navy colored
- [ ] Text is readable

#### Product Grid
- [ ] 2 columns on mobile (below 640px)
- [ ] 3 columns on tablet (640-1024px)
- [ ] 4 columns on desktop (1024px+)
- [ ] Cards have equal height
- [ ] Spacing is consistent (16px mobile, 24px desktop)

---

### Product Cards

#### Visual Elements
- [ ] Cards have subtle shadow at rest
- [ ] Shadow increases dramatically on hover
- [ ] Border removed (was visible before)
- [ ] Image fills aspect-square container
- [ ] Image zooms smoothly on hover (700ms)

#### Badges
- [ ] Featured badge shows amber background (if product is featured)
- [ ] Featured badge positioned top-left
- [ ] Low stock badge shows red (if stock < 10)
- [ ] Low stock badge positioned top-right
- [ ] Badges have proper z-index (visible over image)

#### Content Layout
- [ ] Brand name is uppercase with wide tracking
- [ ] Brand name is muted color
- [ ] Product name is 2 lines max (line-clamp-2)
- [ ] Product name has minimum height
- [ ] Product name turns navy on card hover

#### Rating Display
- [ ] 5 stars render correctly
- [ ] Filled stars are yellow
- [ ] Empty stars are gray
- [ ] Rating number shows in parentheses
- [ ] Stars are smaller on mobile

#### Price Section
- [ ] Border top separates price area
- [ ] Price is large and bold
- [ ] Out of stock badge shows when no stock
- [ ] Price responsive (18px mobile, 20px desktop)

---

### Header Component

#### Desktop View (1024px+)
- [ ] Header is sticky (stays at top when scrolling)
- [ ] Header has backdrop blur effect
- [ ] Header has semi-transparent background
- [ ] Logo and text visible side by side
- [ ] Logo scales slightly on hover
- [ ] Height is consistent (64px)
- [ ] Content is centered with max-width

#### Mobile View (< 1024px)
- [ ] App name text hidden
- [ ] Logo visible and clickable
- [ ] Menu component visible
- [ ] Spacing is appropriate
- [ ] Touch targets are 44px minimum

---

### Button Component

#### Default Variant
- [ ] Navy background color
- [ ] White text
- [ ] Rounded corners (12px)
- [ ] Shadow at rest (md)
- [ ] Scales to 105% on hover
- [ ] Shadow increases to lg on hover
- [ ] Scales to 95% on click/active
- [ ] Smooth 300ms transition
- [ ] Focus ring visible on keyboard focus

#### Size Variants
- [ ] Default: 40px height
- [ ] Small: 36px height
- [ ] Large: 48px height
- [ ] Icon: 40x40px square
- [ ] Padding scales appropriately

---

## 📱 Responsive Testing

### Mobile (375px - iPhone SE)
- [ ] Cards are 2 columns
- [ ] Typography is readable
- [ ] Touch targets are large enough
- [ ] Images don't overflow
- [ ] Spacing feels comfortable
- [ ] Hero text doesn't overflow

### Tablet (768px - iPad)
- [ ] Cards are 3 columns
- [ ] Header looks good
- [ ] Typography scales up
- [ ] Spacing increases
- [ ] Value props still readable

### Desktop (1920px)
- [ ] Cards are 4 columns
- [ ] Content has max-width (1152px)
- [ ] Doesn't look stretched
- [ ] Spacing is generous
- [ ] Typography is clear

---

## 🎨 Color Verification

### Navy (Primary)
- [ ] Header text
- [ ] Button backgrounds
- [ ] Card hover text color
- [ ] Icon circles (10% opacity)

### Amber (Accent)
- [ ] Featured badge
- [ ] Hero badge
- [ ] Call-to-action emphasis

### Yellow
- [ ] Filled rating stars only

### Gray
- [ ] Empty rating stars
- [ ] Muted text (brand names, descriptions)
- [ ] Value prop section background

---

## ⚡ Performance Testing

### Animation Smoothness
- [ ] Card hover zoom is smooth (no jank)
- [ ] Button scale is smooth
- [ ] No layout shift on hover
- [ ] 60fps maintained (check DevTools)

### Loading
- [ ] Images load progressively
- [ ] No cumulative layout shift
- [ ] Typography doesn't flash
- [ ] Colors apply immediately

### Lighthouse Scores
```bash
# Run Lighthouse audit
# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 90
```

---

## 🎯 Browser Compatibility

### Chrome/Edge (Chromium)
- [ ] Backdrop blur works
- [ ] Animations smooth
- [ ] Colors correct
- [ ] Layout correct

### Firefox
- [ ] Backdrop blur works
- [ ] Animations smooth
- [ ] Colors correct
- [ ] Layout correct

### Safari (Desktop)
- [ ] Backdrop blur works
- [ ] Animations smooth
- [ ] Colors correct (OKLCH support)
- [ ] Layout correct

### Safari (iOS)
- [ ] Touch interactions work
- [ ] Hover states don't stick
- [ ] Backdrop blur works
- [ ] Scrolling is smooth

### Chrome (Android)
- [ ] Touch interactions work
- [ ] Animations perform well
- [ ] Colors render correctly
- [ ] Layout is correct

---

## 🐛 Common Issues & Fixes

### Issue: Backdrop blur not working
**Symptom**: Header background is solid, no blur  
**Fix**: Check browser support for `backdrop-filter`  
**Fallback**: Semi-transparent background still works

### Issue: Images not loading
**Symptom**: Gray boxes instead of images  
**Fix**: Check image paths in database  
**Verify**: Images exist in public folder or Cloudinary

### Issue: Hover effects not smooth
**Symptom**: Choppy animations  
**Fix**: Check if hardware acceleration is enabled  
**Note**: Disable other tabs/apps consuming GPU

### Issue: Colors look different
**Symptom**: Navy looks wrong, amber too bright  
**Fix**: Check if browser supports OKLCH color space  
**Fallback**: Tailwind will use fallback colors

### Issue: Layout breaks on mobile
**Symptom**: Cards overflow or spacing weird  
**Fix**: Clear browser cache, hard refresh  
**Verify**: Check viewport meta tag in HTML

---

## ✅ Acceptance Criteria

Phase 1 is ready for production if:

### Visual Quality
- [ ] Design looks professional and modern
- [ ] Colors are consistent across pages
- [ ] Typography is readable at all sizes
- [ ] Spacing follows 8px grid
- [ ] Cards look polished

### Functionality
- [ ] All hover effects work
- [ ] Buttons are clickable
- [ ] Links navigate correctly
- [ ] Images load and display
- [ ] Badges show conditionally

### Responsiveness
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1920px)
- [ ] No horizontal scroll
- [ ] Touch targets adequate

### Performance
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Animations at 60fps
- [ ] No layout shift
- [ ] Fast page load

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text on images
- [ ] Semantic HTML

---

## 🔍 Testing Tools

### Browser DevTools
```
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network for failed requests
4. Use Device Toolbar for responsive testing
5. Use Performance tab for animations
```

### Lighthouse
```
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Desktop" or "Mobile"
4. Click "Generate report"
5. Review scores and suggestions
```

### Real Device Testing
```
Best practice:
- iPhone (iOS Safari)
- Android phone (Chrome)
- iPad (Safari)
- Test on actual devices, not just emulators
```

---

## 📸 Screenshot Comparison

### Before Phase 1
- Generic blue theme
- Basic cards
- No hover effects
- Plain header
- No hero section

### After Phase 1
- Professional navy & amber
- Enhanced cards with shadows
- Smooth animations
- Sticky header with blur
- Engaging hero section

**Take screenshots to compare!**

---

## 🎬 Video Testing

Record screen while:
1. Scrolling homepage
2. Hovering over product cards
3. Clicking buttons
4. Resizing browser window
5. Navigating between pages

**Check for**:
- Smooth scrolling
- No jank or stutter
- Proper state changes
- Responsive behavior

---

## 📊 Metrics to Track

### Before Deployment
- Current bounce rate
- Current time on site
- Current conversion rate
- Current mobile traffic %

### After Deployment
- Track for 1 week
- Compare metrics
- Look for improvements
- Gather user feedback

---

## 🎉 Sign-Off Checklist

Before marking Phase 1 as complete:

- [ ] All visual tests passed
- [ ] All responsive tests passed
- [ ] All performance tests passed
- [ ] No console errors
- [ ] Lighthouse score acceptable
- [ ] Tested on real mobile device
- [ ] Stakeholder approval received
- [ ] Screenshots documented
- [ ] Metrics baseline recorded

---

## 🚀 Ready to Test?

1. **Start server**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Follow checklist**: Mark items as you test
4. **Document issues**: Note any problems found
5. **Report results**: Share findings with team

---

## 📞 Support

If you encounter issues during testing:

1. Check this guide for common issues
2. Review implementation document
3. Check browser console for errors
4. Test in different browser
5. Clear cache and try again

---

**Happy Testing!** 🎨

**Design System Version**: 1.0  
**Phase**: 1 (Quick Wins)  
**Expected Testing Time**: 30-60 minutes
