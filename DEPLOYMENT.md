# Deployment Guide

This guide explains how to deploy BaseBook to Vercel and upload it to a new GitHub repository.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Git installed on your machine
- Node.js 18+ installed

## Part 1: Create New GitHub Repository

### Step 1: Create Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Configure your repository:
   - **Repository name**: `basebook-lb` (or your preferred name)
   - **Description**: "Liquidity Book DEX on Base using TraderJoe V2 technology"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Push Code to GitHub

Open terminal in your project directory and run:

```bash
# Remove the old origin (if exists)
git remote remove origin

# Add your new repository as origin
git remote add origin https://github.com/YOUR_USERNAME/basebook-lb.git

# Verify the remote
git remote -v

# Push all branches
git push -u origin main

# If you want to also push the fix branch
git push -u origin claude/fix-liquidity-addition-dLsJy
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Verify Upload

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/basebook-lb`
2. Verify all files are uploaded
3. Check that README.md displays correctly

## Part 2: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Repository**
   - Click **"Add New..."** → **"Project"**
   - Select **"Import Git Repository"**
   - Find and select `basebook-lb` from your repositories
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**

   Click **"Environment Variables"** and add:

   | Name | Value | Description |
   |------|-------|-------------|
   | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your WalletConnect ID | Get from [cloud.walletconnect.com](https://cloud.walletconnect.com) |
   | `NEXT_PUBLIC_BASE_SEPOLIA_RPC` | `https://sepolia.base.org` | Base Sepolia RPC URL (optional) |

   **Note**: If you don't have a WalletConnect Project ID, you can skip it or create one:
   - Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
   - Create a new project
   - Copy the Project ID

5. **Deploy**
   - Click **"Deploy"**
   - Wait for the build to complete (2-3 minutes)
   - You'll get a deployment URL like: `https://basebook-lb.vercel.app`

### Method 2: Deploy via Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? Select your account
# - Link to existing project? N
# - Project name? basebook-lb
# - Directory? ./
# - Override settings? N

# After deployment, add environment variables:
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
# Enter your WalletConnect Project ID when prompted

vercel env add NEXT_PUBLIC_BASE_SEPOLIA_RPC production
# Enter: https://sepolia.base.org

# Redeploy with environment variables
vercel --prod
```

## Part 3: Post-Deployment Configuration

### 1. Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your domain and follow DNS configuration instructions

### 2. Enable Analytics

Vercel Analytics is already integrated via `@vercel/analytics` package. It will automatically start tracking once deployed.

### 3. Configure Production Environment

For production deployment on Base mainnet (not just Sepolia testnet):

1. Update `/lib/contracts/addresses.ts` with mainnet contract addresses
2. Update environment variables in Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add production-specific values if needed

### 4. Set Up Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request or push to other branches

To configure:
1. Go to **Settings** → **Git**
2. Configure branch settings as needed

## Part 4: Monitoring and Maintenance

### Check Deployment Status

```bash
# View recent deployments
vercel ls

# Check deployment logs
vercel logs YOUR_DEPLOYMENT_URL
```

### Update Deployment

When you push changes to GitHub, Vercel will automatically rebuild and deploy:

```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

### Rollback Deployment

If something goes wrong:

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Find a previous working deployment
4. Click **"..."** → **"Promote to Production"**

## Troubleshooting

### Build Fails

**Error**: "Module not found" or dependency errors
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: "Build exceeded time limit"
- **Solution**: Check for infinite loops or heavy computations during build
- Consider upgrading Vercel plan

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` to be accessible in browser
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)

### TypeScript Errors

- Run `npm run build` locally first to catch errors
- Fix all TypeScript errors before deploying

### Wallet Connection Issues

- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
- Check that your domain is allowed in WalletConnect project settings

## Vercel Configuration File

The project includes a `vercel.json` configuration file:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

This configures:
- **Build settings**: Next.js build commands
- **Region**: `iad1` (US East) for optimal latency
- You can change region to `sfo1` (US West), `fra1` (Europe), etc.

## Performance Optimization

### Enable Edge Runtime (Optional)

For faster response times, you can use Vercel's Edge Runtime:

1. Add to page files that can benefit:
```typescript
export const runtime = 'edge'
```

2. Note: Edge Runtime has limitations (no Node.js APIs)

### Enable Image Optimization

Next.js Image optimization is automatically enabled on Vercel. Use the `<Image>` component:

```tsx
import Image from 'next/image'

<Image src="/logo.png" width={200} height={50} alt="Logo" />
```

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] No private keys or secrets in code
- [ ] CORS is properly configured
- [ ] Rate limiting is considered for API routes
- [ ] Smart contract addresses are verified

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **GitHub Issues**: Create an issue in your repository

---

## Quick Reference

### Vercel URLs

- **Dashboard**: https://vercel.com/dashboard
- **Deployments**: https://vercel.com/YOUR_USERNAME/basebook-lb
- **Production URL**: https://basebook-lb.vercel.app (or your custom domain)

### Important Commands

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Pull environment variables locally
vercel env pull

# Remove deployment
vercel rm basebook-lb
```

---

**Ready to deploy?** Follow Part 1 to upload to GitHub, then Part 2 to deploy to Vercel!
