#!/bin/bash -ex

source .env

# install apt dependancies
printf "%b" "${OKB}Installing deb packages${NC}\n"
sudo apt update
xargs -a apt-pkgs.txt sudo apt install -y
printf "%b" "${OKG} ✓ ${NC} complete\n"

# setup nginx server
printf "%b" "${OKB}Starting nginx server${NC}\n"
/etc/init.d/nginx start
printf "%b" "${OKG} ✓ ${NC} complete\n"

# validate correct install
printf "%b" "${OKB}Verifying package installations${NC}\n"
npm -v
node -v
nginx -v
printf "%b" "${OKG} ✓ ${NC} complete\n"

# setup firewall for NGINX and OpenSSH
printf "%b" "${OKB}Configuring firewall rules for port 80 and port 22${NC}\n"
sudo ufw enable
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx HTTP'
sudo ufw status
printf "%b" "${OKG} ✓ ${NC} complete\n"