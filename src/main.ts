import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { environment } from 'env.prod';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

const server:express.Express = express();

async function bootstrap() {
  admin.initializeApp({
    credential:admin.credential.cert(environment.firebase.serviceAccount),
    databaseURL:environment.firebase.databaseUrl
  })
  const adapter = new ExpressAdapter(server);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,adapter,{}
  )

  app.enableCors();
  if(!environment.production){
    return app.listen(3000);
  }
  else{
    return app.init();
  }
}



bootstrap()
  .then(v => console.log('Nest Ready'))
  .catch(err => console.error('Nest broken', err));
export const api: functions.HttpsFunction = functions.https.onRequest(server);