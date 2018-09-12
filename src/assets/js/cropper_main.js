var $image = $('#gallery-image');
var console = window.console || { log: function () {} };
var URL = window.URL || window.webkitURL;

//var $download = $('#download');
var $dataX = $('#dataX');
var $dataY = $('#dataY');
var $dataHeight = $('#dataHeight');
var $dataWidth = $('#dataWidth');
var $dataRotate = $('#dataRotate');
var $dataScaleX = $('#dataScaleX');
var $dataScaleY = $('#dataScaleY');
var $thumbWidth = $('#dataThumbWidth');
var $thumbHeight = $('#dataThumbHeight');

var galleryOptios = {
      aspectRatio: parseFloat($thumbWidth.val()) / parseFloat($thumbHeight.val()),
      movable: true,
      zoomable: true,
      //minContainerHeight: 300,
      preview: '.img-preview',
      crop: function (e) {
        $dataX.val(Math.round(e.detail.x));
        $dataY.val(Math.round(e.detail.y));
        $dataHeight.val(Math.round(e.detail.height));
        $dataWidth.val(Math.round(e.detail.width));
        $dataRotate.val(e.detail.rotate);
        $dataScaleX.val(e.detail.scaleX);
        $dataScaleY.val(e.detail.scaleY);
      }
    };

var originalImageURL = $image.attr('src');
var uploadedImageName = 'cropped.jpg';
var uploadedImageType = 'image/jpeg';
var uploadedImageURL;

$(function () {

  'use strict';

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();


  // Cropper
  $image.on({
    ready: function (e) {
      console.log(e.type);
    },
    cropstart: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
      console.log(e.type, e.detail.action);
    },
    crop: function (e) {
      console.log(e.type);
    },
    zoom: function (e) {
      console.log(e.type, e.detail.ratio);
    }
  }).cropper(galleryOptios);


  // Buttons
  // if (!$.isFunction(document.createElement('canvas').getContext)) {
  //   $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  // }

  // if (typeof document.createElement('cropper').style.transition === 'undefined') {
  //   $('button[data-method="rotate"]').prop('disabled', true);
  //   $('button[data-method="scale"]').prop('disabled', true);
  // }


  // Download
  // if (typeof $download[0].download === 'undefined') {
  //   $download.addClass('disabled');
  // }


  // galleryOptios
  $('.docs-toggles').on('change', 'input', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var type = $this.prop('type');
    var cropBoxData;
    var canvasData;

    if (!$image.data('cropper')) {
      return;
    }

    if (type === 'checkbox') {
      galleryOptios[name] = $this.prop('checked');
      cropBoxData = $image.cropper('getCropBoxData');
      canvasData = $image.cropper('getCanvasData');

      galleryOptios.ready = function () {
        $image.cropper('setCropBoxData', cropBoxData);
        $image.cropper('setCanvasData', canvasData);
      };
    } else if (type === 'radio') {
      galleryOptios[name] = $this.val();
    }

    $image.cropper('destroy').cropper(galleryOptios);
  });


  // Methods
  $('.docs-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var cropper = $image.data('cropper');
    var cropped;
    var $target;
    var result;

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if (cropper && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      cropped = cropper.cropped;

      switch (data.method) {
        case 'rotate':
          if (cropped && galleryOptios.viewMode > 0) {
            $image.cropper('clear');
          }

          break;

        case 'send_crop_data':
          // if (cropped && galleryOptios.viewMode > 0) {
          //   $image.cropper('clear');
          // }
        var page =  parseInt($('.gallery-preview').attr('data-page'));
        var index = parseInt($('.gallery-preview').attr('data-index'));

        var LaravelMedia = window.parent.$.LaravelMedia;
        var gallery = LaravelMedia.gallery;
        var file = gallery[page].data[index];

          console.log('cropper');
          console.log(cropper);
          $('.gallery-row').waitMe({
            effect : 'pulse'
          });

          $.ajax({
            headers: {
              'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            url: 'make-thumb',
            method: "PUT",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(Object.assign(cropper.getData(), {file: file, thumb_width: $thumbWidth.val(), thumb_height: $thumbHeight.val() })),
            success: function (res) { 
                $('.gallery-row').waitMe('hide');
                renderThumbs(res);
                window.parent.$.LaravelMedia.gallery[page].data[index] = res;
                $('body .go-back').trigger('click');
            },
            error: function () {

                $('.gallery-row').waitMe('hide');
                alert('Server Error!');
            }
          });

          break;

        case 'getCroppedCanvas':
          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && galleryOptios.viewMode > 0) {
            $image.cropper('crop');
          }

          break;

        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!$download.hasClass('disabled')) {
              download.download = uploadedImageName;
              $download.attr('href', result.toDataURL(uploadedImageType));
            }
          }

          break;

        case 'destroy':
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
          }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          console.log(e.message);
        }
      }

    }
  });


  // Keyboard
  $(document.body).on('keydown', function (e) {

    if (!$image.data('cropper') || this.scrollTop > 300) {
      return;
    }

    switch (e.which) {
      case 37:
        e.preventDefault();
        $image.cropper('move', -1, 0);
        break;

      case 38:
        e.preventDefault();
        $image.cropper('move', 0, -1);
        break;

      case 39:
        e.preventDefault();
        $image.cropper('move', 1, 0);
        break;

      case 40:
        e.preventDefault();
        $image.cropper('move', 0, 1);
        break;
    }

  });



  // Import image
  // var $inputImage = $('#inputImage');

  // if (URL) {
  //   $inputImage.change(function () {
  //     var files = this.files;
  //     var file;

  //     if (!$image.data('cropper')) {
  //       return;
  //     }

  //     if (files && files.length) {
  //       file = files[0];

  //       if (/^image\/\w+$/.test(file.type)) {
  //         uploadedImageName = file.name;
  //         uploadedImageType = file.type;

  //         if (uploadedImageURL) {
  //           URL.revokeObjectURL(uploadedImageURL);
  //         }

  //         uploadedImageURL = URL.createObjectURL(file);
  //         $image.cropper('destroy').attr('src', uploadedImageURL).cropper(galleryOptios);
  //         $inputImage.val('');
  //       } else {
  //         window.alert('Please choose an image file.');
  //       }
  //     }
  //   });
  // } else {
  //   $inputImage.prop('disabled', true).parent().addClass('disabled');
  // }

});


function initializeCropImage() {

   $image.cropper('destroy').cropper(galleryOptios);
}

$('.initialize-cropper').click( function () {
  console.log('ddddddddd');
  console.log(galleryOptios);
  console.log(parseFloat($thumbWidth.val()) / parseFloat($thumbHeight.val()));
  //aspectRatio: parseFloat($thumbWidth.val()) / parseFloat($thumbHeight.val()),
  galleryOptios.aspectRatio = parseFloat($thumbWidth.val()) / parseFloat($thumbHeight.val());
  $image.cropper('destroy').cropper(galleryOptios); 
})