import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { environment } from 'src/env.prod';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import { ServiceAccount } from 'firebase-admin';

const server:express.Express = express();

async function bootstrap() {
  admin.initializeApp({
    credential:admin.credential.cert(environment.firebase.serviceAccount as ServiceAccount),
    databaseURL:environment.firebase.databaseUrl
  })
  const adapter = new ExpressAdapter(server);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,adapter,{}
  )

  app.enableCors();
  return app.init();
}



bootstrap()
  .then(v => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));
export const api: functions.HttpsFunction = functions.region('asia-southeast2').https.onRequest(server);
