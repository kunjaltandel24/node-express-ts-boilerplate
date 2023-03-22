# Node Express Typescript Boilerplate With Mongoose

## required services

- **SMTP Service AWS/any**
  - **SES_HOST** SMTP host is required to send outgoing mail request.
  - **SES_EMAIL** any email enable in your enabled in your Mail Server of SMTP host.
  - if aws then required **access_key** as user and **secret_access_key** as password to SMTP service
- **MongoDB** connection string from local/atlas is required

## Build Setup
```bash
# add env
$ cp sample.env .env // fill all variables with approprite values[dont use sample config values in production]

# install dependencies
$ npm install

# build
$ npm run build

# starts node process
$ npm start
```
