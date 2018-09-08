
function fileManager(inputName){

	this.inputName = inputName;
	this.LaravelMedia = window.parent.$.LaravelMedia;
	var requestData =  window.parent.$.LaravelMedia.elms[inputName] ? window.parent.$.LaravelMedia.elms[inputName] : {};

	this.thumb = (typeof requestData.thumb != "undefined" && requestData.thumb.length)?requestData.thumb:[];
	this.noOfSelected = requestData.no_of_selected ? requestData.no_of_selected  : 0;
	this.maxFiles = (this.thumb.length >=1 )? 1 : (requestData.maxFiles ? (requestData.maxFiles - this.noOfSelected) : null);
	this.maxFilesize = typeof requestData.maxFilesize != "undefined"?requestData.maxFilesize:null;
	this.requestData = requestData;
	this.acceptedFiles = this.thumb.length >=1 ?'image/*':(requestData.acceptedFiles != "undefined"?requestData.acceptedFiles:null);
	this.dropzone = null;

	// store the crop data like x,y,with and height
	this.cropData = [];

	//store the date, which has been uploaded
	this.uploadedData = [];

	/**
	 * identify , if selected file is Image.
	 * @param {} e Instance of FileReader
	 * @return { } boolean
	 */
	
	this.isImageType = function(e){

		var dataURL = e.target.result;
		var mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0];
		return mimeType.match('image.*');
	}
	/**
	 * Initialize Cropper, if the select file if image
	 * @param  {object} e Instance of FileReader
	 * @return {void}   NA
	 */
	this.initializeCropper= function(e){

		var no_of_file = this.dropzone.files.length;
		var thumb = this.thumb;
		var _this = this;

		console.log("no_of_file");
		//console.log(e);
		console.log(no_of_file);
		console.log(thumb);
		var running_index = 0;
	  	if(thumb.length >=1 && no_of_file ==1){

	      $('.cropper-panel').html('');
	      $('.cropper-panel img').cropper('destroy'); 

	      if(this.isImageType(e)){
	        
	        //Display the cropper Panel
	        $('#cropperDiv').removeClass('hide');
	        // Hide the Dropzone Panel
	        $('#dropzoneDiv').addClass('hide');
	        // Display the Toggle Button
	        $('.toggle-button').removeClass('hide');     

	        $.each(thumb,function(index,_thumb){

	             var img = new Image();
	             img.id ='cropImage'+index;             

	              img.onload = function(e) { 

	                $('.cropper-panel').append(img);
	                $(this).wrap('<div class="imageBox">').wrap('<div class="inner"/>');            
	                $(this).closest('.imageBox').prepend('<p class="thumb_title">'+_thumb.title+'</p>');
	                

	                if(thumb.length >= 2)
	                  $(this).closest('.imageBox').addClass('width_50_50');
	                
	               //  console.log("TEST....");
	              	// console.log(running_index);
	              	// console.log(thumb.length);
	                if(thumb.length == running_index+1){                 
	                  _this.resizeIframe();

	                  //console.log("@@####");
	              	}

	                var wh = String(_thumb.w)+'x'+String(_thumb.h);

	                // initialize cropper after image load
	                $(e.target).cropper({
	                  movable: true,
	                  zoomable: true,
	                  rotatable: false,
	                  scalable: true,
	                  responsive:true,
	                  aspectRatio: _thumb.w/_thumb.h,
	                  viewMode:3,
	                  ready: function(){

	                    //$(this).cropper('setData',{"width":20, "height":20}); 

	                  },
	                  crop: function (cropData) {
	                  	console.log('cropImgData');
	                  	//console.log(cropImgData);
	                  		var cropImgData = cropData.detail;
	                      _this.addCropData(wh,{x:cropImgData.x,y:cropImgData.y,width:cropImgData.width,height:cropImgData.height,rotate:0,thumb_width:_thumb.w,thumb_height:_thumb.h});
	                  }

	                });

	                running_index++;
	              };
	              img.src = e.target.result;
	          });
	          
	      }   
	  }else{

	    $('.toggle-button').addClass('hide');
	  }

	}

	/**
	 * Resize the Media Iframe for adjusting the height according to content.
	 * @return {void} None
	 */
	this.resizeIframe = function(){

		if(typeof window.parent.$.LaravelMedia != "undefined"){
	        window.parent.$.LaravelMedia.resizeIframe();
	    }
	}

	/**
	 * Start the file Uploading..
	 * @return {boolean} 
	 */
	this.doUpload = function (){

		console.log('this.dropzone.getAcceptedFiles()');
		console.log();
		var af = this.dropzone.getAcceptedFiles();
		
		if(af.length) {
			this.loader();
			this.dropzone.processQueue();
		}

		return false;
	}
	/**
	 * add and update the cropData after the cropper changes
	 * @param {string} uniqueId combination of width and height like wxh
	 * @param {object} data     crop data like: x,y, width, height and more
	 */
	this.addCropData = function(uniqueId,data){

		var is = false;
		var _this = this;
		$.each(_this.cropData, function(index,value){

			if(value.id ==uniqueId){
				is = true;
				_this.cropData[index]['data'] = data;
			}
		});

		if(is===false){

			_this.cropData.push({id:uniqueId,data:data});
		}
	}

	/**
	 * Display the loader
	 * @return {void} 
	 */
	this.loader = function(){

		$('body').waitMe({
		      effect : 'pulse'
		});
	}


	/**
	 * call this method after the page load for initializing the dropzone.
	 */
	this.load = function(){
		
		Dropzone.autoDiscover = false;
		var previewNode = document.querySelector("#template");
		previewNode.id = "";
		var previewTemplate = previewNode.parentNode.innerHTML;
		previewNode.parentNode.removeChild(previewNode);
		var _this = this;
		console.log('GGGGGGGGGGGGGGGGGGG');
		console.log(_this.acceptedFiles);
		this.dropzone = new Dropzone('#dropzone', {

		  url: window.site.site_url+'/files-uploader',
		  autoProcessQueue: false,
		  previewTemplate: previewTemplate,
		  previewsContainer: "#previews",
		  acceptedFiles: _this.acceptedFiles,
		  humbnailWidth: 40,
		  thumbnailHeight: 40,
		  maxFilesize: _this.maxFilesize ? _this.maxFilesize : undefined,
		  maxFiles:_this.maxFiles,
		  dictDefaultMessage:  _this.requestData.dropzone_message ? _this.requestData.dropzone_message : 'Drop files here to upload',
		  init: function() {

		    this.on('success',function(file,data){     
		      
				_this.dropzone.options.autoProcessQueue = true;		      
				data.fileOrignalName = file.name;
				_this.uploadedData.push(data);

		    }),

		    this.on('queuecomplete',function(){
		        console.log('sdsdsdsdsd');
		        console.log(_this.uploadedData);
		        //$('body').waitMe('hide');

		        if(_this.uploadedData.length ) {
			        $('#cropperDiv').addClass('hide');
			        $('#dropzoneDiv').removeClass('hide');
			        $('#filter_action').trigger('click');
			        window.parent.$.LaravelMedia.closedModal(_this.uploadedData,_this.requestData);
			    }
		    }),

		    this.on('sending', function(file, xhr, formData){
		           
		        file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");

		        for (i = 0; i < _this.cropData.length; i++) {

		          formData.append("cropData["+i+"][id]",_this.cropData[i]['id']);
		          formData.append("cropData["+i+"][x]",_this.cropData[i]['data']['x']);
		          formData.append("cropData["+i+"][y]",_this.cropData[i]['data']['y']);
		          formData.append("cropData["+i+"][width]",_this.cropData[i]['data']['width']);
		          formData.append("cropData["+i+"][height]",_this.cropData[i]['data']['height']);
		          formData.append("cropData["+i+"][rotate]",_this.cropData[i]['data']['rotate']);
		          formData.append("cropData["+i+"][thumb_height]",_this.cropData[i]['data']['thumb_height']);
		          formData.append("cropData["+i+"][thumb_width]",_this.cropData[i]['data']['thumb_width']);
		        }
		    }),

		    this.on("addedfile", function(file) { 

		      $('#cropperDiv').addClass('hide');
		      $('#dropzoneDiv').removeClass('hide');
		      $('.cropper-panel').html('');
		      $('.cropper-panel img').cropper('destroy');
		      
		      var a = new FileReader();
		      a.onload = function(e) {          
		          
		          console.log("QWWew");
		        _this.initializeCropper(e);
		      };

		      a.readAsDataURL(file);

		    });

		  }

		});
	}
}