<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="color-scheme" content="dark light">
  <link rel="stylesheet" href="/assets/css/theme.light.css">
  <link rel="stylesheet" href="/assets/css/theme.dark.css">
  <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css">
  <link rel="manifest" href="/manifest.json">
  <script src="/assets/js/filednd.js"></script>
  <title>Watch2Gether</title>
      
  <script>
    let pref = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; // true if the user prefers dark mode
    let ls = window.localStorage.getItem('dark-theme');
    let darkThemeEnabled = ls !== null ? ls === "true" : pref;
    
    function initTheme() {
        if (darkThemeEnabled) {
            document.styleSheets[0].disabled = true;
            document.styleSheets[1].disabled = false;
        } else {
            document.styleSheets[0].disabled = false;
            document.styleSheets[1].disabled = true;
        }
    }

    initTheme();

    function changeTheme() {
        darkThemeEnabled = !darkThemeEnabled;
        window.localStorage.setItem('dark-theme', darkThemeEnabled);
        initTheme();
    }

    let darkSwitch
    window.addEventListener("load", () => {
        darkSwitch = document.getElementById('darkSwitch');
        darkSwitch.checked = darkThemeEnabled;
        darkSwitch.addEventListener('change', changeTheme);
    });
    </script>
    <script src="/assets/external/jquery-3.5.1.slim.min.js"></script>
    <script src="/assets/external/popper.min.js"></script>
    <script src="/assets/external/bootstrap.min.js"></script>
  <script>
    let progList;
    let progDict = new Map();

    function onProgress(e, xhr) {
      if (typeof progDict.get(xhr) === 'undefined') {
        let elm = document.createElement('li');

        let outerDiv = document.createElement('div');
        outerDiv.classList.add('progress')
        let div = document.createElement('div');
        div.classList.add('progress-bar', 'progress-bar-striped', 'progress-bar-animated');
        outerDiv.appendChild(div);
        elm.appendChild(outerDiv);
        progList.appendChild(elm)
        progDict.set(xhr, elm);
      }
      let done = e.position || e.loaded;
      let total = e.totalSize || e.total;
      let prct = Math.floor((done / total) * 100) + "%";
      let progbar = progDict.get(xhr).children[0].children[0];
      progbar.innerText = prct;
      progbar.style.width = prct;

    }

    function onLoad(e, xhr) {
      let prog = progDict.get(xhr).children[0].children[0];
      prog.classList.add('bg-success');
      let id = (JSON.parse(xhr.responseText)).id;
      prog.innerHTML = "<a style=\"color: #FFFFFF\" href=\"watch/" + id + "\">" + id + "</a>"
    }

    window.onload = function() {
      progList = document.getElementById('progressList');
      let dz = createDropzone("upload.php", onProgress, onLoad);
      dz.classList.add('jumbotron');
      let textContainer = document.createElement("div");
      textContainer.classList.add("text-center");
      let title = document.createElement('h1');
      title.innerText = "Upload";
      title.classList.add("display-6")
      let desc = document.createElement('p');
      desc.innerText = "Simply drag a file here to upload it or select a file using the dialog."
      desc.classList.add("lead")
      let hr = document.createElement('hr');
      hr.classList.add('my-3');
      textContainer.append(title, desc)
      dz.prepend(textContainer, hr);
      document.getElementById('upload').appendChild(dz);

      $(".custom-file-input").on("change", function() {
        let fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").text(fileName);
      });
    }

  </script>
</head>

<body>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 mb-2">
        <span id="name"></span>
        <div class="float-right">
          <div class="custom-control custom-switch d-flex align-items-center justify-content-center">
            <input class="custom-control-input me-1" type="checkbox" id="darkSwitch">
            <label class="custom-control-label darkSwitchLabel" for="darkSwitch">
              <span><i class="bi bi-sun" title="Switch to light mode"></i></span>
              <span><i class="bi bi-moon-fill" title="Switch to dark mode"></i></span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 d-flex align-content-center justify-content-center">
        <div class="container-small">
          <div class="row">
            <div class="col-12">
              <div class="jumbotron py-4 text-center">
                <h1 class="display-5 mb-3">Watch a video together</h1>
                <form method="post" action="watch/" onsubmit="event.preventDefault(); window.location = this.action + encodeURIComponent(this.x.value);">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Video Url" aria-label="Video Url" name="x">
                    <div class="input-group-append">
                      <button class="btn btn-primary" type="submit">GO</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div id="upload" class="col-12">
            </div>
            <div class="col-12">
              <ul id="progressList">
              </ul>
            </div>
          </div>
        </div>
    </div>
    </div>
  </div>
</body>

</html>