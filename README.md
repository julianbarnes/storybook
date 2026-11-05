# Storyboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Node server with rate limiting

`server/` contains a dependency-free Node.js server that serves the built Angular app (`dist/storyboard`) with SPA fallback, exposes `GET /api/health`, and rate-limits every request per client IP using an in-memory token bucket.

```bash
npm run build      # build the Angular app
npm run server     # start on http://localhost:3000
npm run test:server
```

Configuration (environment variables):

| Variable               | Default | Description                              |
| ---------------------- | ------- | ---------------------------------------- |
| `PORT`                 | `3000`  | Port to listen on                        |
| `RATE_LIMIT`           | `100`   | Max requests (burst size) per window     |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Window over which `RATE_LIMIT` refills   |

Responses include `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset` headers. Requests over the limit get `429 Too Many Requests` with a `Retry-After` header.
