# webmap
Web map application

## Using local data (optional)

1. Clone or link `web-data` from https://github.com/czechinvest/web-data/ to

`public` directory

2. Uncomment alternative configuration of **DATA_URL** variable in `./config/env.js` 

## Commands

### `npm install` 

install dependencies

### `npm run start` 

Runs the app in the development mode.<br>
Open [http://localhost:3030](http://localhost:3030) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build` 

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

### `npm run deploy` 

It runs build on current branch && creates doc && deploy (push) content of `` `build` ` ` directory into origin branch ` ` `gh-pages` ``.

App: [https://czechinvest.github.io/webmap/](https://czechinvest.github.io/webmap/)
API Documentation: [https://czechinvest.github.io/webmap/doc](https://czechinvest.github.io/webmap/doc)

### `npm run doc` 

Run creation of documentation.
The output is placed into docs directory.<br>

### `npm run docmd` 

Create documentation in markdown language.<br>

## Data URL

Data can be stored anywhere. It's a clone of
https://github.com/czechinvest/web-data

### Data source configuration

In `package.json` in scripts `(start` and `build` ) change `DATA_URL` parameter to your data location.
Example: 

``` 
"build": "DATA_URL=https://czechinvest.github.io/web-data/ NODE_ENV=production webpack --bail --config config/webpack.config.prod.js --progress --profile --colors",
```

## New layers

Fix src/environment.js

See
https://github.com/CzechInvest/webmap/commit/889771652742baed7fe589b8a3e680a2c2e082d0
for example
