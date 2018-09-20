<div class="upload-gallery text-center text-lg-left gallery-row" >
    
    <div class="gallery-preview">
      <div class="flex flex--around input-area">
        
        {{-- <input type="text" class="userInput--img" placeholder='img url'> --}}
        {{-- <button class="add">Add Item</button>
        <button class="display-all">Display gallery</button> --}} 

        

        <div class = "input-group form-group">
           <input type="text" class="form-control" placeholder='Search' name="s" id="gallery_search">
           <span class = "input-group-btn">
              <button type="button" class="btn btn-primary" id="filter_action" >
                  <span class="fas fa-filter"></span>
              </button>
           </span>               
        </div><!-- /input-group -->
      </div>

      <div class="row card-deck"  id="gallery-container">
      </div>
      <div class="row" id="load-more-container">
          <div class="col-md-12"><button id="galery-load-more-action" class="btn animated-btn dark-blue-btn">Load More</button></div>
      </div> 
   </div>

   <div  class="gallery-tool hide">
      <div class="container">
    {{-- <div class="alert alert-warning alert-dismissible fade show" role="alert">
        As of v4.0.0, the core code of Cropper is replaced with <a class="alert-link" href="https://github.com/fengyuanchen/cropperjs">Cropper.js</a>. I recommend you to use the <a class="alert-link" href="https://github.com/fengyuanchen/jquery-cropper">jquery-cropper</a> instead of Cropper.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div> --}}
    <div class="row">
        <div class="col-md-12 col-sm-12 text-left">
            <span class="fas fa-long-arrow-alt-left go-back" id="go_back_to_gallery"></span>
        </div>
    </div>
    <div class="row custom-margin">
      <div class="col-md-9 col-sm-9 col-xs-9 custom-padding width-100">
        <!-- <h3>Demo:</h3> -->
        <div class="img-container">
          <img id="gallery-image" alt="Picture">
        </div>
        <div class="docs-buttons">
        <!-- <h3>Toolbar:</h3> -->
        <div class="btn-group">
          <button type="button" class="btn animated-btn dark-blue-btn" data-method="setDragMode" data-option="move" title="Move">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="Move">
              <span class="fas fa-arrows-alt"></span>
            </span>
          </button>
          <button type="button" class="btn animated-btn dark-blue-btn" data-method="send_crop_data" title="Crop and Save">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="Crop and Save">
              <span class="fa fa-crop"></span>
            </span>
          </button>
        </div>

        <div class="btn-group">
          <button type="button" class="btn animated-btn dark-blue-btn" data-method="zoom" data-option="0.1" title="Zoom In">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="Zoom In">
              <span class="fa fa-search-plus"></span>
            </span>
          </button>
          <button type="button" class="btn animated-btn dark-blue-btn" data-method="zoom" data-option="-0.1" title="Zoom Out">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="Zoom Out">
              <span class="fa fa-search-minus"></span>
            </span>
          </button>
        </div>

        {{-- <div class="btn-group">
          <button type="button" class="btn btn-primary" data-method="move" data-option="-10" data-second-option="0" title="Move Left">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, -10, 0)">
              <span class="fa fa-arrow-left"></span>
            </span>
          </button>
          <button type="button" class="btn btn-primary" data-method="move" data-option="10" data-second-option="0" title="Move Right">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, 10, 0)">
              <span class="fa fa-arrow-right"></span>
            </span>
          </button>
          <button type="button" class="btn btn-primary" data-method="move" data-option="0" data-second-option="-10" title="Move Up">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, 0, -10)">
              <span class="fa fa-arrow-up"></span>
            </span>
          </button>
          <button type="button" class="btn btn-primary" data-method="move" data-option="0" data-second-option="10" title="Move Down">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;move&quot;, 0, 10)">
              <span class="fa fa-arrow-down"></span>
            </span>
          </button>
        </div>

        <div class="btn-group">
          <button type="button" class="btn btn-primary" data-method="rotate" data-option="-45" title="Rotate Left">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;rotate&quot;, -45)">
              <span class="fa fa-undo"></span>
            </span>
          </button>
          <button type="button" class="btn btn-primary" data-method="rotate" data-option="45" title="Rotate Right">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;rotate&quot;, 45)">
              <span class="fas fa-redo-alt"></span>
            </span>
          </button>
        </div>

        <div class="btn-group">
          <button type="button" class="btn btn-primary" data-method="scaleX" data-option="-1" title="Flip Horizontal">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;scaleX&quot;, -1)">
              <span class="fas fa-arrows-alt-h"></span>
            </span>
          </button>
          <button type="button" class="btn btn-primary" data-method="scaleY" data-option="-1" title="Flip Vertical">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;scaleY&quot;, -1)">
              <span class="fas fa-arrows-alt-v"></span>
            </span>
          </button>
        </div> --}}

        {{-- <div class="btn-group">
          <button type="button" class="btn btn-primary" data-method="crop" title="Crop">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;crop&quot;)">
              <span class="fa fa-check"></span>
            </span>
          </button>
          <button type="button" class="btn btn-primary" data-method="clear" title="Clear">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;clear&quot;)">
              <span class="fas fa-times"></span>
            </span>
          </button>
        </div> --}}

        {{-- <div class="btn-group">
          <button type="button" class="btn btn-primary" data-method="disable" title="Disable">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;disable&quot;)">
              <span class="fa fa-lock"></span>
            </span>
          </button>
          <button type="button" class="btn btn-primary" data-method="enable" title="Enable">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;enable&quot;)">
              <span class="fa fa-unlock"></span>
            </span>
          </button>
        </div> --}}

        {{-- <div class="btn-group">
          <button type="button" class="btn btn-primary" data-method="reset" title="Reset">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;reset&quot;)">
              <span class="fas fa-sync-alt"></span>
            </span>
          </button>
          <label class="btn btn-primary btn-upload" for="inputImage" title="Upload image file">
            <input type="file" class="sr-only" id="inputImage" name="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="Import image with Blob URLs">
              <span class="fa fa-upload"></span>
            </span>
          </label>
          <button type="button" class="btn btn-primary" data-method="destroy" title="Destroy">
            <span class="docs-tooltip" data-toggle="tooltip" data-animation="false" title="$().cropper(&quot;destroy&quot;)">
              <span class="fa fa-power-off"></span>
            </span>
          </button> --}}
        </div>    
      </div>
      <div class="col-md-3 col-sm-3 col-xs-3 custom-padding docs-details width-100">
        <!-- <h3>Preview:</h3> -->
        {{-- <div class="docs-preview clearfix">
          <div class="img-preview preview-lg"></div>
          <div class="img-preview preview-md"></div>
          <div class="img-preview preview-sm"></div>
          <div class="img-preview preview-xs"></div>
          
        </div> --}}
        <!-- <h3>Data:</h3> -->
        <div class="docs-data">
          <div class="input-group input-group-sm hide">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataX">X</label>
            </span>
            <input type="text" class="form-control" id="dataX" placeholder="x">
            <span class="input-group-append">
              <span class="input-group-text">px</span>
            </span>
          </div>
          <div class="input-group input-group-sm  hide">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataY">Y</label>
            </span>
            <input type="text" class="form-control" id="dataY" placeholder="y">
            <span class="input-group-append">
              <span class="input-group-text">px</span>
            </span>
          </div>
          <div class="input-group input-group-sm  hide">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataWidth">Width</label>
            </span>
            <input type="text" class="form-control" id="dataWidth" placeholder="width">
            <span class="input-group-append">
              <span class="input-group-text">px</span>
            </span>
          </div>
          <div class="input-group input-group-sm  hide">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataHeight">Height</label>
            </span>
            <input type="text" class="form-control" id="dataHeight" placeholder="height">
            <span class="input-group-append">
              <span class="input-group-text">px</span>
            </span>
          </div>

          <div class="input-group input-group-sm">
            <span class="input-group-prepend">
              <input type="text" class="form-control" id="dataThumbWidth" value="100" placeholder="Thumb width">
            </span>            
            <span class="input-group-append">
                <div class = "input-group">
                   <input type="text" class="form-control" id="dataThumbHeight" value="100" placeholder="Thumb height">
                   <span class = "input-group-btn">
                      <button class = "btn animated-btn dark-blue-btn  initialize-cropper" type = "button">
                         Go!
                      </button>
                   </span>               
                </div><!-- /input-group -->
              
            </span>
          </div>
          {{-- <div class="input-group input-group-sm">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataHeight">Thumb Height</label>
            </span>
            <input type="text" class="form-control" id="dataThumbHeight" value="100" placeholder="Thumb height">
            <span class="input-group-append">
              <span class="input-group-text">px</span>
            </span>
          </div> --}}

          <div class="input-group input-group-sm  hide">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataRotate">Rotate</label>
            </span>
            <input type="text" class="form-control" id="dataRotate" placeholder="rotate">
            <span class="input-group-append">
              <span class="input-group-text">deg</span>
            </span>
          </div>
          <div class="input-group input-group-sm  hide">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataScaleX">ScaleX</label>
            </span>
            <input type="text" class="form-control" id="dataScaleX" placeholder="scaleX">
          </div>
          <div class="input-group input-group-sm  hide">
            <span class="input-group-prepend">
              <label class="input-group-text" for="dataScaleY">ScaleY</label>
            </span>
            <input type="text" class="form-control" id="dataScaleY" placeholder="scaleY">
          </div>
        </div>

        <div class="other-thumb">
        </div>

      </div>
    </div>
 
  </div>
   </div>
</div>