<?php

namespace Hitesh399\LaravelMedia;
use Collective\Html\HtmlServiceProvider;

class LaravelMediaServiceProvider extends HtmlServiceProvider {
	
    public function boot()
    {
        # Move Migration
        $this->publishes([
            __DIR__.'/database/migrations/' => database_path('migrations')
        ], 'laravel-media');

        # move Seeds
        $this->publishes([
            __DIR__.'/database/seeds/' => database_path('seeds')
        ], 'laravel-media');

        # Move Script and Css
        $this->publishes([
        __DIR__.'/assets' => resource_path('assets'),
        ], 'laravel-media');

        # Move View files.
        $this->publishes([
            __DIR__.'/views' => resource_path('views/vendor/LaravelMedia'),
        ],'laravel-media');

        $this->publishes([
            __DIR__.'/../laravel.media.webpack.mix.js' => base_path('laravel.media.webpack.mix.js'),
        ],'laravel-media');
    }

	public function register()
    {   
        parent::register();

        $this->app->singleton('form', function($app)
        {
            $form = new Macros($app['html'], $app['url'], $app['view'],$app['session.store']->token(), $app['request']);
            return $form->setSessionStore($app['session.store']);
        });

    }
}
