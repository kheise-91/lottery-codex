<?php
require_once __DIR__."/../simple_html_dom.php";

class BadgerFive implements JsonSerializable {

	private $previousDrawings = array();

	private $panels = array();


	private $lowOdd   = [ 1,  3,  5,  7,  9, 11, 13, 15]; // 0,7

	private $lowEven  = [ 2,  4,  6,  8, 10, 12, 14, 16]; // 0,7

	private $highOdd  = [17, 19, 21, 23, 25, 27, 29, 31]; // 0,7

	private $highEven = [18, 20, 22, 24, 26, 28, 30];     // 0,6


	private $pattern1 = [
		// 3-Odd 2-Even / 3-Low 2-High //
		1 => ['lowOdd', 'lowOdd',  'lowEven', 'highOdd',  'highEven'], 
		2 => ['lowOdd', 'lowEven', 'lowEven', 'highOdd',  'highOdd' ], 
		3 => ['lowOdd', 'lowOdd',  'lowOdd',  'highEven', 'highEven']  
	];


	private $pattern2 = [
		// 3-Odd 2-Even / 2-Low 3-High //
		1 => ['lowOdd',  'lowEven', 'highOdd', 'highOdd',  'highEven'], 
		2 => ['lowOdd',  'lowOdd',  'highOdd', 'highEven', 'highEven'], 
		3 => ['lowEven', 'lowEven', 'highOdd', 'highOdd',  'highOdd' ]  
	];


	private $pattern3 = [
		// 2-Odd 3-Even / 3-Low 2-High //
		1 => ['lowOdd',  'lowEven', 'lowEven', 'highOdd',  'highEven'], 
		2 => ['lowOdd',  'lowOdd',  'lowEven', 'highEven', 'highEven'], 
		3 => ['lowEven', 'lowEven', 'lowEven', 'highOdd',  'highOdd' ]  
	];


	public function __construct($patternNum, $numOfTickets) {
		$this->loadPreviousDrawings();
		$this->loadPanels($patternNum, $numOfTickets);

		/*
			header('Content-Type: application/json');
			die(json_encode([
				"Previous Drawings" => $this->previousDrawings,
				"Panels" => $this->panels
			], JSON_PRETTY_PRINT));
		//*/
	}


	/**
	 *	THIS FUNCTION WILL CREATE AN ARRAY WITH THE MOST RECENTLY DRAWN NUMBERS AND THE MATCHING PATTERN
	 * 	BASED ON DATA FROM THE WISCONSIN LOTTERY WEB SITE. THIS ARRAY WILL BE STORED AS A CLASS PROPERTY.
	 * 
	 * 	@property Previous Drawings
	 */
	private function loadPreviousDrawings() {
		// ANALYZE PATTERNS OF PREVIOUS DRAWINGS //
		$html = file_get_html('https://wilottery.com/winners/draw-history?game=badger-5');

		foreach ($html->find('.winning-numbers-line') AS $numSet) {
			$drawing = array();

			foreach ($numSet->find('.date') AS $dateContainer) {
				foreach ($dateContainer->find('strong') AS $dateText) {
					$dateDrawn = date('l, F jS', strtotime($dateText->plaintext));
				}
			}

			foreach ($numSet->find('.winning-number') AS $num) {
				$drawing[] = intval($num->plaintext);
			}

			$this->previousDrawings[$dateDrawn]['numbers'] = $drawing;
		}

		foreach ($this->previousDrawings AS $dateDrawn => $drawing) {
			$odd = $even = 0;
			$low = $high = 0;

			foreach ($drawing['numbers'] AS $num) {
				if      (in_array($num, $this->lowOdd))   { $odd++;  $low++; }
				else if (in_array($num, $this->lowEven))  { $even++; $low++; }
				else if (in_array($num, $this->highOdd))  { $odd++;  $high++; }
				else if (in_array($num, $this->highEven)) { $even++; $high++; }
			}

			$pattern = "{$odd}-Odd {$even}-Even / {$low}-Low {$high}-High";
			$this->previousDrawings[$dateDrawn]['pattern'] = $pattern;
		}
	}


