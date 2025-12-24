# Quick Start - GitHub Upload & Vercel Deployment

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `basebook-lb`
3. Description: "Liquidity Book DEX on Base using TraderJoe V2 technology"
4. Choose Public or Private
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

## Step 2: Push Code to GitHub

```bash
# Remove old origin (if exists)
git remote remove origin

# Add your new repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/basebook-lb.git

# Push code
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click "Import" next to your `basebook-lb` repository
4. **Add Environment Variables**:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (get from https://cloud.walletconnect.com)
   - `NEXT_PUBLIC_BASE_SEPOLIA_RPC` = `https://sepolia.base.org`
5. Click "Deploy"
6. Wait 2-3 minutes for build to complete
7. Your site will be live at: `https://basebook-lb.vercel.app`

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
# Enter your WalletConnect Project ID

vercel env add NEXT_PUBLIC_BASE_SEPOLIA_RPC production
# Enter: https://sepolia.base.org

# Deploy to production
vercel --prod
```

## That's It!

Your BaseBook DEX is now live! 🎉

- **GitHub**: https://github.com/YOUR_USERNAME/basebook-lb
- **Vercel**: https://basebook-lb.vercel.app

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
