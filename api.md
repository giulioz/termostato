# HTTP API reference

- `/thermostat/mode` (GET / POST): `auto`, `on` of `off`
- `/thermostat/program` (GET / POST): array of 24 target temps, one for every hour
- `/stats/temperature` (GET)
- `/stats/time` (GET)
- `/stats/timezone` (GET / POST): time shift in hours
- `/identifier` (GET / POST): 50 characters
- `/fwversion` (GET)
- `/settings` (GET): dump settings in base64

## Errors
- `401` invalid auth
- `500` error (mostly during settings save)
- `400` invalid request
