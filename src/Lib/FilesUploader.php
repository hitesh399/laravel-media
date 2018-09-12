<?php

namespace Hitesh399\LaravelMedia\Lib;

use Illuminate\Support\Facades\File;
use Storage;

class FilesUploader
{
	

	/**
	* This function provides the path to store the file.
	*/
	public function getDestinationPath()
	{
		$d = date('Y/m');
		if(!Storage::exists($d)){
			Storage::makeDirectory($d);
		}
		return $d;
	}

	public function getFullUrl($file_name)
	{	
		$fName = $file_name ? '/'.ltrim($file_name, '/') : '';
		return Storage::url(date('Y/m').$fName);
	}

	/** 
	* This function checks the writable permission on the given path
	* @param String - The path
	* @return boolean
	*/
	function isWritablePath() 
	{
		return Storage::put('test.txt','test');	    
	}


	/**
	* This function provides a unique file name
	* @param String - Folder Path
	* @param String - File Name
	*/

	public function getFileName($dir, $name)
	{	
		$name = preg_replace('/[^a-zA-Z0-9\-\_\.]+/', '', $name);
		//print_r($dir.'/'.$name); var_dump(Storage::exists($dir.'/'.$name)); exit;
		if(Storage::exists($dir.'/'.$name)) {

			$fName = explode('.', $name);
			$ext = end($fName);
			$last_index = count($fName)-1;
			unset($fName[$last_index]);
			$f_name = implode('.', $fName);

			$f_name_arr = explode('_', $f_name);
			$last_num = end($f_name_arr);
			$last_index = count($f_name_arr)-1;
			unset($f_name_arr[$last_index]);

			if(is_numeric($last_num)){
				$f_name_arr[$last_index] = $last_num+1;
				
			}else{

				$f_name_arr[$last_index] =  $last_num.'_1';
			}
			$f_name  = implode('_', $f_name_arr);
			$name = $f_name.'.'.$ext;

			return $this->getFileName($dir,$name);
		}

		return $name;
	}

	/**
	 * Move file one location to another location in the same disk
	 * @param  [string] $from source path
	 * @param  [string] $to   Destination path
	 * @return [bool]     
	 */
	public static function move($from,$to)
	{
		return Storage::move($from, $to);
	}
	/**
	 * Delete the temporary file
	 * @param  string $temp_file temporary file path
	 * @return boolean          
	 */
	public static function deleteTempFile($temp_file)
	{
		return Storage::delete($temp_file);
	}

	/**
	 * Generate Html Script
	 */

	public static function script($inputs =[], array $data, $errors) {

		$fnc = "function listPreview (hiddenFields, file, index, inputName) {

		  var p = '<li>'+hiddenFields+'<div class=\"browse-img-box\"><div class=\"input-group\"><div class=\"upload-img\">';
		    p +='<img  width=\"50px\" src=\"'+window.site.storage_url+file.location+'\" alt=\"image\" />';
		    p += '</div></div><a class=\"red-close\" id=\"remove-file_'+inputName+'_'+index+'\" data-index=\"'+index+'\"><img src=\"front/images/red-cross-icon.png\"></a></div></li>';


		  return p;
		}";

		$fnc .= "function renderList(html, inputName, element) {

			element.closest('.media-data').find('li:not(.image-selector)').remove();
			element.closest('li').before(html);
		}";

		$render_script = '';
		foreach($inputs as $input_name => $element_id) {

			$formData = $errors->any() ? old($input_name, []) : (isset($data[$input_name]) ? $data[$input_name] :[]);
			
			if(is_array($formData) && !empty($formData)) {
				$render_script .= '$.LaravelMedia.files.'.$input_name.' = []; $.LaravelMedia.makeInputInstance("#'.$element_id.'", { name: "'.$input_name.'"}, listPreview, renderList);'. json_encode($formData).'.map(function (f) { $.LaravelMedia.files.'.$input_name.'.push(f); }); $.LaravelMedia.elms.'.$input_name.'.filePreview.render();';
			}
		}
		echo '<script type="text/javascript">'.$fnc.$render_script.'</script>';
	}
}