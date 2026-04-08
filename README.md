This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Authentication (NextAuth)

Admin routes under `/admin/*` are protected with `NextAuth` credentials authentication.
`/admin` is a login gateway and always redirects to `/admin/login`.
After successful login, you are redirected to `/admin/dashboard`.

1. Create a `.env.local` file in the project root.
2. Add the following variables:

```env
NEXTAUTH_SECRET=replace-with-long-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=replace-with-bcrypt-hash
```

3. Generate a strong `NEXTAUTH_SECRET`:

```bash
npx auth secret
```

4. Generate a bcrypt hash for your admin password (replace `YourStrongPassword123!`):

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('YourStrongPassword123!', 12).then(console.log)"
```

5. Put the generated hash value into `ADMIN_PASSWORD_HASH`.

Login page: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
Dashboard page (after login): [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
