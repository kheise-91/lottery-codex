<?php
// Dependency check: simplehtmldom is required for HTML scraping functionality
// Only load if needed (for methods that use file_get_html())
if (!file_exists(__DIR__."/../simplehtmldom/simple_html_dom.php")) {
    trigger_error("simplehtmldom dependency not found at ".__DIR__."/../simplehtmldom/simple_html_dom.php", E_USER_WARNING);
}

class SuperCash implements JsonSerializable {

	private $previousDrawings = array();

	private $panels = array();


	private $lowOdd   = [ 1,  3,  5,  7,  9, 11, 13, 15, 17, 19]; // 0,9

	private $lowEven  = [ 2,  4,  6,  8, 10, 12, 14, 16, 18, 20]; // 0,9

	private $highOdd  = [21, 23, 25, 27, 29, 31, 33, 35, 37, 39]; // 0,9

	private $highEven = [22, 24, 26, 28, 30, 32, 34, 36, 38];     // 0,8


	private $pattern1 = [
		// 3-Odd 3-Even / 3-Low 3-High //
		1 => ['lowOdd',  'lowOdd',  'lowEven', 'highOdd',  'highEven', 'highEven'],
		2 => ['lowOdd',  'lowEven', 'lowEven', 'highOdd',  'highOdd',  'highEven'],
		3 => ['lowOdd',  'lowOdd',  'lowOdd',  'highEven', 'highEven', 'highEven'],
		4 => ['lowEven', 'lowEven', 'lowEven', 'highOdd',  'highOdd',  'highOdd' ]
	];


	public function __construct() {
		// SuperCashPD dependency removed - file does not exist
		// $this->pd = new SuperCashPD();

		// Constructor now instantiates without requiring external dependencies
		// Analysis methods can be called directly via analyzePreviousDrawings()
	}

	private function analyzePreviousDrawings($previousDrawings) {
		$patterns = [];

		foreach ($previousDrawings AS $drawing) {
			$odd = $even = 0;
			$low = $high = 0;

			foreach ($drawing AS $num) {
				if      (in_array($num, $this->lowOdd))   { $odd++;  $low++; }
				else if (in_array($num, $this->lowEven))  { $even++; $low++; }
				else if (in_array($num, $this->highOdd))  { $odd++;  $high++; }
				else if (in_array($num, $this->highEven)) { $even++; $high++; }
			}

			$oddEven = "$odd-Odd $even-Even";
			if (!array_key_exists($oddEven, $patterns)) {
				$patterns[$oddEven] = 1;
			} else {
				$patterns[$oddEven] = $patterns[$oddEven] + 1;
			}

			$lowHigh = "$low-Low $high-High";
			if (!array_key_exists($lowHigh, $patterns)) {
				$patterns[$lowHigh] = 1;
			} else {
				$patterns[$lowHigh] = $patterns[$lowHigh] + 1;
			}
		}

		asort($patterns);

		echo json_encode(["Pattern Counts for Previous 500 Drawings" => $patterns], JSON_PRETTY_PRINT);
	}

	// private function loadPreviousDrawings() {
	// 	// Get previous drawing numbers to look at which patterns have been drawn recently
	// 	$html = file_get_html('https://wilottery.com/winners/draw-history?game=supercash');
	// 	foreach ($html->find('.winning-numbers-line') AS $numSet) {
	// 		$drawing = array();

	// 		foreach ($numSet->find('.date') AS $dateContainer) {
	// 			foreach ($dateContainer->find('strong') AS $dateText) {
	// 				$dateDrawn = date('l, F jS', strtotime($dateText->plaintext));
	// 			}
	// 		}

	// 		foreach ($numSet->find('.winning-number') AS $num) {
	// 			$drawing[] = intval($num->plaintext);
	// 		}

	// 		$this->previousDrawings[$dateDrawn]['numbers'] = $drawing;
	// 	}

	// 	foreach ($this->previousDrawings AS $dateDrawn => $drawing) {
	// 		$odd = $even = 0;
	// 		$low = $high = 0;
	// 		foreach ($drawing['numbers'] AS $num) {
	// 			if (in_array($num, $this->lowOdd))        { $odd++;  $low++; }
	// 			else if (in_array($num, $this->lowEven))  { $even++; $low++; }
	// 			else if (in_array($num, $this->highOdd))  { $odd++;  $high++; }
	// 			else if (in_array($num, $this->highEven)) { $even++; $high++; }
	// 		}

	// 		$pattern = "{$odd}-Odd {$even}-Even / {$low}-Low {$high}-High";
	// 		$this->previousDrawings[$dateDrawn]['pattern'] = $pattern;
	// 	}
	// }

	// private function loadAllPanels() {
	// 	for ($pattern = 1; $pattern <= 2; $pattern++) {
	// 		$this->panels["pattern{$pattern}"] = array();

	// 		for ($set = 1; $set <= 2; $set++) {
	// 			$this->panels["pattern{$pattern}"]["set{$set}"] = array();
	// 			$excludedNumbers = array();

	// 			for ($panel = 1; $panel <= 3; $panel++) {
	// 				// NOTE: Loop must use <= to include first panel (fix: change < to <=)
	// 				for ($panelNum = 1; $panelNum <= $panel; $panelNum++) {
	// 					$thisPanel = ${"panel{$panelNum}"};

	// 					foreach ($thisPanel AS $num) {
	// 						$excludedNumbers[] = $num;
	// 					}
	// 				}

	// 				${"panel{$panel}"} = $this->generatePanel($pattern, $excludedNumbers);
	// 				$this->panels["pattern{$pattern}"]["set{$set}"]["panel{$panel}"] = ${"panel{$panel}"};
	// 			}
	// 		}
	// 	}
	// }

	// private function loadPanels($totalSets, $totalPanels, $patternNum) {
	// 	$panelCt = 1;
	// 	$panelsPerSet = round(($totalPanels / $totalSets));

	// 	for ($set = 1; $set <= $totalSets; $set++) {
	// 		$excludedNumbers = array();
	// 		$this->panels["set{$set}"] = array();

	// 		for ($panel = 1; $panel <= $panelsPerSet; $panel++) {
	// 			// NOTE: Loop must use <= to include first panel (fix: change < to <=)
	// 			for ($panelNum = 1; $panelNum <= $panel; $panelNum++) {
	// 				$thisPanel = ${"panel{$panelNum}"};

	// 				foreach ($thisPanel AS $num) {
	// 					$excludedNumbers[] = $num;
	// 				}
	// 			}

	// 			${"panel{$panel}"} = $this->generatePanel($patternNum, $excludedNumbers);
	// 			$this->panels["set{$set}"]["panel{$panel}"] = ${"panel{$panel}"};

	// 			$panelCt++;
	// 			if ($panelCt > $totalPanels) break 2;
	// 		}
	// 	}
	// }

	// private function generatePanel($patternNum, $excludedNumbers) {
	// 	$panel   = array();
	// 	$pattern = $this->{"pattern{$patternNum}"};

	// 	foreach ($pattern AS $i => $p) {
	// 		$cutoff = ($p == 'highEven') ? 6 : 7;
	// 		$num = $this->{$p}[rand(0, $cutoff)];
			
	// 		while (in_array($num, $excludedNumbers)) {
	// 			$num = $this->{$p}[rand(0, $cutoff)];
	// 		}

	// 		array_push($panel, $num);
	// 		array_push($excludedNumbers, $num);
	// 	}

	// 	sort($panel);
	// 	return $panel;
	// }


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


	public function jsonSerialize() {
        $vars = get_object_vars($this);
        return $vars;
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
} ?>