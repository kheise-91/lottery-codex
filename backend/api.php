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

$app->get('/api/games/{gameId}/history', function (Request $request, Response $response, array $attrs) {
    $gameId = $attrs['gameId'];

    $badgerFiveHistory = [
        "Monday, July 1st" => [
            'numbers' => [3, 12, 19, 24, 31],
            'pattern' => '3-Odd 2-Even / 3-Low 2-High',
        ],
        "Sunday, June 30th" => [
            'numbers' => [5, 8, 17, 22, 29],
            'pattern' => '3-Odd 2-Even / 2-Low 3-High',
        ],
        "Saturday, June 29th" => [
            'numbers' => [2, 11, 14, 23, 30],
            'pattern' => '2-Odd 3-Even / 3-Low 2-High',
        ],
        "Friday, June 28th" => [
            'numbers' => [7, 9, 16, 21, 28],
            'pattern' => '3-Odd 2-Even / 2-Low 3-High',
        ],
        "Thursday, June 27th" => [
            'numbers' => [1, 4, 13, 20, 25],
            'pattern' => '3-Odd 2-Even / 3-Low 2-High',
        ],
        "Wednesday, June 26th" => [
            'numbers' => [6, 10, 18, 26, 31],
            'pattern' => '1-Odd 4-Even / 1-Low 4-High',
        ],
        "Tuesday, June 25th" => [
            'numbers' => [3, 8, 15, 22, 27],
            'pattern' => '3-Odd 2-Even / 2-Low 3-High',
        ],
    ];

    $superCashHistory = [
        "Monday, July 1st" => [
            'numbers' => [4, 11, 18, 25, 32, 37],
            'pattern' => '3-Odd 3-Even / 3-Low 3-High',
        ],
        "Sunday, June 30th" => [
            'numbers' => [2, 9, 14, 23, 30, 35],
            'pattern' => '3-Odd 3-Even / 2-Low 4-High',
        ],
        "Saturday, June 29th" => [
            'numbers' => [7, 12, 19, 26, 31, 38],
            'pattern' => '4-Odd 2-Even / 3-Low 3-High',
        ],
        "Friday, June 28th" => [
            'numbers' => [3, 8, 15, 22, 29, 36],
            'pattern' => '4-Odd 2-Even / 2-Low 4-High',
        ],
        "Thursday, June 27th" => [
            'numbers' => [1, 10, 17, 24, 33, 39],
            'pattern' => '5-Odd 1-Even / 3-Low 3-High',
        ],
        "Wednesday, June 26th" => [
            'numbers' => [6, 13, 20, 27, 34, 38],
            'pattern' => '2-Odd 4-Even / 2-Low 4-High',
        ],
    ];

    $historyMap = [
        'badger-five' => $badgerFiveHistory,
        'supercash'   => $superCashHistory,
    ];

    if (!array_key_exists($gameId, $historyMap)) {
        return $response->withStatus(404);
    }

    $body = $response->getBody();
    $body->write(json_encode(['history' => $historyMap[$gameId]], JSON_PRETTY_PRINT));
    return $response;
});

$app->run();
