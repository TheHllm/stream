function createDropzone(uploadUrl, onProgress, onLoad){
    var elm = document.createElement('div');
    var form = document.createElement('form');
    form.action = uploadUrl;
    form.method = "POST";
    form.enctype = "multipart/form-data";

    var finput = document.createElement('input');
    finput.type = "file";
    finput.name= "file";
    
    form.appendChild(finput);

    var sinput = document.createElement('input');
    sinput.type="submit";
    sinput.value="Upload";

    form.appendChild(sinput);
    
    elm.appendChild(form);

    elm.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
        finput.disabled = true;
        e.dataTransfer.dropEffect = 'copy'; 
    }, false); // set drop effect

    elm.addEventListener('dragleave', function (e)
    {
        finput.disabled = false;
    });

    elm.addEventListener('drop', function (e){
        e.stopPropagation();
        e.preventDefault();
        finput.disabled = false;
        var files = e.dataTransfer.files;
        //Upload the files
        var xhrs = [];
        for(let i = 0; i < files.length; i++){
            var formData = new FormData();

            formData.append("xhr", '1');

            formData.append("file", files[i], 'file');
            
            xhrs[i] = new XMLHttpRequest();
            xhrs[i].upload.onprogress = function (e){ onProgress(e, xhrs[i]);};
            xhrs[i].onload = function (e){onLoad(e, xhrs[i]);};
            xhrs[i].open('POST', uploadUrl, true);
            xhrs[i].send(formData);
        }

    }, false);

    return elm;
}