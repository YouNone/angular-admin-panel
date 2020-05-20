// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EAuthType } from 'src/app/share/models/type';

export const environment = {
  production: false,
  name: 'dev',
  apiUrl: 'localhost',
  apiProtocol: 'http',
  apiPort: '3000',
  mediaUrl: 'alex.site',
  authType: 'domain',
  // authType:  EAuthType.basic,
  url: {
    start: "_start",
    limit: "_limit",
    sort: "_sort",
    order: "_order"
  }
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
