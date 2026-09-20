<?php

declare(strict_types=1);

namespace LotteryCodex\Scrapers;

/**
 * Shared scraper for wilottery.com game pages' current jackpot.
 *
 * Fetches the game page for a given game and parses the `.current-jackpot .jackpot-amount`
 * element(s) into a jackpot value: a verbatim dollar string for Badger Five, or an
 * ['annuity' => …, 'cash' => …] array of `$<number><unit>` strings for Megabucks.
 */
class JackpotScraper
{
    /**
     * Scrape the current jackpot from the wilottery.com game page for a game.
     * @param string $gameId The ?game= slug (badger-5, megabucks)
     * @return string|array Verbatim dollar string for 'badger-5'; ['annuity' => string, 'cash' => string] for 'megabucks'
     * @throws \RuntimeException If the HTTP request fails, returns a non-2xx status, the page has no jackpot element(s), or the game id is unsupported
     */
    public static function scrape(string $gameId): string|array
    {
        $html = self::fetch("https://wilottery.com/games/{$gameId}", $gameId);

        libxml_use_internal_errors(true);
        $dom = new \DOMDocument();
        $dom->loadHTML($html);
        libxml_clear_errors();

        $xpath = new \DOMXPath($dom);

        return match ($gameId) {
            'badger-5' => self::scrapeBadgerFive($xpath),
            'megabucks' => self::scrapeMegabucks($xpath),
            default => throw new \RuntimeException("Unsupported game id for jackpot scraping: {$gameId}"),
        };
    }

    /**
     * Parse the single `.current-jackpot .jackpot-amount` node into its verbatim text.
     * @param \DOMXPath $xpath XPath over the loaded game page
     * @return string The trimmed `textContent` of the jackpot element (e.g. "$53,000")
     * @throws \RuntimeException If the page has no `.current-jackpot .jackpot-amount` node
     */
    private static function scrapeBadgerFive(\DOMXPath $xpath): string
    {
        $nodes = $xpath->query('//*[contains(@class, "current-jackpot")]//*[contains(concat(" ", normalize-space(@class), " "), " jackpot-amount ")]');

        if ($nodes->length !== 1) {
            throw new \RuntimeException("Expected exactly one .current-jackpot .jackpot-amount node for badger-5, found {$nodes->length}");
        }

        return trim($nodes->item(0)->textContent);
    }

    /**
     * Parse the two `.current-jackpot .jackpot-amount` nodes into `$<number><unit>` strings.
     * @param \DOMXPath $xpath XPath over the loaded game page
     * @return array{annuity: string, cash: string} Composed jackpot values (e.g. ["annuity" => "$1.8M", "cash" => "$0.9M"])
     * @throws \RuntimeException If the page has fewer than two `.current-jackpot .jackpot-amount` nodes
     */
    private static function scrapeMegabucks(\DOMXPath $xpath): array
    {
        $nodes = $xpath->query('//*[contains(@class, "current-jackpot")]//*[contains(concat(" ", normalize-space(@class), " "), " jackpot-amount ")]');

        if ($nodes->length < 2) {
            throw new \RuntimeException("Expected at least two .current-jackpot .jackpot-amount nodes for megabucks, found {$nodes->length}");
        }

        $first = $nodes->item(0);
        $second = $nodes->item(1);

        return [
            'annuity' => self::composeJackpotValue($xpath, $first),
            'cash' => self::composeJackpotValue($xpath, $second),
        ];
    }

    /**
     * Compose a `$<number><unit>` string from a jackpot node's text and unit `<span>`.
     * @param \DOMXPath $xpath XPath over the loaded game page
     * @param \DOMNode $node The `.current-jackpot .jackpot-amount` node
     * @return string The composed value (e.g. "$1.8M")
     */
    private static function composeJackpotValue(\DOMXPath $xpath, \DOMNode $node): string
    {
        $unitNodes = $xpath->query('span', $node);
        $unit = $unitNodes->length > 0 ? trim($unitNodes->item(0)->textContent) : '';

        // The unit <span> is a child of the jackpot node, so strip it out to isolate the number.
        $text = $node->textContent;
        foreach ($unitNodes as $unitNode) {
            $text = str_replace($unitNode->textContent, '', $text);
        }
        $number = trim($text);

        return match (strtoupper($unit)) {
            'MIL' => self::withDollarPrefix($number) . 'M',
            'K' => self::withDollarPrefix($number) . 'K',
            '' => self::withDollarPrefix($number),
            default => self::withDollarPrefix($number) . strtoupper($unit),
        };
    }

    /**
     * Ensure a number text is prefixed with `$`.
     * @param string $text The trimmed number text
     * @return string The text with a leading `$` if it lacked one
     */
    private static function withDollarPrefix(string $text): string
    {
        return str_starts_with($text, '$') ? $text : "\${$text}";
    }

    /**
     * Fetch a URL with cURL using browser-like headers and explicit timeouts.
     * @param string $url The URL to fetch
     * @param string $gameId The game slug, used in error messages
     * @return string The response body
     * @throws \RuntimeException On cURL error, empty response, or non-2xx HTTP status
     */
    private static function fetch(string $url, string $gameId): string
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
                "Failed to fetch jackpot for {$gameId}: {$curlError}"
            );
        }

        if ($httpCode < 200 || $httpCode >= 300) {
            throw new \RuntimeException(
                "Jackpot request for {$gameId} failed with HTTP status {$httpCode}"
            );
        }

        return $body;
    }
}
