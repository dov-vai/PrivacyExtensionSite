# Building

## Frontend

Install pnpm:
```
npm install --global corepack@latest
corepack enable pnpm
```

Inside the privacy-site folder:
```bash
pnpm i
```

## API

.NET 8 is required. Downloads can be found [here](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

Inside the PrivacyApi folder:
```bash
dotnet run
```

To launch in development mode.

Launching the API with `dotnet run` will launch the frontend too in Vite development mode, so that doesn't have to be done separately.

## Publishing

```bash
dotnet publish -c Release
```

Will build both the Frontend and API.

## Config

Be sure to change the secret in [appsettings.json](PrivacyApi/appsettings.json).

Otherwise it poses a security risk, as anyone will be able to sign the JWT tokens.
