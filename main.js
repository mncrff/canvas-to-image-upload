window.onload = function() {
  
  var memeSize = 300;

  var canvas = document.getElementById('memecanvas');
  ctx = canvas.getContext('2d');


  // Set the text style to that to which we are accustomed
  canvas.width = memeSize;
  canvas.height = memeSize;

  //  Grab the nodes
  var img = document.getElementById('start-image');
  var topText = document.getElementById('top-text');
  var bottomText = document.getElementById('bottom-text');
  var submitButton = document.getElementById('submit-button');

  // When the image has loaded...
  img.onload = function() {
    drawMeme();
  }  

  topText.addEventListener('keydown', drawMeme)
  topText.addEventListener('keyup', drawMeme)
  topText.addEventListener('change', drawMeme)

  bottomText.addEventListener('keydown', drawMeme)
  bottomText.addEventListener('keyup', drawMeme)
  bottomText.addEventListener('change', drawMeme)

  //when the user hits the submit button...
  submitButton.addEventListener('click', canvasToImage);

  function drawMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0, memeSize, memeSize);

    ctx.lineWidth  = 4;
    ctx.font = '20pt sans-serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    var text1 = document.getElementById('top-text').value;
    text1 = text1.toUpperCase();
    x = memeSize / 2;
    y = 0;

    wrapText(ctx, text1, x, y, 300, 28, false);

    ctx.textBaseline = 'bottom';
    var text2 = document.getElementById('bottom-text').value;
    text2 = text2.toUpperCase();
    y = memeSize;

    wrapText(ctx, text2, x, y, 300, 28, true);
  }

  function wrapText(context, text, x, y, maxWidth, lineHeight, fromBottom) {

    var pushMethod = (fromBottom)?'unshift':'push';
    
    lineHeight = (fromBottom)?-lineHeight:lineHeight;

    var lines = [];
    var y = y;
    var line = '';
    var words = text.split(' ');

    for (var n = 0; n < words.length; n++) {
      var testLine = line + ' ' + words[n];
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > maxWidth) {
        lines[pushMethod](line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines[pushMethod](line);

    for (var k in lines) {
      context.strokeText(lines[k], x, y + lineHeight * k);
      context.fillText(lines[k], x, y + lineHeight * k);
    }

  }

  function canvasToImage() {

    var dataURL = canvas.toDataURL('image/png');
    
    var blobBin = window.atob(dataURL.split(',')[1]);
    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], {type: 'image/png'});
    
    $.formData = new FormData();
    $.formData.append('canvasImg', file);
    $.formData.append('testValue', 120);

    $.ajax({
      url: "http://httpbin.org/post",
      type: "POST",
      data: $.formData,
      processData: false,
      contentType: false,
    }).done(function(respond){
      console.log(respond);
    });
  }

  drawMeme();
}

