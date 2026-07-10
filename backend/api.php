<?php
declare(strict_types=1);

namespace LotteryCodex;

require_once __DIR__ . '/vendor/autoload.php';

$app = \Slim\Factory\AppFactory::create();

// Error middleware — stack traces hidden from client
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// JSON Content-Type middleware — applied to every response
$app->add(function ($request, $handler) {
    /** @var \Psr\Http\Message\ResponseInterface $response */
    $response = $handler->handle($request);
    return $response->withHeader('Content-Type', 'application/json');
});

// TODO: Routes go here in subsequent tasks

$app->run();
