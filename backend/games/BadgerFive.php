<?php

declare(strict_types=1);

namespace LotteryCodex\Games;

require_once __DIR__ . '/../simple_html_dom.php';

class BadgerFive implements \JsonSerializable
{
    private array $previousDrawings = [];

    private array $panels = [];

    private array $lowOdd = [1, 3, 5, 7, 9, 11, 13, 15]; // indexes: 0-7

    private array $lowEven = [2, 4, 6, 8, 10, 12, 14, 16]; // indexes: 0-7

    private array $highOdd = [17, 19, 21, 23, 25, 27, 29, 31]; // indexes: 0-7

    private array $highEven = [18, 20, 22, 24, 26, 28, 30]; // indexes: 0-6

    private array $pattern1 = [
        // 3-Odd 2-Even / 3-Low 2-High //
        1 => ['lowOdd', 'lowOdd', 'lowEven', 'highOdd', 'highEven'],
        2 => ['lowOdd', 'lowEven', 'lowEven', 'highOdd', 'highOdd'],
        3 => ['lowOdd', 'lowOdd', 'lowOdd', 'highEven', 'highEven'],
    ];

    private array $pattern2 = [
        // 3-Odd 2-Even / 2-Low 3-High //
        1 => ['lowOdd', 'lowEven', 'highOdd', 'highOdd', 'highEven'],
        2 => ['lowOdd', 'lowOdd', 'highOdd', 'highEven', 'highEven'],
        3 => ['lowEven', 'lowEven', 'highOdd', 'highOdd', 'highOdd'],
    ];

    private array $pattern3 = [
        // 2-Odd 3-Even / 3-Low 2-High //
        1 => ['lowOdd', 'lowEven', 'lowEven', 'highOdd', 'highEven'],
        2 => ['lowOdd', 'lowOdd', 'lowEven', 'highEven', 'highEven'],
        3 => ['lowEven', 'lowEven', 'lowEven', 'highOdd', 'highOdd'],
    ];

    public function __construct(
        private int $patternNum,
        private int $numOfTickets
    ) {
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
        $pattern = $this->{"pattern{$this->patternNum}"};

        for ($ticket = 1; $ticket <= $this->numOfTickets; $ticket++) {
            foreach ($pattern as $subNum => $subPattern) {
                $panelLimit = ($subNum === 1) ? 3 : 1;
                $excludedNumbers = [];

                for ($panel = 1; $panel <= $panelLimit; $panel++) {
                    // CREATE NEW PANEL //
                    $newPanel = $this->generatePanel($subPattern, $excludedNumbers);

                    // VERIFY PANEL IS UNIQUE //
                    while (in_array($newPanel, $this->panels)) {
                        $newPanel = $this->generatePanel($subPattern, $excludedNumbers);
                    }

                    // ADD PANEL TO EXCLUDED NUMBERS FOR FIRST SUB-PATTERN //
                    if ($subNum === 1) {
                        foreach ($newPanel as $num) {
                            $excludedNumbers[] = $num;
                        }
                    } else {
                        $excludedNumbers = [];
                    }

                    // ADD PANEL TO MASTER ARRAY //
                    $this->panels[] = $newPanel;
                }
            }
        }

        return $this;
    }

    private function generatePanel(array $pattern, array $excluded): array
    {
        $panel = [];

        foreach ($pattern as $i => $p) {
            $cutoff = ($p === 'highEven') ? 6 : 7;
            $num = $this->{$p}[rand(0, $cutoff)];

            while (in_array($num, $excluded)) {
                $num = $this->{$p}[rand(0, $cutoff)];
            }

            array_push($panel, $num);
            array_push($excluded, $num);
        }

        sort($panel);
        return $panel;
    }

    public function formatPattern(int $patternNum): string
    {
        return ($patternNum === 3)
            ? "2-Odd 3-Even / 3-Low 2-High"
            : ($patternNum === 2
                ? "3-Odd 2-Even / 2-Low 3-High"
                : "3-Odd 2-Even / 3-Low 2-High");
    }

    public function formatSubPattern(int $patternNum, int $subPatternNum): string
    {
        $string = '';
        $prevRange = 'Low';

        foreach ($this->{"pattern{$patternNum}"}[$subPatternNum] as $group) {
            $group = str_replace(
                ['lowOdd', 'lowEven', 'highOdd', 'highEven'],
                ['Low-Odd', 'Low-Even', 'High-Odd', 'High-Even'],
                $group
            );
            $pieces = explode('-', $group);
            $range = $pieces[0];

            $string .= ($range === $prevRange) ? " {$group}" : " / {$group}";
            $prevRange = $range;
        }

        return trim($string);
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

    public function getPattern1(): array
    {
        return $this->pattern1;
    }

    public function getPattern2(): array
    {
        return $this->pattern2;
    }

    public function getPattern3(): array
    {
        return $this->pattern3;
    }

    public function jsonSerialize(): array
    {
        return get_object_vars($this);
    }
}
