<?php

declare(strict_types=1);

namespace LotteryCodex\Games;

class SuperCash implements \JsonSerializable
{
    private array $previousDrawings = [];

    private array $panels = [];

    private array $lowOdd = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]; // indexes: 0-9

    private array $lowEven = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]; // indexes: 0-9

    private array $highOdd = [21, 23, 25, 27, 29, 31, 33, 35, 37, 39]; // indexes: 0-9

    private array $highEven = [22, 24, 26, 28, 30, 32, 34, 36, 38]; // indexes: 0-8

    private array $pattern = [
        // 3-Odd 3-Even / 3-Low 3-High //
        1 => ['lowOdd', 'lowOdd', 'lowEven', 'highOdd', 'highEven', 'highEven'],
        2 => ['lowOdd', 'lowEven', 'lowEven', 'highOdd', 'highOdd', 'highEven'],
        3 => ['lowOdd', 'lowOdd', 'lowOdd', 'highEven', 'highEven', 'highEven'],
        4 => ['lowEven', 'lowEven', 'lowEven', 'highOdd', 'highOdd', 'highOdd'],
    ];

    public function __construct(
        private int $numOfTickets
    ) {
    }

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

    private function loadPanels(): self
    {
        for ($ticket = 1; $ticket <= $this->numOfTickets; $ticket++) {
            foreach ($this->pattern as $subPattern) {
                // CREATE NEW PANEL //
                $newPanel = $this->generatePanel($subPattern);

                // VERIFY PANEL IS UNIQUE //
                while (in_array($newPanel, $this->panels)) {
                    $newPanel = $this->generatePanel($subPattern);
                }

                // ADD PANEL TO MASTER ARRAY //
                $this->panels[] = $newPanel;
            }
        }

        return $this;
    }

    private function generatePanel(array $subPattern): array
    {
        $panel = [];

        foreach ($subPattern as $i => $p) {
            $cutoff = count($this->{"{$p}"}) - 1;
            $num = $this->{$p}[rand(0, $cutoff)];

            array_push($panel, $num);
        }

        sort($panel);
        return $panel;
    }

    //==== GETTERS AND SETTERS ================================================================================================================//
    public function setPreviousDrawings(array $previousDrawings): self
    {
        $this->previousDrawings = $previousDrawings;
        return $this;
    }

    public function getPreviousDrawings(): array
    {
        return $this->previousDrawings;
    }

    public function setPanels(array $panels): self
    {
        $this->panels = $panels;
        return $this;
    }

    public function getPanels(): array
    {
        return $this->panels;
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
