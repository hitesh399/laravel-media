$.LaravelMedia = {};
//window.LaravelAfterLoad = {};

function filePreview(elm, inputName, _list_callback, _render_callback) {

	this.inputName = inputName,
	this._callback = _list_callback;
	this._render_callback = _render_callback;
	this.elm = elm;


	this.makeHiddenField = function (file, inputName, index) {
		
		var fileKeys = $.LaravelMedia.hiddenKeys;
		var thumb_hidden_should_render = $.LaravelMedia.elms[inputName] !== undefined && $.LaravelMedia.elms[inputName].thumb_hidden_should_render !== undefined ? $.LaravelMedia.elms[inputName].thumb_hidden_should_render : false;

		var t  = '<div class="media-hidden-fields">';
			t += fileKeys.map(function (key_name) {
				var f = file;
				var key_val = f[key_name] !== undefined ? f[key_name] : '';
				return (typeof key_val !== "object" && key_val) ? '<input type="hidden" name="'+inputName+'['+index+']['+key_name+']" value="'+key_val+'" />' : '';

			}).join('');

			t += thumb_hidden_should_render && file.thumbs && file.thumbs.length ? file.thumbs.map(function (thumb, thumb_index) {
						
					return fileKeys.map(function (key_name) {
						var f = thumb;
						var key_val = f[key_name] !== undefined ? f[key_name] : '';
						return (typeof key_val !== "object" && key_val) ? '<input type="hidden" name="'+inputName+'['+index+'][thumbs]['+thumb_index+']['+key_name+']" value="'+key_val+'" />' : '';

					}).join('');

			}).join('') : '';

		t += '</div>';

		return t;
	}

	this.makePreview = function () {

		var inputName = this.inputName ? this.inputName : 'unknown';
		var _callBack = typeof this._callback === "function" ? this._callback : false;
		var _this = this;
		var data = $.LaravelMedia.files[inputName] !== undefined ? $.LaravelMedia.files[inputName] : [];

		return data.map( function (file, index) {
				
				var hiddenFields = _this.makeHiddenField(file,inputName,index);
				var t = '';
				if(_callBack){
					t = _callBack(hiddenFields, file, index,inputName);
				} else {

					t = _this.filePreview(hiddenFields, file, index, inputName);
				}	

			   return t;

		}).join('');
	}

	this.filePreview = function (hiddenFields, file, index, inputName) {

		var t =  '<div class="file_preview">';
			t += '<a class="media-left waves-light">';
				t += '<img class="rounded-circle" width="50px" src="'+window.site.storage_url+file.location+'" alt="Generic placeholder image">';
			t += '</a>';
			t += '<div class="media-body">';
			t += '<button id="remove-file_'+inputName+'_'+index+'" data-index="'+index+'">Remove</button>';
			t += '</div>';
			t += '</div>';	

		return hiddenFields+t;
	}

	this.render = function () {
		
		var _this = this;
		var _call_back = typeof this._render_callback === 'function' ? this._render_callback : false;

		if(!_call_back) {

			if(this.elm.next('.media-data-preview').length ==0){
				this.elm.after('<div class="media-data-preview"></div>');
			}
			this.elm.next('.media-data-preview').html(this.makePreview());

		} else {
			
			var html = this.makePreview();
			_call_back(html, this.inputName, this.elm);
		}
		
		/**
		 * Delete the Element
		 **/
		var inputName = this.inputName ? this.inputName : 'unknown';
		console.log('T1');
		console.log(inputName);
		console.log($.LaravelMedia.files[inputName]);
		var data = $.LaravelMedia.files[inputName] !== undefined ? $.LaravelMedia.files[inputName]: [];
		console.log(data);
		var callback_delete = typeof window.LaravelMedia_delete_callback === "function" ?window.LaravelMedia_delete_callback : null;
		
		data.map(function (f, index) {

			var element = document.getElementById('remove-file_'+inputName+'_'+index);

			if(element) {
				
				element.setAttribute('data-index', index);
				element.setAttribute('class', element.getAttribute('class') + ' laravel_media_remover');
				element.onclick = function(__this) {

					var index = $(__this.toElement).attr('data-index');
					if(index  === undefined) {
						index = $(__this.toElement).closest('.laravel_media_remover').attr('data-index');
					}
					
					if(! callback_delete) {

						if( confirm("Are you sure to delete this selected file?") ) {
							console.log('__this');
							console.log(__this);
							
							console.log(inputName);
							console.log(index);
							$.LaravelMedia.files[inputName].splice(index, 1);
							_this.render();
						}
					}
					else {

						window.LaravelMedia_delete_callbacks !== undefined && typeof window.LaravelMedia_delete_callbacks[inputName] === 'function' ? window.LaravelMedia_delete_callbacks[inputName](_this, inputName,index) :callback_delete(_this, inputName,index);
					}

				}
			}

		})
		
	}
};


