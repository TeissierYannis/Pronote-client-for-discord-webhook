# Pronote Client for Discord Webhook

[![Node](https://img.shields.io/badge/Node-v12.14.1-green.svg)](https://nodejs.org/fr/)
[![pronote-api](https://img.shields.io/badge/pronote--api-by%20Litarvan-blue.svg)](https://github.com/Litarvan/pronote-api)

This script was created to send webhooks when pronote messages and homeworks are sended.

## Summary

- [Installation Guide](#install)
- [Built With](#build)
- [Authors](#author)
- [Thanks](#thanks)

### Installation Guide <a id="install"></a>

- **Step 1** __Configure credential :__  ./Client/credentials.json
```json
{
    "type": "fetch",
    "username": "username",
    "password": "password",
    "url": "pronote url",
    "cas": "academy"
}
```

- **Step 2** __Configure webhook :__ ./Client/webhook.json
```json
{
    "id": "webhook_id",
    "token": "webhook_token"
}
```

- **Step 3** __Run command__
```
npm i
```

- **Step 4** __Run server__
```
node ./Server/index.js
```

- **Step 5** __Run server__
```
node ./Client/index.js
```

- **Step 6** __Enjoy :)__

### Built With <a id="build"></a>

- [Node.js](https://nodejs.org/fr/) - server
- [pronote-api](https://github.com/Litarvan/pronote-api) - pronote-api

### Authors <a id="author"></a>

* **YeyPiz** - *Initial work* - [read more](https://github.com/TeissierYannis)
* **Theo-coder** - *Initial work* - [read more](https://github.com/theo-coder)

### Thanks to <a id="thanks"></a>

* **Litarvan** - *pronote-api developer* - [read more](https://github.com/Litarvan/)
