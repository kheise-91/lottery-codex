<?php
declare(strict_types=1);

namespace LotteryCodex;

use Psr\Http\Message\{Request, Response};
use LotteryCodex\Games\BadgerFive;
use LotteryCodex\Games\SuperCash;

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

$app->get('/api/games', function (Request $request, Response $response) {
    $data = ['games' => []];
    $games = [new BadgerFive(), new SuperCash()];

    foreach ($games AS $game) {
        $details = $game->getGameDetails();
        $data['games'][] = [
            'id' => $details['id'],
            'name' => $details['name'],
            'status' => $details['status']
        ];
    }

    $body = $response->getBody();
    $body->write(json_encode($data, JSON_PRETTY_PRINT));
    return $response;
});

$app->get('/api/games/{gameId}', function (Request $request, Response $response, array $attrs) {
    $games = [new BadgerFive(), new SuperCash()];

    foreach ($games as $game) {
        if ($game->getGameDetails()['id'] === $attrs['gameId']) {
            $details = $game->getGameDetails();

            $body = $response->getBody();
            $body->write(json_encode($details, JSON_PRETTY_PRINT));
            return $response;
        }
    }

    return $response->withStatus(404);
});

$app->run();
