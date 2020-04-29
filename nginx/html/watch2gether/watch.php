<html>
<head>
    
</head>
    <script src="/assets/js/socket.io.js"></script>
    <script src="watch.js"> </script>
<body>
    <video id="video" data-video="<?php echo htmlentities($_GET['v']);?>" controls>
        <source src="/uploads/<?php echo htmlentities($_GET['v']);?>">
    </video>
</body>
</html>