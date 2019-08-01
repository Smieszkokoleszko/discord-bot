## AF discord_bot

Copy `.env.dist` to `.env` fill the config values and run via:  
```
docker-compose pull && docker-compose -f .\docker-compose.yml up -d
```


### DEV

```
npm install --global pm2 && pm2 install typescript
pm2-dev start ./src/index.ts
```
or
```
docker-compose up --build
```
