Private Organization Website (Deployed)
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
