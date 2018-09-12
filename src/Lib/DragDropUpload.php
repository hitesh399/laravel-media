<?php

namespace Hitesh399\LaravelMedia\Lib;

use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Storage;
use Hitesh399\LaravelMedia\Models\MediaFile;
use Auth;

class DragDropUpload  extends FilesUploader
{

	private $fileType;
	
	/**
	* This function handles the proccess of file uploading..
	* @param Instance of Illuminate\Http\Request
	* @return Instance Of file.
	*/

	public function doUpload(Request $request)
	{	
		# Check path is writable or not.
		if(!$this->isWritablePath()){

			return \Response::json(['message'=>'The store path is not writable.','success'=>false], 500);
		}
		$file = $request->file('file');

		$file_org_name = $file->getClientOriginalName();
		$ext_arr = explode('.', $file_org_name);
		$ext = $ext_arr[count($ext_arr)-1];
		
		$dest_path = $this->getDestinationPath();		
		$file_name = $this->getFileName($dest_path, $file_org_name);
		$path = Storage::putFileAs($dest_path, $file, $file_name);		
		$basename = basename($path);
		$image_size = getImageSize($file->getPathName());

		$parent_file = MediaFile::create([
			'location' => $path,
			'file_type' => $file->getMimeType(),
			'size' => $file->getSize(),
			'title' => $file_org_name,
			'image_dimension' => $image_size ? $image_size[0].'x'.$image_size[1] : '',
			'parent_id' => null,
			'uploaded_by' => Auth::user() ? Auth::user()->id : null
		]);

		# If Find Crop data 
		$cropData = $request->cropData;
		$thumbs  =[];

		if($cropData){
			
			foreach($cropData as $data) {

				$thumb_name = $dest_path.'/'.$data['id'].'-'.$basename;
				$this->crop($file->getPathName(), $data, $thumb_name);

				$thumbs[] = MediaFile::create([
					'location' => $thumb_name,
					'file_type' => $file->getMimeType(),
					'size' => Storage::size($thumb_name),
					'image_dimension' => $data['id'],
					'parent_id' => $parent_file->id,
					'uploaded_by' => Auth::user() ? Auth::user()->id : null
				]);
			}
		}		

		return response()->json(array_merge($parent_file->toArray(), ['thumbs' => $thumbs, 'base_url'=>Storage::url('/') ]));
	}

	/**
	 * Crop the image according to the request
	 */
	public function cropAction (Request $request) {

		$image_file = \Storage::url($request->file['location']);
		$basename = basename($image_file);
		$dest_path = $this->getDestinationPath();
		$id = $request->thumb_width.'x'.$request->thumb_height;	
		$thumb_name = $dest_path.'/'.$this->getFileName($dest_path, $id.'-'.$basename);
		$this->crop($image_file, $request->all(), $thumb_name);	

		MediaFile::create([
			'location' => $thumb_name,
			'file_type' => $request->file['file_type'],
			'size' => Storage::size($thumb_name),
			'image_dimension' => $id,
			'parent_id' => $request->file['id'],
			'uploaded_by' => Auth::user() ? Auth::user()->id : null
		]);

		return response()->json(MediaFile::where('id',$request->file['id'])->with('thumbs')->first() );
	}

	private function crop($src, $data, $thumb_name)
	{   
    	$data = (object) $data;

	    if (!empty($src)  && !empty($data)) {

	      $type = exif_imagetype($src);
	  
	      switch ($type) {
	        case IMAGETYPE_GIF:
	          $src_img = imagecreatefromgif($src);
	          break;
	        case IMAGETYPE_JPEG:
	          $src_img = imagecreatefromjpeg($src);
	          break;
	        case IMAGETYPE_PNG:
	          $src_img = imagecreatefrompng($src);
	          break;
	      }

	      if (!$src_img) {
	        return;
	      }

	      $size = getimagesize($src);
	      $size_w = $size[0]; // natural width
	      $size_h = $size[1]; // natural height

	     
	      $src_img_w = $size_w;
	      $src_img_h = $size_h;
	      $degrees = $data -> rotate;
	      // Rotate the source image
	      if (is_numeric($degrees) && $degrees != 0) {
	        // PHP's degrees is opposite to CSS's degrees
	        $new_img = imagerotate( $src_img, -$degrees, imagecolorallocatealpha($src_img, 0, 0, 0, 127) );
	        imagedestroy($src_img);
	        $src_img = $new_img;
	        $deg = abs($degrees) % 180;
	        $arc = ($deg > 90 ? (180 - $deg) : $deg) * M_PI / 180;
	        $src_img_w = $size_w * cos($arc) + $size_h * sin($arc);
	        $src_img_h = $size_w * sin($arc) + $size_h * cos($arc);
	        // Fix rotated image miss 1px issue when degrees < 0
	        $src_img_w -= 1;
	        $src_img_h -= 1;
	      }

	      $tmp_img_w = $data -> width;
	      $tmp_img_h = $data -> height;
	      $dst_img_w = $data -> thumb_width;
	      $dst_img_h = $data -> thumb_height;

	      $src_x = $data -> x;
	      $src_y = $data -> y;
	      if ($src_x <= -$tmp_img_w || $src_x > $src_img_w) {
	        $src_x = $src_w = $dst_x = $dst_w = 0;
	      } else if ($src_x <= 0) {
	        $dst_x = -$src_x;
	        $src_x = 0;
	        $src_w = $dst_w = min($src_img_w, $tmp_img_w + $src_x);
	      } else if ($src_x <= $src_img_w) {
	        $dst_x = 0;
	        $src_w = $dst_w = min($tmp_img_w, $src_img_w - $src_x);
	      }
	      if ($src_w <= 0 || $src_y <= -$tmp_img_h || $src_y > $src_img_h) {
	        $src_y = $src_h = $dst_y = $dst_h = 0;
	      } else if ($src_y <= 0) {
	        $dst_y = -$src_y;
	        $src_y = 0;
	        $src_h = $dst_h = min($src_img_h, $tmp_img_h + $src_y);
	      } else if ($src_y <= $src_img_h) {
	        $dst_y = 0;
	        $src_h = $dst_h = min($tmp_img_h, $src_img_h - $src_y);
	      }
	      // Scale to destination position and size
	      $ratio = $tmp_img_w / $dst_img_w;
	      $dst_x /= $ratio;
	      $dst_y /= $ratio;
	      $dst_w /= $ratio;
	      $dst_h /= $ratio;
	      $dst_img = imagecreatetruecolor($dst_img_w, $dst_img_h);
	      // Add transparent background to destination image
	      imagefill($dst_img, 0, 0, imagecolorallocatealpha($dst_img, 0, 0, 0, 127));
	      imagesavealpha($dst_img, true);
	      $result = imagecopyresampled($dst_img, $src_img, $dst_x, $dst_y, $src_x, $src_y, $dst_w, $dst_h, $src_w, $src_h);

	      if($result) {
	      	
	      	ob_start();
	      	imagepng($dst_img);
	      	$encode_data  = ob_get_contents();
	      	ob_clean();

	      	Storage::put($thumb_name, $encode_data);	    
	      }
	      imagedestroy($dst_img);
	      return $result;
	    }
  }
}