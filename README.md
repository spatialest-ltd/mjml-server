Spatialest MJML Server
======================

A microservice to parse MJML markup to HTTP.

## What is MJML?

MJML is a markup language developed by the developers team at Mailjet. The parser this service
uses is the one they created and maintain. Make sure to give them a big thanks for open sourcing
such an amazing tool!

This server follows the MIT license, as well as the original MJML project.

## Docker Image

We distribute the server as a docker image for ease of deployment in cloud-like environments.

```bash
docker run --name mjml -e MJML_TOKEN=$(openssl rand -hex 16) -p 8000:8000 spatialest/mjml-server
```

The service exposes a really simple api.

## Api Reference

### `GET /`

Returns the health of the service.

```json
{
  "pid": 1,
  "healthy": true,
  "uptime": 164.369879906,
  "protected": true
}
```

### `POST /parse`

Parses MJML to HTML.

MJML must come as a blob in the request body. **`Content-Type` header MUST be 
`application/xml+mjml` for the parsing to work**. Optionally, you must provide the `X-Token`
header if your service is protected.

Here is an example request in PHP using streams:

```php
/**
 * @param string $baseUrl The base url in which your mjml server is running. Ex: https://mjml.yourcompany.com
 * @param string $mjml The mjml string to parse
 * @param string|null $token The token if the MJML service is protected
 * @return string|null The parsed html or null on error.
 */
function mjml_convert(string $baseUrl, string $mjml, string $token = null): ?string {
    $context = stream_context_create([
        'http' => [
            'header' => [
                'content-type: application/xml+mjml',
                'content-length: ' . strlen($mjml),
                'X-Token: '. $token
            ],
            'method' => 'POST',
            'content' => $mjml
        ]
    ]);

    $handle = @fopen($baseUrl . '/parse', 'rb', false, $context);
    if ($handle === false) {
        return null;
    }
    $html = stream_get_contents($handle);
    fclose($handle);
    return $html;
}
```
