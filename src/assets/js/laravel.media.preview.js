function listPreview (hiddenFields, file, index, inputName) {

  var p = '<li>'+hiddenFields+'<div class=\"browse-img-box\"><div class=\"input-group\"><div class=\"upload-img\">';
    p +='<img  width=\"50px\" src=\"'+window.site.storage_url+file.location+'\" alt=\"image\" />';
    p += '</div></div><a class=\"red-close\" id=\"remove-file_'+inputName+'_'+index+'\" data-index=\"'+index+'\"><img src=\"'+window.site.base_url+'front/images/red-cross-icon.png\"></<a></div></li>';
  return p;
}

function listPreview1 (hiddenFields, file, index, inputName) {

 var desc = deepFind(file,'extra_fields.desc', '');

  var p = '<div>'+hiddenFields+'<div class=\"browse-img-box\"><div class=\"input-group\"><div class=\"upload-img\">';
    p +='<img  width=\"50px\" src=\"'+window.site.storage_url+file.location+'\" alt=\"image\" />';
    p +='<input name="'+inputName+'['+index+'][extra_fields][desc]" value="'+desc+'" class="extra_fields" />';
    p += '</div></div><a class=\"red-close\" id=\"remove-file_'+inputName+'_'+index+'\" data-index=\"'+index+'\"><img src=\"'+window.site.base_url+'front/images/red-cross-icon.png\"></<a></div></div>';
  return p;
}

function renderList1(html, inputName, element) {
	
	if(element.next('.media-data-preview').length ==0){

		element.after('<div class="media-data-preview"></div>');
	}
	element.next('.media-data-preview').html(html);
}

function renderList(html, inputName, element) {

	element.closest('.media-data').find('li:not(.image-selector)').remove();
	element.closest('li').before(html);
	//
	element.closest('.media-data').find('[data-error_holder]').empty();
}

function MorelistPreview (hiddenFields, file, index, inputName) {
	
	var desc = deepFind(file,'meta_data', '');
	var car_image_gallery_id = file.car_image_gallery_id ? file.car_image_gallery_id : '';
	
	var p='<tr id=\"remove_'+file.id+'\"><td><span>'+hiddenFields+'<img src=\"'+window.site.storage_url+file.location+'\" alt=\"image\" /></span></td>';
	p +='<td><p>'+file.title+'</p></td>';
	p+='<td id=\"'+file.id+'\" class=\"metaID\"><p class=\"hidden\" id=\"metaText'+file.id+'\"></p>';
	p += '<input type="hidden" value="'+car_image_gallery_id+'" name="'+inputName+'['+index+'][car_image_gallery_id]" />';
	p+='<textarea id=\"textfield'+file.id+'\" class=\"form-control dynamicClass extra_fields\" name="'+inputName+'['+index+'][meta_data]" placeholder=\"Enter the Meta Data\">'+desc+'</textarea></td>';
	p+='<td class=\"text-center\" id=\"remove-file_'+inputName+'_'+index+'\" data-index=\"'+index+'\"><img src=\"'+window.site.base_url+'front/images/blue-cross-icon.png\" /></td></tr>';
	return p;
}

function MorerenderList(html, inputName, element) {
	//console.log(element);
	//element.parent().remove();
	$('#addMorOption').html(html);
}

function galleryPreview (hiddenFields, file, index, inputName) {
	
	var car_image_gallery_id = file.car_image_gallery_id ? file.car_image_gallery_id : '';

	var p = '<li>'+hiddenFields+'<div class=\"browse-img-box\"><div class=\"input-group\"><div class=\"upload-img\">';
	 p +='<img  width=\"50px\" src=\"'+window.site.storage_url+file.location+'\" alt=\"image\" />';
	 p += '<input type="hidden" value="'+car_image_gallery_id+'" name="'+inputName+'['+index+'][car_image_gallery_id]" />';
	 p += '</div></div><a class=\"red-close\" id=\"remove-file_'+inputName+'_'+index+'\" data-index=\"'+index+'\"><img src=\"'+window.site.base_url+'front/images/red-cross-icon.png\"></a></div></li>';
	return p;
  
}


function singleFileSelectionHtml(hiddenFields, file, index, inputName) {

	return hiddenFields+ '<input type="text" class="form-control input-lg" disabled value="'+file.title+'" />';
}

function singleFileSelectionHtmlRender(html, inputName, element) {
	element.closest('.input-group').find('.single-file-wrapper').html(html);
}

function createDynamicFields(name, selectedValues, wrapper_id, placeholder, action_class) {

    selectedValues = selectedValues ? selectedValues : [];
    var h = '';

    if(selectedValues.length) {

        h = selectedValues.map(function (data, index) {

           return  '<div class="dynamic-elm-row form-group"><input class="form-control" name="'+name+'[]" value="'+data+'" placeholder="Add detail"><a href="javascript:void(0);" data-name="'+name+'" data-wrapper_id="'+wrapper_id+'" data-placeholder="'+placeholder+'"  class="'+ (index ? 'form-remove-icon form-remove-elm' : 'form-add-icon form-add-elm') +'"><img src="'+window.site.base_url+'front/images/'+ (index ? 'blue-cross-icon.png' : 'blue-plus-icon.png') +'" /></a><div>';
        })
    }
    else {

         h =  '<div class="dynamic-elm-row form-group"><input class="form-control" name="'+name+'[]" placeholder="Add detail"><a href="javascript:void(0);" data-name="'+name+'" data-wrapper_id="'+wrapper_id+'" data-placeholder="'+placeholder+'" class="form-add-icon '+action_class+'"><img src="'+window.site.base_url+'front/images/'+(action_class == 'form-remove-elm' ? 'blue-cross-icon.png' : 'blue-plus-icon.png')+'" /></a></div>';
    }

    $(wrapper_id).append(h);
}

$('body').on('click','.form-add-elm', function () {

    var name = $(this).attr('data-name');
    var wrapper_id = $(this).attr('data-wrapper_id');
    var placeholder = $(this).attr('data-placeholder');
    createDynamicFields(name, undefined, wrapper_id, placeholder, 'form-remove-elm');
})

$('body').on('click','.form-remove-elm', function () {

    var name = $(this).attr('data-name');
    var wrapper_id = $(this).attr('data-wrapper_id');
    var placeholder = $(this).attr('data-placeholder');
    $(this).closest('.dynamic-elm-row').remove();
})