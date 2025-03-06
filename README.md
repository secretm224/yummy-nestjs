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
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
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

# npm setup
$npm install
$npm install -g npm
$npm -v

# nestjs install 
$npm install -g @nestjs/cli
$nest -v

# add nestjs orm inject
$npm install @nestjs/platform-express
# add nestjs kafka
$npm install @nestjs/microservices kafkajs
# add config
$npm install @nestjs/config
# add static serve (public)
$npm install @nestjs/serve-static
# add env files
$npm install dotenv
$npm install cross-env --save-dev
#axios
$npm install axios @nestjs/axios
#elasticsearch
$npm install @nestjs/elasticsearch
#jwt 
$npm install jsonwebtoken
$npm install @types/jsonwebtoken --save-dev
#http only cookie 추가
$npm install cookie-parser
#redis
$npm install ioredis
#ejs
$npm install --save ejs
#layout
$npm install express-ejs-layouts
#express session
$npm install passport @nestjs/passport passport-local express-session
$npm install --save-dev @types/express-session
#swagger
$npm install --save @nestjs/swagger swagger-ui-express

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

``` bash
📂 yummy-nestjs  # 프로젝트 루트 디렉토리
├── 📂 dist  # 빌드된 JavaScript 파일 (NestJS build 결과)
├── 📂 logs  # 애플리케이션 로그 파일 저장
│   ├── 📄 create_store.log  # 실행 로그 파일
│   ├── 📄 node_modules  # (비워진 상태) npm 모듈 캐시용
├── 📂 public  # 정적 파일 (이미지, HTML 등)
│   ├── 📄 alba.png  # 정적 이미지 파일
│   ├── 📄 yummyMap.html  # 정적 HTML 파일
├── 📂 src  # 소스 코드 폴더
│   ├── 📂 config  # 환경 설정 및 데이터베이스 설정
│   │   ├── 📄 database.config.ts  # TypeScript 기반 DB 설정 파일
│   │   ├── 📄 database.config.js  # 컴파일된 JS DB 설정 파일
│   │   ├── 📄 database.config.d.ts  # 타입 정의 파일
│   │   ├── 📄 database.config.js.map  # 소스 맵 파일
│   ├── 📂 entities  # 데이터베이스 엔터티 (ORM 모델)
│   │   ├── 📄 store.entity.ts  # Store 테이블 엔터티 정의
│   ├── 📂 store  # 주요 비즈니스 로직 관련 코드
│   │   ├── 📄 app.controller.ts  # HTTP 요청을 처리하는 컨트롤러
│   │   ├── 📄 app.controller.spec.ts  # 컨트롤러 테스트 파일
│   │   ├── 📄 app.module.ts  # NestJS 모듈 설정
│   │   ├── 📄 app.service.ts  # 서비스 계층 (비즈니스 로직)
│   ├── 📄 main.ts  # 애플리케이션의 진입점 (NestJS 부트스트랩 파일)
├── 📂 test  # 테스트 코드 폴더
├── 📄 .env  # 기본 환경변수 설정 파일 (개발 환경)
├── 📄 .env.production  # 운영 환경변수 설정 파일
├── 📄 .gitignore  # Git에서 제외할 파일 목록 설정
├── 📄 .prettierrc  # 코드 포맷팅 설정 (Prettier)
├── 📄 eslint.config.mjs  # ESLint 코드 스타일 설정
├── 📄 nest-cli.json  # NestJS CLI 설정 파일
├── 📄 package-lock.json  # npm 패키지 버전 잠금 파일
├── 📄 package.json  # 프로젝트 패키지 정보 및 스크립트 설정
├── 📄 README.md  # 프로젝트 설명 및 사용 방법 문서
├── 📄 tsconfig.build.json  # TypeScript 빌드 설정 파일
└── 📄 tsconfig.json  # TypeScript 설정 파일
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
