<?php
/*
	Service de gestion de proverbes
	CRUD 
*/


/*
    A MODIFIER --> dossier upload (en relatif)
*/
$file = "./proverbes.json";



//--------------------------------------------------------
$proverbes = array();
if (file_exists($file)) {
	$proverbes = json_decode(file_get_contents($file),true);
}

//--------------------------------------------------------
if (isset($_GET["action"])) {

	//--------------------------------------------------------
	if ($_GET["action"] == "list") {
		echo json_encode($proverbes);

	//--------------------------------------------------------
	} else if ($_GET["action"] == "add") {
		if (!isset($_GET["value"]) || empty($_GET["value"]))
			echo json_encode(array("error" => "No value specified!"));
		else {
			$newId = 0;
			foreach($proverbes as $proverbe)
				$newId = $proverbe["id"];
			$newId++;
			$value = trim(strip_tags(str_replace("\"","'",$_GET["value"])));
			$proverbes[] = array(
				"id"    => $newId,
				"value" => $value
			);
			$f = fopen($file,"w+");
			fputs($f,json_encode($proverbes));
			fclose($f);
			echo json_encode($proverbes[count($proverbes)-1]);
		}

	//--------------------------------------------------------
	} else if ($_GET["action"] == "delete") {
		if(isset($_GET["id"])) {
			$id = $_GET["id"];
			$found = false;
			$i=0;
			while(!$found && $i<count($proverbes)) {
				if ($proverbes[$i]["id"] == $id) {
					array_splice($proverbes,$i,1);
					$found = true;
				} 
				$i++;
			}
			if ($found) {
				file_put_contents($file, json_encode($proverbes));
				echo json_encode(array("ok"=>"Deleted!"));
			} else
				echo json_encode(array("error"=>"Unknown id!"));

		} else {
			echo json_encode(array("error" => "No id specified!"));

		}


	//--------------------------------------------------------
	} else if ($_GET["action"] == "update") {
		if(isset($_GET["id"]) && isset($_GET["value"])) {
			$id = $_GET["id"];
			$value = $_GET["value"];
			$found = false;
			$i=0;
			while(!$found && $i<count($proverbes)) {
				if ($proverbes[$i]["id"] == $id) {
					$proverbes[$i]["value"] = $value;
					$found = true;
				} else
					$i++;
			}
			if ($found) {
				file_put_contents($file, json_encode($proverbes));
				echo json_encode($proverbes[$i]);
			} else
				echo json_encode(array("error"=>"Unknown id!"));

		} else {
			echo json_encode(array("error" => "No id specified!"));

		}








	//--------------------------------------------------------
	} else {
		echo json_encode(array("error" => "Unknown action!"));

	}




} else {
	echo json_encode(array("error" => "No action specified!"));
}






