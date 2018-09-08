
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title>@yield('meta-title','Laravel Media Manager')</title>
    <!-- Favicon-->
    <link rel="icon" href="{!! asset('favicon.ico') !!}" type="image/x-icon">
    <link href="{!! asset('assets/css/laravel.popup.media.min.css') !!}" rel="stylesheet">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script type="text/javascript">
          window.site = {
            'site_url':'{!!url('/')!!}',
            'base_url':'{!!asset('/')!!}',
            'admin_url':'{!!url('/admin')!!}',
          };
    </script>
      
</head>
<body>
<div class="container">
  <ul class="nav nav-tabs">
    <li class="active"><a data-toggle="tab" href="#uploader">Uploader</a></li>
    <li><a data-toggle="tab" href="#gallery">Gallery</a></li>
  </ul>

  <div class="tab-content">
    <div id="uploader" class="tab-pane fade in active">
        @include('vendor.LaravelMedia.drag-drop-panel')
    </div>
    <div id="gallery" class="tab-pane fade">
        @include('vendor.LaravelMedia.gallery')
    </div>
  </div>
</div>

<script type="text/javascript" src="{!!asset('assets/js/laravel.popup.media.min.js') !!}"></script>

<script type="text/javascript">

var inputName = '{!!Request::get('inputName')!!}';
var fm = new fileManager(inputName);
var lGallery = new laravelGallery(inputName);
lGallery.loadOfflineData();
lGallery.loadData();
fm.load();

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    
    $('body .go-back').trigger('click');

    if(typeof window.parent.$.LaravelMedia !== "undefined"){
      window.parent.$.LaravelMedia.resizeIframe();
    }
});

function finish() {

  var section = $('.nav.nav-tabs a[aria-expanded="true"]').attr('href');
  if(section === '#gallery') {
      lGallery.getSelected();
  }else {
      fm.doUpload();
  }

}

$(function () {

  $('#galery-load-more-action').click(function () {
      lGallery.loadData();
  });

  $('.go-back').click(function () { 
      $('.gallery-tool').addClass('hide');
      $('.gallery-preview').removeClass('hide');
      lGallery.loadOfflineData();

      if(typeof window.parent.$.LaravelMedia != "undefined"){
          window.parent.$.LaravelMedia.resizeIframe();
      }
  })

  $('#filter_action').click(function () {
      $('#gallery-container').empty();
      $('body').waitMe({
        effect : 'pulse'
      });

      window.parent.$.LaravelMedia.gallery = [];

      lGallery.loadData().then(function () {
        $('body').waitMe('hide');
      });
  })

  $('.toggle-button').click(function(){

      if($('#cropperDiv').is(':visible')){

        $('#cropperDiv').addClass('hide');
        $('#dropzoneDiv').removeClass('hide'); 

        $(this).html('Back to Crop Image');
      }
      else{

        var no_of_file = fm.dropzone.files.length;       
        if(!no_of_file){
          $('.cropper-panel').html('');
          $('.cropper-panel img').cropper('destroy'); 
          $('#cropperDiv').addClass('hide');
          $('#dropzoneDiv').removeClass('hide'); 
          $(this).addClass('hide');
        }else{
          
          $('#cropperDiv').removeClass('hide');
          $('#dropzoneDiv').addClass('hide');
          $(this).html('Back to Upload');
        }
      }   
  });

});
  
</script>
</body>
</html>