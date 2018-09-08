# How to install and configure the package into your project
composer require hitesh399/laravel-media

## Add the provider into the config/app.php file
```
Collective\Html\HtmlServiceProvider::class,
Hitesh399\LaravelMedia\LaravelMediaServiceProvider::class,
``` 
## Add the alias in the config/app.php file
```
'Form' => Collective\Html\FormFacade::class,
'Html' => Illuminate\Support\Facades\Html::class,
```
## To publish the vendor and update the database schema you can execute the below-mentioned commands:(You also need to install the node and npm)
```
php artisan vendor:publish --tag=laravel-media //to publish the vendor
php artisan migrate // update the database schema
npm install //Download and install the dependency
npm install --save-dev @fortawesome/fontawesome-free //to download font awesome
```
## To compile the media files, add the below line into the webpack.mix.js file 
```
require('./laravel.media.webpack.mix');
```
## To generate the script/css execute the below mentioned command
```
npm run dev
```
## Put the filesystem driver in .env file
```
FILESYSTEM_DRIVER=public //file driver for upload the data
```
## Configure the config/filesystems.php as shown below
```
'public' => [
    'driver' => 'local',
    'root' => public_path('storage'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```
## To create the storage link execute the below-mentioned command 
```
php artisan storage:link
```
## Define the global variable by adding below-mentioned script in between the head tag
 ```
  <script type="text/javascript">
      window.site = {
        'site_url':'{!!url('/')!!}',
        'base_url':'{!!asset('/')!!}',
        'storage_url':'{!!Storage::url('/')!!}',
        'admin_url':'{!!url('/admin')!!}',
      };

</script>
 ```
 ## To use the media popup, include the jquery and bootstrap framework css/js files and also add the below-mentioned script file.
 ```
 <script type="text/javascript" src="{!!(asset(mix('assets/js/laravel.media.min.js')))!!}"></script>
 ```
 
 ## Create the Controller
 ```
 <?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;

class FileController extends Controller
{
	use \Hitesh399\LaravelMedia\Controllers\FileManager;
	public function test (Request $request) {

		$this->validate($request, [
            'test' => 'required'
        ]);
	}
	
}
 ```
 ## Add the below-listed line in route file to define the media routes
 ```
Route::get('files-manager','FileController@index');
Route::match(['post','get'],'files-uploader','FileController@uploader');
Route::put('make-thumb','FileController@makeThumb');
Route::get('files-list','FileController@getList');
Route::post('test-media-form','FileController@test')->name('laravel.media_test');
 ```
## To get started, add the below-listed line in html file
```
 {!!Form::open(array('route' => 'laravel.media_test')) !!}
    {!!Form::text('username')!!}
    {!!Form::laravelMedia('image')!!}
    {!!Form::submit('Click Me!')!!}
{!!Form::close()!!}
```
# How to use the media pop the and override the features

## You just need to use the function Form::laravelMedia($name, $label, $data, $listmaker, $htmlrender, $options)
```
$name [string] -> pass name of element
$label [string] -> pass the lebel of element
$listmaker[string] -> javascript function, to modify the slected file html, the callback function should be define in javascript with four arguments Like: 
function listmaker(hiddenFields, file, index, elementName) => HTML
	hiddenFields [html] -> contains the html of file hidden fields,
	file [Object] -> Object of selected file
	index [integer] -> index of selected file
	elemengtName [string] -> media field name
Note: in this function you have to renturn the HTMl
$htmlrender [string] -> javascript function, To render the prepare the html by listmaker function, function have the 3 arguments Like:
function htmlrender (html, inputName, element )
	html [HTML] -> prepare html by listmaker function
	inputName [String] -> media field name
	element [Object] instance of the media button which use to open the media popup.
$options [Array] => [
	tag [string] -> should be html tag like: button, a, span, and more
	tag_class [String] -> define the class name of media button
	thumb [Array] => [
		[
			h [String] -> define the height of thumbnail
			w [String] -> define the width of thumbnail
			title [String] ->define the title of thumbnail
		]
	]
	title [String] -> Title to diplay on the media popup
	selected_btn_text [String]  -> Selected button text 
	close_btn_text [String] -> Close button text
	maxFiles [integer] -> Max number of file.
	maxFilesize [integer] -> Max size of file in bytes 
	acceptedFiles [String] -> Accepted file type like: image/*,/png, application/*, .gif
	
]
