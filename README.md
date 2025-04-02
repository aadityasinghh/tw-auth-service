<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

```
booking_landing-auth
├─ .prettierrc
├─ README.md
├─ dist
│  ├─ apis
│  │  ├─ api.module.d.ts
│  │  ├─ api.module.js
│  │  ├─ api.module.js.map
│  │  └─ user
│  │     ├─ entities
│  │     │  ├─ user.entity.d.ts
│  │     │  ├─ user.entity.js
│  │     │  └─ user.entity.js.map
│  │     ├─ user.controller.d.ts
│  │     ├─ user.controller.js
│  │     ├─ user.controller.js.map
│  │     ├─ user.module.d.ts
│  │     ├─ user.module.js
│  │     ├─ user.module.js.map
│  │     ├─ user.service.d.ts
│  │     ├─ user.service.js
│  │     └─ user.service.js.map
│  ├─ app.controller.d.ts
│  ├─ app.controller.js
│  ├─ app.controller.js.map
│  ├─ app.module.d.ts
│  ├─ app.module.js
│  ├─ app.module.js.map
│  ├─ app.service.d.ts
│  ├─ app.service.js
│  ├─ app.service.js.map
│  ├─ core
│  │  ├─ core.module.d.ts
│  │  ├─ core.module.js
│  │  ├─ core.module.js.map
│  │  └─ db
│  │     ├─ db.config.d.ts
│  │     ├─ db.config.js
│  │     ├─ db.config.js.map
│  │     ├─ db.module.d.ts
│  │     ├─ db.module.js
│  │     ├─ db.module.js.map
│  │     └─ migrations
│  │        ├─ 1743156985273-Migration.d.ts
│  │        ├─ 1743156985273-Migration.js
│  │        ├─ 1743156985273-Migration.js.map
│  │        ├─ 1743157927322-Migration.d.ts
│  │        ├─ 1743157927322-Migration.js
│  │        └─ 1743157927322-Migration.js.map
│  ├─ main.d.ts
│  ├─ main.js
│  ├─ main.js.map
│  └─ tsconfig.build.tsbuildinfo
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ src
│  ├─ apis
│  │  ├─ api.module.ts
│  │  ├─ test
│  │  └─ user
│  │     ├─ entities
│  │     │  └─ user.entity.ts
│  │     ├─ user.controller.ts
│  │     ├─ user.module.ts
│  │     └─ user.service.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ core
│  │  ├─ core.module.ts
│  │  ├─ db
│  │  │  ├─ db.config.ts
│  │  │  ├─ db.module.ts
│  │  │  └─ migrations
│  │  │     ├─ 1743156985273-Migration.ts
│  │  │     └─ 1743157927322-Migration.ts
│  │  └─ redis
│  └─ main.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
booking_landing-auth
├─ .prettierrc
├─ README.md
├─ dist
│  ├─ apis
│  │  ├─ api.module.d.ts
│  │  ├─ api.module.js
│  │  ├─ api.module.js.map
│  │  └─ user
│  │     ├─ dto
│  │     │  ├─ create-user.dto.d.ts
│  │     │  ├─ create-user.dto.js
│  │     │  └─ create-user.dto.js.map
│  │     ├─ entities
│  │     │  ├─ user.entity.d.ts
│  │     │  ├─ user.entity.js
│  │     │  └─ user.entity.js.map
│  │     ├─ user.controller.d.ts
│  │     ├─ user.controller.js
│  │     ├─ user.controller.js.map
│  │     ├─ user.module.d.ts
│  │     ├─ user.module.js
│  │     ├─ user.module.js.map
│  │     ├─ user.service.d.ts
│  │     ├─ user.service.js
│  │     └─ user.service.js.map
│  ├─ app.controller.d.ts
│  ├─ app.controller.js
│  ├─ app.controller.js.map
│  ├─ app.module.d.ts
│  ├─ app.module.js
│  ├─ app.module.js.map
│  ├─ app.service.d.ts
│  ├─ app.service.js
│  ├─ app.service.js.map
│  ├─ core
│  │  ├─ auth
│  │  │  ├─ auth.module.d.ts
│  │  │  ├─ auth.module.js
│  │  │  └─ auth.module.js.map
│  │  ├─ common
│  │  │  └─ dto
│  │  │     ├─ api-response.dto.d.ts
│  │  │     ├─ api-response.dto.js
│  │  │     └─ api-response.dto.js.map
│  │  ├─ core.module.d.ts
│  │  ├─ core.module.js
│  │  ├─ core.module.js.map
│  │  └─ db
│  │     ├─ db.config.d.ts
│  │     ├─ db.config.js
│  │     ├─ db.config.js.map
│  │     ├─ db.module.d.ts
│  │     ├─ db.module.js
│  │     ├─ db.module.js.map
│  │     └─ migrations
│  │        ├─ 1743156985273-Migration.d.ts
│  │        ├─ 1743156985273-Migration.js
│  │        ├─ 1743156985273-Migration.js.map
│  │        ├─ 1743157927322-Migration.d.ts
│  │        ├─ 1743157927322-Migration.js
│  │        └─ 1743157927322-Migration.js.map
│  ├─ main.d.ts
│  ├─ main.js
│  ├─ main.js.map
│  └─ tsconfig.build.tsbuildinfo
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ src
│  ├─ apis
│  │  ├─ api.module.ts
│  │  ├─ test
│  │  └─ user
│  │     ├─ dto
│  │     │  └─ create-user.dto.ts
│  │     ├─ entities
│  │     │  └─ user.entity.ts
│  │     ├─ user.controller.ts
│  │     ├─ user.module.ts
│  │     └─ user.service.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ core
│  │  ├─ auth
│  │  │  └─ auth.module.ts
│  │  ├─ common
│  │  │  └─ dto
│  │  │     └─ api-response.dto.ts
│  │  ├─ core.module.ts
│  │  ├─ db
│  │  │  ├─ db.config.ts
│  │  │  ├─ db.module.ts
│  │  │  └─ migrations
│  │  └─ redis
│  └─ main.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
```
booking_landing-auth
├─ .prettierrc
├─ README.md
├─ dist
│  ├─ apis
│  │  ├─ api.module.d.ts
│  │  ├─ api.module.js
│  │  ├─ api.module.js.map
│  │  └─ user
│  │     ├─ dto
│  │     │  ├─ create-user.dto.d.ts
│  │     │  ├─ create-user.dto.js
│  │     │  └─ create-user.dto.js.map
│  │     ├─ entities
│  │     │  ├─ user.entity.d.ts
│  │     │  ├─ user.entity.js
│  │     │  └─ user.entity.js.map
│  │     ├─ user.controller.d.ts
│  │     ├─ user.controller.js
│  │     ├─ user.controller.js.map
│  │     ├─ user.module.d.ts
│  │     ├─ user.module.js
│  │     ├─ user.module.js.map
│  │     ├─ user.service.d.ts
│  │     ├─ user.service.js
│  │     └─ user.service.js.map
│  ├─ app.controller.d.ts
│  ├─ app.controller.js
│  ├─ app.controller.js.map
│  ├─ app.module.d.ts
│  ├─ app.module.js
│  ├─ app.module.js.map
│  ├─ app.service.d.ts
│  ├─ app.service.js
│  ├─ app.service.js.map
│  ├─ core
│  │  ├─ auth
│  │  │  ├─ auth.module.d.ts
│  │  │  ├─ auth.module.js
│  │  │  └─ auth.module.js.map
│  │  ├─ common
│  │  │  └─ dto
│  │  │     ├─ api-response.dto.d.ts
│  │  │     ├─ api-response.dto.js
│  │  │     └─ api-response.dto.js.map
│  │  ├─ core.module.d.ts
│  │  ├─ core.module.js
│  │  ├─ core.module.js.map
│  │  └─ db
│  │     ├─ db.config.d.ts
│  │     ├─ db.config.js
│  │     ├─ db.config.js.map
│  │     ├─ db.module.d.ts
│  │     ├─ db.module.js
│  │     ├─ db.module.js.map
│  │     └─ migrations
│  │        ├─ 1743156985273-Migration.d.ts
│  │        ├─ 1743156985273-Migration.js
│  │        ├─ 1743156985273-Migration.js.map
│  │        ├─ 1743157927322-Migration.d.ts
│  │        ├─ 1743157927322-Migration.js
│  │        └─ 1743157927322-Migration.js.map
│  ├─ main.d.ts
│  ├─ main.js
│  ├─ main.js.map
│  └─ tsconfig.build.tsbuildinfo
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ src
│  ├─ apis
│  │  ├─ api.module.ts
│  │  ├─ test
│  │  └─ user
│  │     ├─ dto
│  │     │  ├─ create-user.dto.ts
│  │     │  ├─ login-user.dto.ts
│  │     │  ├─ update-user.dto.ts
│  │     │  └─ user-response.dto.ts
│  │     ├─ entities
│  │     │  └─ user.entity.ts
│  │     ├─ user.controller.ts
│  │     ├─ user.module.ts
│  │     └─ user.service.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ core
│  │  ├─ auth
│  │  │  └─ auth.module.ts
│  │  ├─ common
│  │  │  └─ dto
│  │  │     └─ api-response.dto.ts
│  │  ├─ core.module.ts
│  │  ├─ db
│  │  │  ├─ db.config.ts
│  │  │  ├─ db.module.ts
│  │  │  └─ migrations
│  │  └─ redis
│  └─ main.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```