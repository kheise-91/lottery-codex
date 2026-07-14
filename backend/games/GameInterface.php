<?php
declare(strict_types=1);

namespace LotteryCodex\Games;

/**
 * Contract for lottery game implementations providing pattern analysis and ticket generation.
 */
interface GameInterface
{
    /**
     * Get game metadata including number range, draw frequency, and optimal pattern.
     * @return array Game details (id, name, status, numberRange, numbersPerDraw, optimalPattern, groups)
     */
    public function getGameDetails(): array;

    /**
     * Get historical drawing data for this game.
     * @return array Array of previous drawings with numbers and pattern breakdowns
     */
    public function getHistory(): array;

    /**
     * Generate prediction tickets for this game using pattern analysis.
     * @param int $count Number of tickets to generate
     * @return array Array of ticket panels, each panel being a sorted array of integers
     */
    public function generateTickets(int $count): array;
}
