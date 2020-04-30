<html>
<head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <script src="/assets/js/filednd.js"></script>
  <script>
    var progList;
    var progDict = new Map();
    function onProgress(e, xhr){
      //debugger;
      if(typeof progDict.get(xhr) === 'undefined'){
        var elm = document.createElement('li');
        elm.innerHTML = "<div class=\"progress\">  <div class=\"progress-bar\" role=\"progressbar\" style=\"width: 0%;\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\">0%</div></div>";
        progList.appendChild(elm)
        progDict.set(xhr, elm);
      }
      var done = e.position || e.loaded;
      var total = e.totalSize || e.total;
      var prct = Math.floor((done/total) * 100) +  "%";
      var progbar = progDict.get(xhr).children[0].children[0];
      progbar.innerHTML = prct;
      progbar.style.width = prct;

    }

    function onLoad(e,xhr){
      var prog = progDict.get(xhr).children[0].children[0];
      prog.classList.add('bg-success');
      var id = (JSON.parse(xhr.responseText)).id;
      prog.innerHTML = "<a style=\"color: #FFFFFF\" href=\"watch?v="+id+"\">"+id+"</a>"
    }

    window.onload = function (){
      progList = document.getElementById('progressList');
      var dz = createDropzone("upload.php", onProgress, onLoad);
      dz.style.height= 100;
      dz.style.backgroundColor="#bbbbbb";
      document.getElementById('upload').appendChild(dz);
    }
  </script>
</head>

<body>
  <div id="upload">
  <ul id="progressList">
  </ul>
  </div>
</body>
</html>