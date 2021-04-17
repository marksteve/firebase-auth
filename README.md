# @marksteve/firebase-auth

Express and Koa middlewares for verifying Firebase Auth tokens

## Express

```
const express = require('express')
const auth = require('@marksteve/firebase-auth/express');

const app = express();
app.use(auth);
```

## Koa

```
const Koa = require('koa');
const auth = require('@marksteve/firebase-auth/koa');

const app = new Koa();
app.use(auth);
```