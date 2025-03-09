This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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


```
ssh -i /Users/admin/.ssh/id_rsa username@ip
sftp -i /Users/admin/.ssh/id_rsa username@ip
cd lcd pwd !pwd ls !ls put -r [dir]
put package.json put .env.local
```
```
sudo apt update -y
sudo apt install -y cron
sudo service cron start
sudo systemctl enable cron.service
sudo systemctl list-unit-files | grep cron
sudo service cron status
```
```
npm install -g pm2
pm2 start npm --name <app-name> -- start 
pm2 list
pm2 logs <app-name>
pm2 restart <app-name> 
pm2 stop <app-name> 
pm2 delete <app-name> 
```
```
node --version
nvm use 23.7.0
npm install next --legacy-peer-deps
npm run start
kill -9 $(pgrep -f '^next-server')
```
```
# sudo vi /etc/nginx/sites-available/default

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;

    index index.html index.htm index.nginx-debian.html;

    server_name _;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Accept-Encoding "";
    }
}
```
