function getFilePathExtension(path) {
	var filename = path.split('\\').pop().split('/').pop();
	var lastIndex = filename.lastIndexOf(".");
	if (lastIndex < 1) return "";
	return filename.substr(lastIndex + 1);
}

function renderThumbs(file) {
	$('.other-thumb').html('');
	if(file.thumbs !== undefined && file.thumbs.length) {
    	file.thumbs.map(function (f) {
    		var thumb = '<img src="'+window.parent.site.storage_url+f.location+'" alt="Thumbnail" style="max-width: 100%"/>';
    		var label = '('+f.image_dimension +')';
    		$('.other-thumb').append('<div class="thumb_container"><div class="thumb_img_container">'+thumb+'</div> <div class="thumb_action">'+label+'</div> </div>');    	})
    	//
    }else {

    	$('.other-thumb').html('<span class="no_thumbnail">No Thumbnail available.</span>');
    }
}

function laravelGallery (inputName){ 
	
	this.inputName = inputName;
	// console.log('window.parent.site.site_url');
	// console.log(window.parent.site.site_url);
	this.storage_url = window.parent.site.storage_url;
	this.site_url = window.parent.site.site_url;
	this.base_url = window.parent.site.base_url;
	this.LaravelMedia = window.parent.$.LaravelMedia;
	//this.maxFiles = LaravelMedia[inputName].maxFiles;
	
	/**
	 * Make the Gallery List Html 
	 */
	this.listHtml = function (file, page, index) {
		
		var h  = '';
		var inputName = this.inputName;
		h += '<div class="card gallery-item col-md-3 col-sm-4 col-xs-4" data-id="'+file.id+'" data-inputName="'+inputName+'" data-page="'+page+'" data-index="'+index+'" >';		
			h += '<div class="gallery-body">';
		    h += this.fileIcon(file);
		    h += '<div class="card-body">';
		      h += '<h5 class="card-title">'+file.title+'</h5>';
		      // h += '<p class="card-text">This is a longer card It\'s a broader card with text below as a natural lead-in to extra content. This content is a little longer. This content is a little bit longer.</p>';
		      // h += '<p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>';
		      h += this.fileAction(file, page, index);
		    h += '</div>';
		    h += '</div>';
		  h += '</div>';

        return h;
	}

	this.fileAction = function (file, page, index) {
		
		// var t = '';
		// t += '<div class="dropdown">';
		// t += '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"> Tools</button>';		  
		// t +=  '<div class="dropdown-menu">';
		// t +=  '<a class="dropdown-item crop-action" data-page="'+page+'" data-index="'+index+'" href="javascript:;">Crop</a>';
		// t +=  '</div></div>';
		// return t;

		var t = '';
		t += '<div class="card-action">';
			if(this.isImage(file.location)) {
				t += '<a class="dropdown-item crop-action" data-page="'+page+'" data-index="'+index+'" href="javascript:;"><span class="fa fa-crop"></span></a>';
			}
		t += '</div>';

		return t;
	}

	/**
	 * HTMl to Display the File Icon
	 **/
	this.fileIcon = function(file) {

		if(this.isImage(file.location)) {

			return '<div class="gallery-img-wrap"><div class="gallery-img-sp"><img class="card-img-top" src="'+this.storage_url+file.location+'" alt=""></div></div>';	
		} else {

			return '<div class="gallery-img-wrap"><div class="gallery-img-sp"><img class="card-img-top" src="'+this.base_url+'images/file-icon.png" alt=""> </div></div>';	
		}
	}

	this.getSelected = function () {
		
		var files = [];
		var gallery = this.LaravelMedia.gallery;

		//var replace_on_change = this.LaravelMedia[this.inputName].replace_on_change === undefined ? false : this.LaravelMedia[this.inputName].replace_on_change;

		$('#gallery-container .gallery-item.selected').each(function (index) {
			var page = $( this ).attr('data-page');
			var index = $( this ).attr('data-index');
			files.push(gallery[page].data[index]);	
		});
		window.parent.$.LaravelMedia.closedModal(files, {name: this.inputName});
	}

	this.onlclick = function (_elm) {

		_elm = $(_elm);

		if(_elm.hasClass('selected')) {
			_elm.removeClass('selected');
			return;
		}

		var maxFiles = LaravelMedia[this.inputName].maxFiles;
		var no_of_selected = LaravelMedia[this.inputName].no_of_selected ? LaravelMedia[this.inputName].no_of_selected : 0;
		var can_select_file = maxFiles ? (maxFiles - no_of_selected) :  undefined;

		// Has selected files
		var has_selected = $('#gallery-container .gallery-item.selected').length;

		if(can_select_file  === undefined || (has_selected < can_select_file ) ) {

			// Now You can seleted the file.
			_elm.addClass('selected');
		}
		else {

			window.parent.$.LaravelMedia.alert('You can not select more file.');
		}
	}

	/**
	 * Render the Gallery Items
	 */
	this.render =  function (files, page) {
		var _this  = this;
		files.map(function (file, index) { 
			$('#gallery-container').append(_this.listHtml(file, page, index));
		})

		if(typeof window.parent.$.LaravelMedia != "undefined"){
	        window.parent.$.LaravelMedia.resizeIframe();
	    }
	}

	this.isImage = function (fileName) {

		var file_arr = fileName.split('.');
		var img_ext = ['png','jpg','jpeg','gif','wembp','svg'];
		var file_ext = file_arr[file_arr.length-1].toLowerCase();
		return ($.inArray(file_ext , img_ext) !== -1 );
	}
	/**
	 * Render the Gallery Which are already loaded.
	 */
	this.loadOfflineData = function() {
		var _this  = this;
		var data = _this.LaravelMedia.gallery.length ? _this.LaravelMedia.gallery : [];
		$('#gallery-container').html('');
		data.map(function (files, page) {

			files.data !== undefined && files.data.length ? files.data.map(function (file, index) {
				$('#gallery-container').append(_this.listHtml(file, page, index));
			}) : null;
		})
	}

	/**
	 * Load the Gallery Data from Server
	 */

	this.loadData = function () {		

		var _this = this;
		return new Promise(function(resolve, reject) {
			var next_page_url = _this.LaravelMedia.gallery.length ? _this.LaravelMedia.gallery[_this.LaravelMedia.gallery.length -1].next_page_url :  undefined;

			if(next_page_url !== null) {
				
				$('#galery-load-more-action').prop('disabled', true);

				$.ajax({
					url: next_page_url === undefined ? _this.site_url+'/files-list' : next_page_url,
					method: "GET",
					data: {s: $('#gallery_search').val()},
					dataType: "JSON",
					success: function (res) {

						$('#galery-load-more-action').prop('disabled', false);
						var page = res.current_page-1;

						_this.render(res.data, page);
						
						if(res.data.length) {
							_this.LaravelMedia.pushGalleryData(res);
						}

						if(!res.next_page_url)  {

							$('#galery-load-more-action').hide();
						}	

						resolve(res);
					},
					error: function (err) {

						$('#galery-load-more-action').prop('disabled', false);
						resolve([]);
					}
				});

			} else {
				$('#galery-load-more-action').hide();
				resolve([]);
			}
		});
	}
}

