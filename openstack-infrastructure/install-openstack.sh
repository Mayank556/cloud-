#!/bin/bash
# Script to install DevStack (OpenStack for a single node)

echo "Preparing system for OpenStack Installation..."
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install git -y

echo "Creating the 'stack' user required by OpenStack..."
sudo useradd -s /bin/bash -d /opt/stack -m stack
echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack

echo "Downloading DevStack (OpenStack installer)..."
sudo su - stack -c "git clone https://opendev.org/openstack/devstack /opt/stack/devstack"

echo "Configuring OpenStack passwords and parameters..."
sudo su - stack -c "cat <<EOF > /opt/stack/devstack/local.conf
[[local|localrc]]
ADMIN_PASSWORD=supersecret
DATABASE_PASSWORD=\$ADMIN_PASSWORD
RABBIT_PASSWORD=\$ADMIN_PASSWORD
SERVICE_PASSWORD=\$ADMIN_PASSWORD

# Enable fundamental Cloud Services
enable_service rabbit mysql key (Keystone - Identity)
enable_service n-api n-crt n-obj n-cpu n-cond n-sch (Nova - Compute)
enable_service g-api g-reg (Glance - Images)
enable_service q-svc q-agt q-dhcp q-l3 q-meta (Neutron - Networking)
enable_service c-api c-vol c-sch (Cinder - Block Storage)
enable_service horizon (Horizon - Web Dashboard)
EOF"

echo "Starting OpenStack! This will build your Private Cloud..."
# Note: In a real environment, you run this manually inside the VM for error checking:
# sudo su - stack -c "cd /opt/stack/devstack && ./stack.sh"
echo "To start the cloud, SSH into this machine, switch to stack user, and run ./stack.sh"
