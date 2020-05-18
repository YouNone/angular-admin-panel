import { EAuthType } from 'src/app/share/models/type';

export const environment = {
    production: false,
    name: 'nest',
    apiUrl: 'localhost',
    apiProtocol: 'http',
    apiPort: '3000',
    mediaUrl: 'alex.site',
    // authType:  EAuthType.domain,
    url: {
      start: "start",
      limit: "limit",
      sort: "sort",
      order: "order"
    }
  }