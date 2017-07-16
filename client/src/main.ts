import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { HttpModule } from '@angular/http';
import { UsrService } from './app/services/usr.service';
import { MUtils } from './app/utils';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule,
  [HttpModule, UsrService, MUtils]);
