# Netlify Deployment Checklist

## Files Required for Deployment
- ✅ `index.html` (renamed from `Index.html`)
- ✅ `styles.css`
- ✅ `script.js`
- ✅ `_redirects` file
- ✅ `netlify.toml` file
- ✅ `package.json` file

## Common Issues & Solutions

### 1. File Case Sensitivity
- **Issue**: Netlify is case-sensitive, `Index.html` vs `index.html`
- **Solution**: Ensure all file names are lowercase

### 2. Path Issues
- **Issue**: Relative paths not working on Netlify
- **Solution**: Use absolute paths (`/styles.css` instead of `styles.css`)

### 3. CSS/JS Not Loading
- **Issue**: Assets not found on deployment
- **Solution**: Check file paths and ensure files exist in repository

### 4. Missing Sections
- **Issue**: Only header/footer showing
- **Solution**: Ensure CSS is loading properly

## Deployment Steps

1. **Rename Files** (if needed):
   ```bash
   mv Index.html index.html
   ```

2. **Update Git Repository**:
   ```bash
   git add .
   git commit -m "Fix Netlify deployment issues"
   git push origin main
   ```

3. **Check Netlify Build Log**:
   - Look for 404 errors for CSS/JS files
   - Verify all files are deployed

4. **Test Live Site**:
   - Check browser console for errors
   - Verify all sections are visible
   - Test theme toggle functionality

## Troubleshooting

### If Content Still Missing:
1. Check browser console (F12) for CSS/JS loading errors
2. Verify file names match exactly (case-sensitive)
3. Check Netlify build logs
4. Clear browser cache and reload

### If CSS Not Loading:
1. Check if `styles.css` exists in repository
2. Verify path in HTML is `/styles.css`
3. Check Netlify build logs for 404 errors

### If JS Not Working:
1. Check if `script.js` exists in repository
2. Verify path in HTML is `/script.js`
3. Check browser console for JavaScript errors

## Files Created/Fixed:
- `_redirects` - Handles routing for SPA
- `netlify.toml` - Netlify configuration
- `package.json` - Build configuration
- Updated `index.html` with absolute paths
