# HTTP API reference

- `/thermostat/mode` (GET / POST): `auto`, `on` of `off`
- `/thermostat/program` (GET / POST): array of 24 target temps, one for every hour
- `/stats/temperature` (GET)
- `/stats/time` (GET)
- `/stats/timezone` (GET / POST): time shift in hours
- `/identifier` (GET / POST): 50 characters
- `/fwversion` (GET)
- `/settings` (GET): dump settings

## Errors
- `403` invalid token
