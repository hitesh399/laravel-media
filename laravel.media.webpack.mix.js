const mix = require('laravel-mix');

mix.styles([
    'resources/assets/css/file-drag-drop.base.css',    
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    'resources/assets/css/laravel.media.custom.css',
], 'public/assets/css/laravel.popup.media.min.css')
.version()
.copy('node_modules/@fortawesome/fontawesome-free/webfonts', 'public/assets/webfonts');


mix.scripts([
	'resources/assets/js/es6-promise.min.js',
	'resources/assets/js/ie.assign.object.js',
	'resources/assets/js/file-drag-drop.base.js',
	'resources/assets/js/cropper_main.js',
	'resources/assets/js/file-manager.js',
	'resources/assets/js/gallery-manager.js',
],'public/assets/js/laravel.popup.media.min.js').version();

mix.scripts([
	'resources/assets/js/laravel.media.js',
	'resources/assets/js/laravel.media.preview.js',
], 'public/assets/js/laravel.media.min.js').version();