$('body').on('click','.gallery-item', function (e){

    e.preventDefault();
    e.stopPropagation();

    var _elm = $(this);
    var inputName = _elm.attr('data-inputName');

		if(_elm.hasClass('selected')) {
			_elm.removeClass('selected');
			return;
		}
		var LaravelMedia = window.parent.$.LaravelMedia;

		var maxFiles = LaravelMedia.elms[inputName].maxFiles;
		var only_unique = LaravelMedia.elms[inputName].only_unique;
		
		var acceptedFiles = LaravelMedia.elms[inputName].acceptedFiles;
		acceptedFiles =  acceptedFiles ? acceptedFiles.split(',') : [];
		var is_valid = false;
		
		var thumb = LaravelMedia.elms[inputName].thumb && LaravelMedia.elms[inputName].thumb.length ? LaravelMedia.elms[inputName].thumb.slice(0) : [];
		

		var page = _elm.attr('data-page');
		var index = _elm.attr('data-index');

		var file = LaravelMedia.gallery[page].data[index];

		var replace_on_change = LaravelMedia.elms[inputName].replace_on_change === undefined ? false : LaravelMedia.elms[inputName].replace_on_change;

		console.log('acceptedFiles');
		console.log(replace_on_change);

		if(acceptedFiles && acceptedFiles.length > 0) {
			acceptedFiles.map(function (file_type) {
				
				if(file_type.startsWith('.')) {

					var ext = getFilePathExtension(file.location);
					var patt = new RegExp(file_type.replace('.',''),'gmi');
					
					if ( patt.test(ext) === true) {

						is_valid = true;
					}
				} 
				else  {

					var match_with = file_type;
					var patt = '';

					if(file_type.endsWith('*')) {
						
						match_with.slice(0, -1);
						patt = new RegExp('^'+match_with, 'gmi');

					} 
					else {

						patt = new RegExp(match_with, 'gmi');
					}


					if ( patt.test(file.file_type) === true) {

						is_valid = true;
					}
					
				}
			})
		}
		else {

			is_valid = true;
		}		

		if(!is_valid) {
			window.parent.$.LaravelMedia.alert('Please Select a valid file.');
			return false;
		}

		// When Need to select only unique files

		if(only_unique){

			var selected_files = LaravelMedia.files[inputName];

			var is_unique = true;

			selected_files ? selected_files.map(function (f) {

				if(f.location == file.location){
					is_unique = false;
				}
			}):null;

			if(!is_unique) {

				window.parent.$.LaravelMedia.alert('You have already selected the file.');
				return false;
			}
		}


		// verify the Selected image does have the require Thumbnails

		file.thumbs.map(function (th) {

			var has_thumb = false;

			thumb.map(function (req_thumb, index) { 

				if(th.image_dimension == req_thumb.w+'x'+req_thumb.h) {
					has_thumb = index;
				}
			});

			if(has_thumb !== false) {

				thumb.splice(has_thumb, 1 )
			}
		})


		if(thumb.length > 0 ) {

			var msg = 'Image does not have the thumbnail(s) of size' + thumb.map(function( t ) { return t.w+'x'+t.h  }).join(', ');
			window.parent.$.LaravelMedia.alert(msg);
			return false;
		}
		

		var no_of_selected = LaravelMedia.elms[inputName].no_of_selected ? LaravelMedia.elms[inputName].no_of_selected : 0;
		var can_select_file = maxFiles ? (maxFiles - no_of_selected) :  undefined;

		// Has selected files
		var has_selected = $('#gallery-container .gallery-item.selected').length;

		if(!maxFiles) {

			_elm.addClass('selected');
		}
		else if(maxFiles && replace_on_change === true && has_selected < maxFiles ) {

			_elm.addClass('selected');
		}
		else if(maxFiles && replace_on_change === false && has_selected < can_select_file ){

			_elm.addClass('selected');
		}
		else {

			window.parent.$.LaravelMedia.alert('You can not select more file.');
		}
});
$('body').on('click', '.crop-action', function(e){
    // stop the event from bubbling.
    e.preventDefault();
    e.stopPropagation();
    
    var page =  parseInt($(this).attr('data-page'));
	var index = parseInt($(this).attr('data-index'));

    var LaravelMedia = window.parent.$.LaravelMedia;
	var gallery = LaravelMedia.gallery;
	var file = gallery[page].data[index];


	$('.gallery-row').waitMe({
		effect : 'pulse'
	});

	if($('.gallery-tool').hasClass('hide')) {
		
		var img = document.getElementById('gallery-image');
		img.src = window.parent.site.storage_url+file.location;

		img.onload = function () {
			console.log('Loaded.')
			$('.gallery-row').waitMe('hide');
			$('.gallery-tool').removeClass('hide');
			$('.gallery-preview').addClass('hide');
			initializeCropImage();
			$('.gallery-preview').attr('data-page', page);
			$('.gallery-preview').attr('data-index', index);
			renderThumbs(file);

			if(typeof window.parent.$.LaravelMedia != "undefined"){
		        window.parent.$.LaravelMedia.resizeIframe();
		    }
		    
		}
	} 
	else {
		//console.log('321');
		// Gallery Preview Panel
		$('.gallery-preview').removeClass('hide');
		$('.gallery-tool').addClass('hide');
		$('.gallery-row').waitMe('hide');
	}
});