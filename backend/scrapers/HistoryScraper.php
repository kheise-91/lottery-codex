<?php

declare(strict_types=1);

namespace LotteryCodex\Scrapers;

/**
 * Shared scraper for wilottery.com draw-history pages.
 *
 * Fetches the draw-history page for a given game and parses it into an
 * array of previous drawings keyed by formatted date, ready to be consumed
 * by the game classes' pattern analysis.
 */
class HistoryScraper
{
    /**
     * Scrape the wilottery.com draw-history page for a game.
     * @param string $gameId The ?game= slug (badger-5, supercash, megabucks)
     * @return array Array keyed by formatted date (e.g. "Wednesday, September 2nd"), each value ['numbers' => int[]]
     * @throws \RuntimeException If the HTTP request fails or returns a non-2xx status
     */
    public function scrape(string $gameId): array
    {
        $html = $this->fetch("https://wilottery.com/winners/draw-history?game={$gameId}");

        libxml_use_internal_errors(true);
        $dom = new \DOMDocument();
        $dom->loadHTML($html);
        libxml_clear_errors();

        $xpath = new \DOMXPath($dom);
        $rows = $xpath->query('//*[contains(@class, "winning-numbers-line")]');

        $drawings = [];
        foreach ($rows as $row) {
            $dateNodes = $xpath->query('.//*[contains(@class, "date")]//strong', $row);
            if ($dateNodes->length === 0) {
                continue;
            }

            $rawDateText = $dateNodes->item(0)->textContent;
            $formattedDate = date('l, F jS', strtotime($rawDateText));

            $numbers = [];
            foreach ($xpath->query('.//*[contains(@class, "winning-number")]', $row) as $numNode) {
                $numbers[] = (int) $numNode->textContent;
            }

            $drawings[$formattedDate]['numbers'] = $numbers;
        }

        return $drawings;
    }

    /**
     * Fetch a URL with cURL using browser-like headers and explicit timeouts.
     * @param string $url The URL to fetch
     * @return string The response body
     * @throws \RuntimeException On cURL error, empty response, or non-2xx HTTP status
     */
    private function fetch(string $url): string
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

        $body = curl_exec($ch);
        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($body === false || $body === '') {
            throw new \RuntimeException(
                "Failed to fetch draw history: {$curlError}"
            );
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            throw new \RuntimeException(
                "Draw history request failed with HTTP status {$httpCode}"
            );
        }

        return $body;
    }
}
