# focusroot

/focusroot-server/wikis/new-page

# Basic Node commands
#Check version
node -v
npm -v

# Install express module globally
npm install -g express-generator

## To install nodemon module globally
npm install -g nodemon

# Create new project with EJS instead of Jade and less as CSS
express TestPrj --ejs -c less

# Install dependency
cd TestPrj
npm install

# Install only updated dependency and save in package.json
npm update --save

#Start server:
1) a. SET DEBUG=Ch01:*
   b. npm start
2) node app.js
3) nodemon