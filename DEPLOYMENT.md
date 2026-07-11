# Production Deployment Guide (AWS EC2)

This guide provides step-by-step instructions for deploying the EduCloud platform to a production environment using an AWS EC2 instance.

## 1. Provision an EC2 Instance
1. Log in to the AWS Console.
2. Launch a new **EC2 Instance**.
   - **AMI**: Ubuntu Server 22.04 LTS (HVM)
   - **Instance Type**: `t2.micro` (or higher depending on load)
3. **Configure Security Group**: Add the following Inbound Rules:
   - `SSH` (Port 22) - Allow from your IP
   - `HTTP` (Port 80) - Allow from Anywhere (0.0.0.0/0)
   - `HTTPS` (Port 443) - Allow from Anywhere (0.0.0.0/0)
   - `Custom TCP` (Port 5000) - Allow from Anywhere (Optional, for direct testing)

## 2. Connect and Install Dependencies
SSH into your instance:
```bash
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
```

Update system and install required global software:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git nginx -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

## 3. Setup the Application
Clone your repository:
```bash
git clone <your-repo-url>
cd elearning-platform
```

Create and configure your `.env` file in the backend directory:
```bash
cd backend
nano .env
```
Add your production variables (MongoDB URI, JWT Secret, AWS credentials).

## 4. Run the Deployment Script
We have provided an automated deployment script in the root directory that builds the frontend, installs backend dependencies, and restarts the PM2 process.
```bash
cd ../ # Go back to repo root
chmod +x deploy.sh
./deploy.sh
```

To ensure PM2 restarts if the server reboots:
```bash
pm2 startup ubuntu
# Follow the command provided by pm2, then run:
pm2 save
```

## 5. Configure Nginx Reverse Proxy
We will use Nginx to serve incoming traffic on Port 80 and route it to our PM2 node application running on Port 5000.

Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/elearning
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your_domain_or_public_ip;

    location / {
        proxy_pass http://localhost:5000; # The backend will also serve frontend static files
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/elearning /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Secure with SSL (Let's Encrypt / Certbot) - Optional
If you have a domain name attached to the IP:
```bash
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d your_domain.com
```

## 7. Verify Deployment
Check the status of your Node.js application:
```bash
pm2 status
pm2 logs elearning-api
```
Your application should now be live and accessible securely over the internet!