$.LaravelMedia = {


	elms:[],
	files: {},
	gallery: [],
	hiddenKeys: ['id','location','title','file_type','size','image_dimension','is_used'],

	// saveinputData: function (inputName, data, index, fieldName) {

	// 	this.files[inputName][index].extra_fields[fieldName] = data;
	// },

	modalHtml: function(data){

		var cloneTxt = data.close_btn_text ? data.close_btn_text : 'Close';
		var selectTxt = data.select_btn_text ? data.select_btn_text : 'Select';

		console.log('GGGGGGGGGGGGGGGGGGGGGGG');
		console.log(data);
		
		var modal = '<div class="modal fade" id="file-manager-modal">'+
		    '<div class="modal-dialog modal-lg">'+
		        '<div class="modal-content">'+
		            '<div class="modal-header">'+
		                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
		                '<h4 class="modal-title">'+data.title+'</h4>'+
		            '</div>'+
		            '<div class="modal-body">'+data.content+
		            '</div>'+
		            '<div class="modal-footer">'+
		                '<button type="button" class="btn btn-white media-popup-close" data-dismiss="modal">'+cloneTxt+'</button>'+
		                '<button type="button" class="btn btn-info media-action">'+selectTxt+'</button>'+
		            '</div>'+
		        '</div>'+
		    '</div>'+
		'</div>';

		return modal;
	},

	/**
	 * Store the Input value in Global veriable.
	 */
	makeInputInstance: function(_this, data, _callback, _render_callback) {
		data = data === undefined ? {} : data;
		_this  = $(_this);
		var element_data = jQuery.extend(true, {}, data);
		element_data._this = _this;
		element_data.filePreview = new filePreview(_this, data['name'], _callback, _render_callback);
		this.elms[data['name']] = element_data;
	},

	/**
	 * This function use to open the File upload media Modal Box.
	 * @param  {object} _this Element jquery instacne
	 * @param  {object} data  file data
	 * {
	 * 	 title: Image title,
	 * 	 name: input name 
	 * 	 thumb: {[w,h,title]} thumbnail details
	 * 	 maxFilesize: no of file which can be select in one action.
	 * 	 acceptedFiles: accepted file extension
	 * }
	 * @return {function|Object}	Callback function , which will be execute when the file has been uploaded.
	 */
	openModal: function(_this, data, _callback, _render_callback){
		
		var popup_data = {};
		data = data === undefined ? {} : data;
		_this  = $(_this);
		popup_data['title'] = data && data.title ? data.title  : '';
		data.element_id = _this.attr('id');
		
		// if(_this.closest('.media-data').length === 0) {
		// 	alert('Media Element Should be wrapped by media-data class. like <div class="media-data">{element}</div>');
		// 	return false;
		// }

		data['no_of_selected']	= this.files[data.name] !== undefined ? this.files[data.name].length : 0;

		// _this.closest('.media-data').find('.media-hidden-fields').length;
		this.makeInputInstance(_this, data, _callback, _render_callback);		
		
		var url = this.getUrl()+'?inputName='+data.name;

		popup_data.content = '<iframe  width="100%" id="media-iframe" height="auto" src="'+url+'" onload="$.LaravelMedia.resizeIframe()"></iframe>';
		if($('body').find('#file-manager-modal').length){

			$('body').find('#file-manager-modal').find('.modal-title').html(popup_data.title);
			$('body').find('#file-manager-modal').find('.modal-body').html(popup_data.content);
			//console.log('sadsad');
			if(popup_data.select_btn_text) {

				$('body').find('#file-manager-modal').find('.media-action').html(popup_data.selected_btn_text);
			}

			if(popup_data.close_btn_text) {

				$('body').find('#file-manager-modal').find('.media-popup-close').html(popup_data.close_btn_text);
			}

		}else{

			var modal_html = this.modalHtml(popup_data);
			$('body').append(modal_html);
		}

		$('body').find('#file-manager-modal').modal('show');

		// document.getElementById('media-iframe').contentWindow.onload = function (__this){
		// 	//console.log('JJJJJJJJJJJJJJJJJ');
		// 	// console.log(__this.currentTarget);
		// 	// console.log(__this.currentTarget.init);
		// 	//document.getElementById('media-iframe').contentWindow.initiate(data.name);
		// }
	},

	getUrl: function()
	{

		return window.site.site_url+'/files-manager';
	},
	/**
	 * This method calls when file has been uploaded.
	 * @param  {object} data        uploaded file details
	 * @param  {object} requestData request file details
	 * @return {void}         none
	 */
	closedModal: function (data,requestData){

		$('body').find('#file-manager-modal').modal('hide');
		this.listWithNameHtml(data,requestData);
	},

	listWithNameHtml: function(data,requestData)
	{
		
		var inputName = requestData.name ? requestData.name : null;
		var _this = this;

		if(inputName) {
			
			var elm = this.elms[inputName]['_this'];
			// console.log('this.elms[inputName].files');
			// console.log($.LaravelMedia.elms[inputName]);

			if(typeof $.LaravelMedia.files[inputName] === 'undefined' ) {
				$.LaravelMedia.files[inputName]  = [];
			}

			var replace_on_change = $.LaravelMedia.elms[inputName].replace_on_change === undefined ? false : $.LaravelMedia.elms[inputName].replace_on_change;

			// Add Uploaded file in List.
			if(!replace_on_change) {
				data.map(function (f) { $.LaravelMedia.files[inputName].push(f); });
			}
			else {

				$.LaravelMedia.files[inputName] = 	data;
			}

			var fp = this.elms[inputName].filePreview;
			fp.render();

		} else {

			alert('Input name is defined');
		}
	},	

	resizeIframe: function(){

		var obj = document.getElementById('media-iframe');
		console.log(obj.contentWindow.document.body.scrollHeight);
		console.log('obj.contentWindow.document.body.scrollHeight');
		var h = obj.contentWindow.document.body.scrollHeight ===0 ? 120 : obj.contentWindow.document.body.scrollHeight+20;
		obj.style.height = (h) + 'px';
	},
	/**
	 * Store the Gallery Data.
	 **/
	pushGalleryData: function (data) {
		
		this.gallery.push(data);
	},

	setValue: function setToValueInObject(value, path) {
		var obj = this;
	    var i;
	    path = path.split('.');
	    for (i = 0; i < path.length - 1; i++){ 
	        //(path.length -1
	        var k = obj[path[i]];

	        if(k === undefined){
	        	// console.log('Undefimned');
	        	// console.log(i);
	        	obj[path[i]] = {};
	        }

	        obj = obj[path[i]];
	    }
	    // console.log('K1');
	    // console.log(obj);
	    // console.log(path);
	    // console.log(i);
	    // console.log('1K1');

	    obj[path[i]] = value;
	},

	alert: function (msg) {

		var _alert = window.LaravelMediaAlert === undefined ? alert : window.LaravelMediaAlert;
		console.log('window.LaravelMediaAlert');
		console.log(window.LaravelMediaAlert);
		_alert(msg);
		return false;
	}
}