	/**
	 *	THIS FUNCTION WILL GENERATE 5 PANELS PER TICKET DESIRED.
	 * 	EACH SET OF PANELS PER SUB-PATTERN PER TICKET WILL BE UNIQUE.
	 * 	3 PANELS WILL BE CREATED FROM THE FIRST SUB-PATTERN, 1 FROM THE SECOND, AND 1 FROM THE THIRD.
	 * 
	 * 	THESE PANELS, ALONG WITH THEIR SUB-PATTERNS, WILL BE STORED AS A CLASS PROPERTY.
	 * 
	 * 	@param    Pattern Number
	 * 	@param    Number Of Tickets
	 * 	@property Panels
	 */
	private function loadPanels($patternNum, $numOfTickets) {
		$pattern  = $this->{"pattern{$patternNum}"};

		for ($ticket = 1; $ticket <= $numOfTickets; $ticket++) {
			foreach ($pattern AS $subNum => $subPattern) {
				$panelLimit      = ($subNum === 1) ? 3 : 1;
				$excludedNumbers = array();

				for ($panel = 1; $panel <= $panelLimit; $panel++) {
					// CREATE NEW PANEL //
					$newPanel = $this->generatePanel($subPattern, $excludedNumbers);

					// VERIFY PANEL IS UNIQUE //
					while (in_array($newPanel, $this->panels)) {
						$newPanel = $this->generatePanel($subPattern, $excludedNumbers);
					}

					// ADD PANEL TO EXCLUDED NUMBERS FOR FIRST SUB-PATTERN //
					if ($subNum === 1) {
						foreach ($newPanel AS $num) {
							$excludedNumbers[] = $num;
						}
					} else {
						$excludedNumbers = array();
					}

					// ADD PANEL TO MASTER ARRAY //
					$this->panels[] = $newPanel;
				}
			}
		}
	}


	/**
	 * 	GENERATES A PANEL OF 5 RANDOM NUMBERS BASED ON THE SUB-PATTERN AND EXCLUDED NUMBERS.
	 * 
	 * 	@param  Sub-Pattern
	 * 	@param  Excluded Numbers
	 * 	@return Panel
	 */
	private function generatePanel($pattern, $excluded) {
		$panel   = array();

		foreach ($pattern AS $i => $p) {
			$cutoff = ($p == 'highEven') ? 6 : 7;
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


	/**
	 * 	FORMATS THE SELECTED PATTERN AS A STRING FOR DISPLAY PURPOSES.
	 * 
	 * 	@param  Pattern
	 * 	@return Formatted Pattern
	 */
	public function formatPattern($patternNum) {
		return ($patternNum == 3 ? "2-Odd 3-Even / 3-Low 2-High" 
			 : ($patternNum == 2 ? "3-Odd 2-Even / 2-Low 3-High" 
			 : "3-Odd 2-Even / 3-Low 2-High"));
	}


	/**
	 * 	FORMATS THE SELECTED SUB-PATTERN AS A STRING FOR DISPLAY PURPOSES.
	 * 
	 * 	@param  Pattern
	 * 	@param  Sub-Pattern
	 * 	@return Formatted Sub-Pattern
	 */
	public function formatSubPattern($patternNum, $subPatternNum) {
		$string = "";
		$prevRange = "Low";

		foreach ($this->{"pattern{$patternNum}"}[$subPatternNum] AS $group) {
			$group  = str_replace(['lowOdd', 'lowEven', 'highOdd', 'highEven'], ['Low-Odd', 'Low-Even', 'High-Odd', 'High-Even'], $group);
			$pieces = explode('-', $group);
			$range  = $pieces[0];

			$string .= ($range === $prevRange) ? " {$group}" : " / {$group}";
			$prevRange = $range;
		}

		return trim($string);
	}


//==== GETTERS AND SETTERS ================================================================================================================//
	public function setPreviousDrawings($previousDrawings) {
		$this->previousDrawings = $previousDrawings;
		return $this;
	}
	public function getPreviousDrawings() {
		return $this->previousDrawings;
	}


	public function setPanels($panels) {
		$this->panels = $panels;
		return $this;
	}
	public function getPanels() {
		return $this->panels;
	}


	public function getLowOdd() { 
		return $this->lowOdd; 
	}

	public function getLowEven() { 
		return $this->lowEven; 
	}

	public function getHighOdd() { 
		return $this->highOdd; 
	}

	public function getHighEven() { 
		return $this->highEven; 
	}


	public function getPattern1() { 
		return $this->pattern1; 
	}


	public function getPattern2() { 
		return $this->pattern2; 
	}


	public function getPattern3() { 
		return $this->pattern3; 
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize() {
        $vars = get_object_vars($this);
        return $vars;
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} ?>
