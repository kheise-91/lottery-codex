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
        'badger-5' => \LotteryCodex\Games\BadgerFive::class,
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
                $games[] = $instance->getGameDetails();
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
     * @param string $gameId Game identifier (e.g. 'badger-5', 'supercash')
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
     * @param string $gameId Game identifier
     * @return array Historical drawings or 404/503 error
     */
    public function history(string $gameId, ResponseInterface $response): ResponseInterface
    {
        if (!$this->isRegistered($gameId)) {
            return $this->jsonResponse($response, ['error' => 'Game not found'], 404);
        }

        $game = $this->resolve($gameId);
        if (!$game) {
            return $this->jsonResponse($response, ['error' => 'Game unavailable'], 503);
        }

        try {
            $history = $game->getHistory();
        } catch (\RuntimeException $e) {
            error_log("GamesController::history failed for '{$gameId}': " . $e->getMessage());
            return $this->jsonResponse($response, ['error' => 'Drawing history is temporarily unavailable'], 503);
        }

        return $this->jsonResponse($response, ['history' => $history]);
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
