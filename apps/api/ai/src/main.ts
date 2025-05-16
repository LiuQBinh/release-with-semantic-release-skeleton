import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import morgan from 'morgan'
import { VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { urlencoded, json } from 'express'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'
import { ParseJwtPayloadMiddleware } from './modules/authentication/middlewares/parse-jwt.middleware';

const isLocal = process.env.ENV == 'local'
const PORT = 8386

function getDirectories(srcpath) {
  const dir = path.join(__dirname, srcpath)
  return fs
    .readdirSync(dir)
    .map((file) => [path.join(dir, file), file])
    .filter((path) => fs.statSync(path[0]).isDirectory())
}

function getSubDirectories(srcpath, type) {
  return getDirectories(srcpath).reduce((acc, x) => {
    if (fs.existsSync(`${x[0]}/${x[1]}.${type}.js`)) {
      getDirectories(`${srcpath}/${x[1]}`).reduce((_acc) => {
        acc = acc.concat(getSubDirectories(`${srcpath}/${x[1]}`, type))
        return _acc
      }, [])
      // @ts-ignore
      acc.push(import(`./${srcpath}/${x[1]}/${x[1]}.${type}`) as any)
    } else {
      acc = acc.concat(getSubDirectories(`${srcpath}/${x[1]}`, type))
    }
    return acc
  }, [])
}

async function dynamicImport(type) {
  const PREFIX = 'modules'
  return (
    await Promise.all(
      getDirectories(PREFIX).reduce((acc) => {
        acc = acc.concat(getSubDirectories(PREFIX, type))
        return acc
      }, []),
    )
  ).map((x) => x[Object.keys(x)[0]] || (x as any).default)
}

async function bootstrap() {
  const logger: any[] = ['error', 'warn', 'debug'].concat(
    process.env.ENV != 'production' ? ['log'] : [],
  )

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(await dynamicImport('module')),
    {
      logger,
    },
  )

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/ai/v',
  })

  app.use(
    morgan(
      `[${process.env.npm_package_name}] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms :res[content-length] ":referrer" ":user-agent" `,
      {
        skip: function(req) {
          return req.originalUrl.startsWith('/health') || req.method == 'GET'
        },
      },
    ),
  )
  app.use(json({ limit: '1mb' }))
  app.use(urlencoded({ extended: true, limit: '1mb' }))
  app.use(cookieParser())
  app.use(ParseJwtPayloadMiddleware);

  // Health check path
  app.use('/health', (req, res) => {
    res.sendStatus(200)
  })

  if (isLocal) {
    const config = new DocumentBuilder()
      .setTitle('API-AI')
      .setDescription('The API for AI service')
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  }

  await app.listen(PORT)
  console.log(`server listening at: http://localhost:${PORT}/`)
}

bootstrap()
