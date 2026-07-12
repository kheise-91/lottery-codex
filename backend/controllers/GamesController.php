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
    ];

    /**
     * GET /api/games — List all available games.
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
        ];

        return $this->jsonResponse($response, ['history' => $historyMap[$gameId]]);
    }

    /**
     * POST /api/games/{gameId}/generate — Generate prediction tickets.
     */
    public function generate(string $gameId, RequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        if (!$this->isRegistered($gameId)) {
            return $this->jsonResponse($response, ['error' => 'Game not found'], 404);
        }

        // Validate count parameter
        $body = json_decode((string) $request->getBody(), true);
        $count = $body['count'] ?? 0;

        if (!is_int($count) || $count <= 0) {
            return $this->jsonResponse($response, [
                'error' => 'Invalid count: must be a positive integer.',
            ], 400);
        }

        // TODO: Replace with real data in Phase 4.1 via $game->generateTickets($count)
        if ($gameId === 'badger-five') {
            $tickets = [];
            for ($i = 0; $i < $count; $i++) {
                $ticketPanels = [];
                // BadgerFive: each ticket has 5 sub-pattern panels (matching $pattern array size)
                for ($p = 0; $p < 5; $p++) {
                    $panel = [];
                    while (count($panel) < 5) {
                        $num = random_int(1, 31);
                        if (!in_array($num, $panel, true)) {
                            $panel[] = $num;
                        }
                    }
                    sort($panel);
                    $ticketPanels[] = $panel;
                }
                $tickets[] = $ticketPanels;
            }
        } elseif ($gameId === 'supercash') {
            // SuperCash: each ticket has 6 sub-pattern panels (matching $pattern array size)
            $tickets = [];
            for ($i = 0; $i < $count; $i++) {
                $ticketPanels = [];
                for ($p = 0; $p < 6; $p++) {
                    $panel = [];
                    while (count($panel) < 6) {
                        $num = random_int(1, 39);
                        if (!in_array($num, $panel, true)) {
                            $panel[] = $num;
                        }
                    }
                    sort($panel);
                    $ticketPanels[] = $panel;
                }
                $tickets[] = $ticketPanels;
            }
        } else {
            // Should not reach here (isRegistered check above)
            return $this->jsonResponse($response, ['error' => 'Game not found'], 404);
        }

        return $this->jsonResponse($response, ['tickets' => $tickets]);
    }

    /**
     * Resolve a game ID to a GameInterface instance.
     * Returns null if the game is not registered or fails to instantiate.
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
     */
    private function jsonResponse(ResponseInterface $response, array $data, int $status = 200): ResponseInterface
    {
        $body = $response->getBody();
        $body->write(json_encode($data, JSON_PRETTY_PRINT));
        return $response->withStatus($status);
    }
}
