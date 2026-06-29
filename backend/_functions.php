<?php 

	function autoload($class) {
		$dir = "games";
		if (file_exists(__DIR__."/{$dir}/{$class}.php")) {
		    require_once __DIR__."/{$dir}/{$class}.php";
		}
	}

	function classExists($class) {
		$dir = "games";
		return file_exists(__DIR__."/{$dir}/{$class}.php");
	}

?>