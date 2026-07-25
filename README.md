# Satellite Radar Web App

## Development and production data

Vite selects the environment from the command being run

- `npm run dev` loads `.env.development` and uses the radar response fixture.
- `npm run build` loads `.env.production` and uses the deployed FastAPI API.
- `npm run preview` serves the production build created by `npm run build`.

Restart the Vite development server after changing an environment file.
