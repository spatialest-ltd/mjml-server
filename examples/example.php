<?php

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