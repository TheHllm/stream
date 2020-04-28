<!DOCTYPE html>
<html>

<head>
        <meta charset="utf-8">
        <title>stream</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" media="screen" href="/index.css">
</head>

<body>
        <div class="content">
        <table> 
        <tr><th>Name</th><th>Password Protected</th><th>Viewers</th></tr>
        <?php
                $stats = file_get_contents("http://nginx/stats");
                $xml = simplexml_load_string($stats);
                $hsl = $xml->xpath("//application[name='dash']")[0];
                
                foreach($hsl->live->stream as $stream){
                        
                        $fullname = (string)$stream->name;
                        $particles = explode(":", $fullname, 2);
                        $name = htmlspecialchars($particles[0]);
                        $protected = false;

                        if(count($particles) > 1){
                                $protected = true;
                                $password = $particles[1];
                        }
                        
                        echo "<tr onclick='window.location = \"/stream/".filter_var($name, FILTER_SANITIZE_ENCODED)."\"'><td>".$name."</td><td>".($protected ? "yes" : "no")."</td><td>?</td></tr>";
                }
        ?>
        </table>
        </div>
</body>