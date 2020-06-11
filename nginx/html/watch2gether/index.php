<html>
<head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
  <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
  <script src="/assets/js/filednd.js"></script>
  <title>Upload</title>
  <script>
    var progList;
    var progDict = new Map();
    function onProgress(e, xhr){
      //debugger;
      if(typeof progDict.get(xhr) === 'undefined'){
        var elm = document.createElement('li');
        
        var outerDiv = document.createElement('div');
        outerDiv.classList.add('progress')
        var div = document.createElement('div');
        div.classList.add('progress-bar','progress-bar-striped','progress-bar-animated');
        outerDiv.appendChild(div);
        elm.appendChild(outerDiv);
        progList.appendChild(elm)
        progDict.set(xhr, elm);
      }
      var done = e.position || e.loaded;
      var total = e.totalSize || e.total;
      var prct = Math.floor((done/total) * 100) +  "%";
      var progbar = progDict.get(xhr).children[0].children[0];
      progbar.innerText = prct;
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
      dz.classList.add('jumbotron');
      var title = document.createElement('h1');
      title.innerText = "Upload";
      title.classList.add("display-4")
      var desc = document.createElement('p');
      desc.innerText = "Simply drag a file here to upload it or select a file using the dialog."
      desc.classList.add("lead")
      var hr = document.createElement('hr');
      hr.classList.add('my-3');
      dz.prepend(title, desc, hr);
      document.getElementById('upload').appendChild(dz);
    }
  </script>
</head>

<body>
  <div id="upload" class="container">
  </div>
  <div class="container">
    <ul id="progressList">
    </ul>
  </div>
</body>
</html>