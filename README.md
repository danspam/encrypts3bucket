<h1 align="center">encrypts3bucket</h1>
<div align="center">
  <strong>Tool to switch on encryption for all objects in a bucket</strong>
</div>
<br>
<div align="center">
  Built with ❤︎ by <a href="waywedo.com">Dan Sargeant</a> and <a href="https://github.com/waywedo/waywedo-heartbeat/graphs/contributors">contributors</a>
</div>

<h2>Table of Contents</h2>
<details>
  <summary>Table of Contents</summary>
  <li><a href="#about">About</a></li>
  <li><a href="#usage">Usage</a></li>
</details>

## About

Copies all objects in a bucket over the top of themselves, switching on AES256 encryption in the process

## Usage

Setup the config by copying aws.config.default to aws.config.json and update the values within. Update the bucket variable in index.js.

```js
node index.js
```
