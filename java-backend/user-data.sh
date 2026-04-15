# AWS EC2 Initialization Script (User Data)
#!/bin/bash
sudo yum update -y
sudo yum install java-17-amazon-corretto -y
sudo yum install maven -y

# Clone your repo or copy the JAR
# git clone <your-repo-link>
# cd cloudproject/java-backend
# mvn clean install
# java -jar target/java-backend-1.0-SNAPSHOT.jar &
