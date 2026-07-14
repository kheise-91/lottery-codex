<?php
declare(strict_types=1);

namespace LotteryCodex;

use Psr\Http\Message\{RequestInterface, ResponseInterface};

require_once __DIR__ . '/vendor/autoload.php';

$app = \Slim\Factory\AppFactory::create();

// Error middleware — stack traces hidden in production
$displayErrors = (getenv('APP_ENV') ?? 'production') === 'development';
$errorMiddleware = $app->addErrorMiddleware(true, true, $displayErrors);

// JSON Content-Type middleware — applied to every response
$app->add(function ($request, $handler) {
    /** @var ResponseInterface $response */
    $response = $handler->handle($request);
    return $response->withHeader('Content-Type', 'application/json');
});

$controller = new \LotteryCodex\Controllers\GamesController();

$app->get('/api/games', function (RequestInterface $request, ResponseInterface $response) use ($controller) {
    return $controller->list($response);
});
$app->get('/api/games/{gameId}', function (RequestInterface $request, ResponseInterface $response, array $attrs) use ($controller) {
    return $controller->show($attrs['gameId'], $response);
});
$app->get('/api/games/{gameId}/history', function (RequestInterface $request, ResponseInterface $response, array $attrs) use ($controller) {
    return $controller->history($attrs['gameId'], $response);
});
$app->post('/api/games/{gameId}/generate', function (RequestInterface $request, ResponseInterface $response, array $attrs) use ($controller) {
    return $controller->generate($attrs['gameId'], $request, $response);
});

$app->run();
