# codeministry platform 2.0

> The codeministry.com platform 2018/19 rewrite

### Built with

- nuxt
- hapi
- Prismic CMS

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

# CMS

Using [prismic](https://prismic.io/) CMS

Repository: [https://codeministry.prismic.io/](https://codeministry.prismic.io/)

Install the CLI: `npm install -g prismic-cli`


## IMPORTANT

This needs to stay in `package.json` [see this issue](https://github.com/dominictarr/event-stream/issues/116):

    "resolutions": {
        "**/event-stream": "3.3.4"
      },
      
