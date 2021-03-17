# GitHub webhook manager

Application that recieves webhook POST requests from GitHub and will clone the repository on a successful 'check_suite' event as part of my continuous deployment for [PortfolioTS](https://github.com/ThomasvanBommel/PortfolioTS)

It will ignore invalid requests from unknown sources

Dependencies:
 - [Express](https://www.npmjs.com/package/express)
 - [typescript](https://www.npmjs.com/package/typescript)

## Requirements

 1. Add a webhook and webhook secret to the repository
 2. Make that secret 'WEBHOOK_SECRET' environment variable on the computer running the webhook manager
 3. Add the repository ids to the 'acceptedRepositories' variable in [src/index.ts](src/index.ts)

### Run

 1. Install typescript globally `npm i -g typescript`
 2. Install packages `npm i`
 3. Build & run `npm start`

### Example Output

```
> webhook-manager@1.0.0 start /home/thomas/Desktop/INFT3000/webhook-manager
> tsc && node ./build/index.js

Listening interfaces: [ 
  http://127.0.0.1:8080 (lo)
  http://192.168.1.181:8080 (enp2s0) 
]
----------------------
2021-03-17T20:10:01.998Z
ID:  ::ffff:24.224.242.85
URL:  /?name=bob
----------------------
2021-03-17T20:11:25.661Z
ID:  ::ffff:140.82.115.244
URL:  /webhook/portfolio-ts
{
  isVerified: true,
  event: 'check_suite',
  targetType: 'repository',
  targetID: 333275051
}
----------------------
Cloned new repository: ../repositories/ThomasvanBommel/PortfolioTS/1616011885664
----------------------
2021-03-17T20:14:59.854Z
ID:  ::ffff:35.187.190.226
URL:  /
```