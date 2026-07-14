<?php

declare(strict_types=1);

namespace LotteryCodex\Games;

require_once __DIR__ . '/../simplehtmldom/simple_html_dom.php';

/**
 * Badger Five game implementation using Lottery Codex pattern analysis (3-Odd 2-Even / 3-Low 2-High).
 */
class BadgerFive implements GameInterface, \JsonSerializable
{
    private array $previousDrawings = [];

    private array $tickets = [];

    private array $lowOdd = [1, 3, 5, 7, 9, 11, 13, 15]; // indexes: 0-7

    private array $lowEven = [2, 4, 6, 8, 10, 12, 14, 16]; // indexes: 0-7

    private array $highOdd = [17, 19, 21, 23, 25, 27, 29, 31]; // indexes: 0-7

    private array $highEven = [18, 20, 22, 24, 26, 28, 30]; // indexes: 0-6

    private array $pattern = [
        // 3-Odd 2-Even / 3-Low 2-High //
        ['lowOdd', 'lowOdd', 'lowEven', 'highOdd', 'highEven'],
        ['lowOdd', 'lowOdd', 'lowEven', 'highOdd', 'highEven'],
        ['lowOdd', 'lowOdd', 'lowEven', 'highOdd', 'highEven'],
        ['lowOdd', 'lowEven', 'lowEven', 'highOdd', 'highOdd'],
        ['lowOdd', 'lowOdd', 'lowOdd', 'highEven', 'highEven']
    ];

    public function __construct()
    {
    }

    /**
     * Get Badger Five game metadata including number groups and optimal pattern.
     * @return array Game details (id, name, status, drawFrequency, numberRange, numbersPerDraw, optimalPattern, groups)
     */
    public function getGameDetails(): array
    {
        return [
            'id' => 'badger-five',
            'name' => 'Badger 5',
            'status' => 'enabled',
            'drawFrequency' => ['Daily'],
            'numberRange' => ['min' => 1, 'max' => 31],
            'numbersPerDraw' => 5,
            'optimalPattern' => '3-Odd 2-Even / 3-Low 2-High',
            'groups' => [
                'lowOdd'   => $this->getLowOdd(),
                'lowEven'  => $this->getLowEven(),
                'highOdd'  => $this->getHighOdd(),
                'highEven' => $this->getHighEven(),
            ],
        ];
    }

    /**
     * Get historical drawing data by loading previous drawings from the lottery website.
     * @return array Array of previous drawings keyed by date, each with 'numbers' and 'pattern' keys
     */
    public function getHistory(): array
    {
        $this->loadPreviousDrawings();
        return $this->getPreviousDrawings();
    }

    /**
     * Generate prediction tickets for Badger Five using pattern analysis.
     * @param int $count Number of tickets to generate
     * @return array Array of ticket panels, each panel being a sorted array of 5 integers
     */
    public function generateTickets(int $count): array
    {
        $this->tickets = [];
        $this->createTickets($count);
        return $this->getTickets();
    }

    /**
     * Scrape and parse Wisconsin Lottery drawing history from wilottery.com,
     * classify each drawing by odd/even and low/high patterns.
     * @return self
     * @throws \Exception If the HTTP request fails or HTML parsing fails
     */
    private function loadPreviousDrawings(): self
    {
        $html = file_get_html('https://wilottery.com/winners/draw-history?game=badger-5');

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
     * Each ticket consists of 5 panels selected from the defined pattern array,
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
     * @return array Sorted array of 5 integers
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

    /**
     * The two functions below this are commented out for the time being. 
     * I'm not sure if I will need them. 
     * They're not being used, but just to be safe, I commented them out in case I want to use them again at a later date.
     */
    // public function formatPattern(int $patternNum): string
    // {
    //     return ($patternNum === 3)
    //         ? "2-Odd 3-Even / 3-Low 2-High"
    //         : ($patternNum === 2
    //             ? "3-Odd 2-Even / 2-Low 3-High"
    //             : "3-Odd 2-Even / 3-Low 2-High");
    // }

    // public function formatSubPattern(int $patternNum, int $subPatternNum): string
    // {
    //     $string = '';
    //     $prevRange = 'Low';

    //     foreach ($this->{"pattern{$patternNum}"}[$subPatternNum] as $group) {
    //         $group = str_replace(
    //             ['lowOdd', 'lowEven', 'highOdd', 'highEven'],
    //             ['Low-Odd', 'Low-Even', 'High-Odd', 'High-Even'],
    //             $group
    //         );
    //         $pieces = explode('-', $group);
    //         $range = $pieces[0];

    //         $string .= ($range === $prevRange) ? " {$group}" : " / {$group}";
    //         $prevRange = $range;
    //     }

    //     return trim($string);
    // }

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
