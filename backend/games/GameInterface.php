<?php
declare(strict_types=1);

namespace LotteryCodex\Games;

interface GameInterface
{
    public function getGameDetails(): array;
    public function getHistory(): array;
    public function generatePanels(int $tickets): array;
}