$(function () {

	// console.log('window.LaravelMediaAfterLoad');
	// console.log(window.LaravelMediaAfterLoad);

	if(window.LaravelMediaAfterLoad) {

		var fncs = Object.keys(window.LaravelMediaAfterLoad);
		fncs.map(function (fnc) {
			window.LaravelMediaAfterLoad[fnc]();
		})
	}
	$('body').on('click','.media-action',function(){

		document.getElementById('media-iframe').contentWindow.finish();
	});

	$('body').on('change', '.extra_fields', function () {

		console.log('Test hello..........');
		console.log();
		var name = $(this).attr('name');

		var actual_object = null;
		var _this = $(this);

		name = name.replace('[','.');
		name = name.replaceAll('][','.');

		if(name.endsWith(']')){
			name = name.slice(0,-1)			
		}
		console.log('name');
		console.log(name);
		console.log($(this).val());
		$.LaravelMedia.setValue($(this).val(), 'files.'+name);
		// console.log('actual_object');
		// console.log(actual_object);
	})
});


//Object.prototype.

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};



function deepFind(obj, path, defaultValue) {

    var paths = path.split('.')
      , current = obj
      , i;
  
    for (i = 0; i < paths.length; ++i) {

      if (!current || current[paths[i]] === undefined) {
          
        return defaultValue;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
}