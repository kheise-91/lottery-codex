<?php

declare(strict_types=1);

namespace LotteryCodex\Games;

require_once __DIR__ . '/../simplehtmldom/simple_html_dom.php';

/**
 * Megabucks game implementation using Lottery Codex pattern analysis (3-Odd 3-Even / 3-Low 3-High).
 */
class Megabucks implements GameInterface, \JsonSerializable
{
    private array $previousDrawings = [];

    private array $tickets = [];

    private array $lowOdd = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]; // indexes: 0-12

    private array $lowEven = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]; // indexes: 0-11

    private array $highOdd = [27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49]; // indexes: 0-11

    private array $highEven = [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]; // indexes: 0-11

    private array $pattern = [
        // 3-Odd 3-Even / 3-Low 3-High //
        ['lowOdd', 'lowOdd', 'lowEven', 'highOdd', 'highEven', 'highEven'],
        ['lowOdd', 'lowOdd', 'lowEven', 'highOdd', 'highEven', 'highEven'],
        ['lowOdd', 'lowEven', 'lowEven', 'highOdd', 'highOdd', 'highEven'],
        ['lowOdd', 'lowEven', 'lowEven', 'highOdd', 'highOdd', 'highEven'],
        ['lowOdd', 'lowOdd', 'lowOdd', 'highEven', 'highEven', 'highEven'],
        ['lowEven', 'lowEven', 'lowEven', 'highOdd', 'highOdd', 'highOdd']
    ];

    public function __construct()
    {
    }

    /**
     * Get Mebgabucks game metadata including number groups and optimal pattern.
     * @return array Game details (id, name, status, drawFrequency, numberRange, numbersPerDraw, optimalPattern, groups, description, oddsOfWinning)
     */
    public function getGameDetails(): array
    {
        return [
            'id' => 'megabucks',
            'name' => 'Megabucks',
            'status' => 'enabled',
            'drawFrequency' => ['Wednesday', 'Saturday'],
            'numberRange' => ['min' => 1, 'max' => 49],
            'numbersPerDraw' => 6,
            'optimalPattern' => '3-Odd 3-Even / 3-Low 3-High',
            'groups' => [
                'lowOdd'   => $this->getLowOdd(),
                'lowEven'  => $this->getLowEven(),
                'highOdd'  => $this->getHighOdd(),
                'highEven' => $this->getHighEven()
            ],
            'description' => 'Pick 6 numbers from 1-49 in this twice-weekly, Wisconsin-only rolling jackpot game where every $1 ticket gives you two separate plays.',
            'oddsOfWinning' => '1 in 6,991,908'
        ];
    }

    /**
     * Get historical drawing data for Megabucks.
     * @return array Array of previous drawings keyed by date, each with 'numbers' and 'pattern' keys
     */
    public function getHistory(): array
    {
        return $this->getPreviousDrawings();
    }

    /**
     * Generate prediction tickets for Megabucks using pattern analysis.
     * @param int $count Number of tickets to generate
     * @return array Array of ticket panels, each panel being a sorted array of 6 integers
     */
    public function generateTickets(int $count): array
    {
        $this->tickets = [];
        $this->createTickets($count);
        return $this->getTickets();
    }

    /**
     * Analyze pattern frequency from previous drawings, counting odd/even and low/high distributions.
     * Prints pattern counts as JSON to stdout (debug utility).
     * @param array $previousDrawings Array of drawings, each a list of integers
     */
    private function analyzePreviousDrawings(array $previousDrawings): void
    {
        $patterns = [];

        foreach ($previousDrawings as $drawing) {
            $odd = $even = 0;
            $low = $high = 0;

            foreach ($drawing as $num) {
                if (in_array($num, $this->lowOdd)) {
                    $odd++;
                    $low++;
                } elseif (in_array($num, $this->lowEven)) {
                    $even++;
                    $low++;
                } elseif (in_array($num, $this->highOdd)) {
                    $odd++;
                    $high++;
                } elseif (in_array($num, $this->highEven)) {
                    $even++;
                    $high++;
                }
            }

            $oddEven = "{$odd}-Odd {$even}-Even";
            if (!array_key_exists($oddEven, $patterns)) {
                $patterns[$oddEven] = 1;
            } else {
                $patterns[$oddEven] = $patterns[$oddEven] + 1;
            }

            $lowHigh = "{$low}-Low {$high}-High";
            if (!array_key_exists($lowHigh, $patterns)) {
                $patterns[$lowHigh] = 1;
            } else {
                $patterns[$lowHigh] = $patterns[$lowHigh] + 1;
            }
        }

        asort($patterns);

        echo json_encode(["Pattern Counts for Previous 500 Drawings" => $patterns], JSON_PRETTY_PRINT);
    }

    /**
     * Scrape and parse Wisconsin Lottery drawing history from wilottery.com,
     * classify each drawing by odd/even and low/high patterns.
     * @return self
     * @throws \Exception If the HTTP request fails or HTML parsing fails
     */
    private function loadPreviousDrawings(): self
    {
        $html = file_get_html('https://wilottery.com/winners/draw-history?game=megabucks');

        foreach ($html->find('.winning-numbers-line') as $numSet) {
            $drawing = [];

            foreach ($numSet->find('.date') as $dateContainer) {
                foreach ($dateContainer->find('strong') as $dateText) {
                    $dateDrawn = date('l, F jS', strtotime($dateText->plaintext));
                }
            }

            foreach ($numSet->find('.winning-number') as $num) {
                $drawing[] = (int) $num->plaintext;
            }

            $this->previousDrawings[$dateDrawn]['numbers'] = $drawing;
        }

        foreach ($this->previousDrawings as $dateDrawn => $drawing) {
            $odd = $even = 0;
            $low = $high = 0;

            foreach ($drawing['numbers'] as $num) {
                if (in_array($num, $this->lowOdd)) {
                    $odd++;
                    $low++;
                } elseif (in_array($num, $this->lowEven)) {
                    $even++;
                    $low++;
                } elseif (in_array($num, $this->highOdd)) {
                    $odd++;
                    $high++;
                } elseif (in_array($num, $this->highEven)) {
                    $even++;
                    $high++;
                }
            }

            $pattern = "{$odd}-Odd {$even}-Even / {$low}-Low {$high}-High";
            $this->previousDrawings[$dateDrawn]['pattern'] = $pattern;
        }

        return $this;
    }

    /**
     * Generate prediction tickets based on the optimal pattern sub-patterns.
     * Each ticket consists of 6 panels selected from the defined pattern array,
     * with uniqueness verification across all generated panels.
     * @param int $count Number of tickets to create
     * @return self
     */
    private function createTickets(int $count): self
    {
        for ($i = 0; $i < $count; $i++) {
            $ticket = [];

            foreach ($this->pattern as $subPattern) {
                // CREATE NEW PANEL FROM SUB-PATTERN //
                $panel = $this->createPanel($subPattern);

                // VERIFY PANEL IS UNIQUE ACROSS ALL GENERATED PANELS //
                $allPanels = [];
                foreach ($this->tickets as $existingTicket) {
                    $allPanels = array_merge($allPanels, $existingTicket);
                }
                while (in_array($panel, $allPanels)) {
                    $panel = $this->createPanel($subPattern);
                }

                $ticket[] = $panel;
            }

            $this->tickets[] = $ticket;
        }

        return $this;
    }

    /**
     * Create a single panel from a sub-pattern array by randomly selecting
     * one number from each group (lowOdd, lowEven, highOdd, highEven).
     * @param array $subPattern Array of group names for each position in the panel
     * @return array Sorted array of 6 integers
     */
    private function createPanel(array $subPattern): array
    {
        $panel = [];

        foreach ($subPattern as $p) {
            $cutoff = count($this->{$p}) - 1;
            $panel[] = $this->{$p}[random_int(0, $cutoff)];
        }

        sort($panel);
        return $panel;
    }

    public function setPreviousDrawings(array $previousDrawings): self
    {
        $this->previousDrawings = $previousDrawings;
        return $this;
    }

    public function getPreviousDrawings(): array
    {
        return $this->previousDrawings;
    }

    public function setTickets(array $tickets): self
    {
        $this->tickets = $tickets;
        return $this;
    }

    public function getTickets(): array
    {
        return $this->tickets;
    }

    public function getLowOdd(): array
    {
        return $this->lowOdd;
    }

    public function getLowEven(): array
    {
        return $this->lowEven;
    }

    public function getHighOdd(): array
    {
        return $this->highOdd;
    }

    public function getHighEven(): array
    {
        return $this->highEven;
    }

    public function getPattern(): array
    {
        return $this->pattern;
    }

    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
