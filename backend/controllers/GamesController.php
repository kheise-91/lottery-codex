<?php
declare(strict_types=1);

namespace LotteryCodex\Controllers;

use Psr\Http\Message\{RequestInterface, ResponseInterface};
use LotteryCodex\Games\GameInterface;

class GamesController
{
    /**
     * Maps game IDs to their fully-qualified class names.
     * Add new games here only — no other file needs changing.
     */
    private array $registry = [
        'badger-five' => \LotteryCodex\Games\BadgerFive::class,
        'supercash'   => \LotteryCodex\Games\SuperCash::class,
        'megabucks'   => \LotteryCodex\Games\Megabucks::class
    ];

    /**
     * GET /api/games — List all available games.
     * @return array JSON response with games list (id, name, status per game)
     */
    public function list(ResponseInterface $response): ResponseInterface
    {
        // Current api.php returns only id/name/status per game — match this shape.
        // show() returns full details for the selected game.
        $games = [];
        foreach ($this->registry as $id => $class) {
            try {
                $instance = new $class();
                $details = $instance->getGameDetails();
                $games[] = [
                    'id'    => $details['id'],
                    'name'  => $details['name'],
                    'status' => $details['status'] ?? 'active',
                ];
            } catch (\Throwable $e) {
                error_log("GamesController::list failed to instantiate {$class}: " . $e->getMessage());
                // Include game with disabled status if instantiation fails
                $games[] = [
                    'id'     => $id,
                    'name'   => ucfirst(str_replace('-', ' ', $id)),
                    'status' => 'disabled',
                ];
            }
        }

        return $this->jsonResponse($response, ['games' => $games]);
    }

    /**
     * GET /api/games/{gameId} — Get game details.
     * @param string $gameId Game identifier (e.g. 'badger-five', 'supercash')
     * @return array Game details or 404 error if game is not registered
     */
    public function show(string $gameId, ResponseInterface $response): ResponseInterface
    {
        $game = $this->resolve($gameId);
        if (!$game) {
            return $this->jsonResponse($response, ['error' => 'Game not found'], 404);
        }

        return $this->jsonResponse($response, $game->getGameDetails());
    }

    /**
     * GET /api/games/{gameId}/history — Get historical drawings.
     * Uses mock data for now (Phase 1). Replaced with real game class in Phase 4.
     * @param string $gameId Game identifier
     * @return array Historical drawings or 404 error if game is not registered
     */
    public function history(string $gameId, ResponseInterface $response): ResponseInterface
    {
        if (!$this->isRegistered($gameId)) {
            return $this->jsonResponse($response, ['error' => 'Game not found'], 404);
        }

        // TODO: Replace with real data in Phase 4.1 via $game->getHistory()
        $historyMap = [
            'badger-five' => [
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
            ],
            'supercash' => [
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
            ],
            'megabucks' => [
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
            ],
        ];

        return $this->jsonResponse($response, ['history' => $historyMap[$gameId]]);
    }

    /**
     * POST /api/games/{gameId}/generate — Generate prediction tickets.
     * @param string $gameId Game identifier
     * @param RequestInterface $request Expects JSON body with 'count' integer
     * @return array Generated tickets or error (404 if game not found, 400 if invalid count, 503 if game unavailable)
     */
    public function generate(string $gameId, RequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        if (!$this->isRegistered($gameId)) {
            return $this->jsonResponse($response, ['error' => 'Game not found'], 404);
        }

        $body = json_decode((string) $request->getBody(), true) ?: [];
        $count = $body['count'] ?? 0;

        if (!is_int($count) || $count <= 0) {
            return $this->jsonResponse($response, [
                'error' => 'Invalid count: must be a positive integer.',
            ], 400);
        }

        $game = $this->resolve($gameId);
        if (!$game) {
            return $this->jsonResponse($response, ['error' => 'Game unavailable'], 503);
        }

        return $this->jsonResponse($response, ['tickets' => $game->generateTickets($count)]);
    }

    /**
     * Resolve a game ID to a GameInterface instance.
     * Returns null if the game is not registered or fails to instantiate.
     * @param string $gameId Game identifier to resolve
     * @return GameInterface|null Instantiated game class or null on failure
     */
    private function resolve(string $gameId): ?GameInterface
    {
        $class = $this->registry[$gameId] ?? null;
        if (!$class) {
            return null;
        }

        try {
            return new $class();
        } catch (\Throwable $e) {
            error_log("GamesController::resolve failed for '{$gameId}': " . $e->getMessage());
            return null;
        }
    }

    /**
     * Check if a game ID is registered without instantiating.
     */
    private function isRegistered(string $gameId): bool
    {
        return isset($this->registry[$gameId]);
    }

    /**
     * Helper: write JSON and return response.
     * Content-Type is already set by the global middleware in api.php.
     * @param ResponseInterface $response HTTP response object to modify
     * @param array $data Data to encode as JSON
     * @param int $status HTTP status code (default 200)
     * @return ResponseInterface Modified response with JSON body and status
     */
    private function jsonResponse(ResponseInterface $response, array $data, int $status = 200): ResponseInterface
    {
        $body = $response->getBody();
        $body->write(json_encode($data, JSON_PRETTY_PRINT));
        return $response->withStatus($status);
    }
}
