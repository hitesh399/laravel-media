<div class="toggle-button btn is_upload hide">back to Upload</div>
    <div id="dropzoneDiv">
      {!!Form::open(['url'=>'sfgdsjgj','method'=>'POST','class'=>'dropzone','id'=>'dropzone'])!!}
      
      {!!Form::close()!!}
      <div class="table table-striped" class="files" id="previews">

      <div id="template" class="file-row">
        <!-- This is used as the file preview template -->
        <div>
            <span class="preview"><img data-dz-thumbnail /></span>
        </div>
        <div>
            <p class="name" data-dz-name></p>
            <strong class="error text-danger" data-dz-errormessage></strong>
        </div>
        <div>
            <p class="size" data-dz-size></p>
            <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
            </div>
        </div>
        <div>
          <button class="btn btn-primary start hide">
              <i class="glyphicon glyphicon-upload"></i>
              <span>Start</span>
          </button>
          <button data-dz-remove class="btn btn-warning cancel">
              <i class="glyphicon glyphicon-ban-circle"></i>
              <span>Cancel</span>
          </button>
          <button data-dz-remove class="btn btn-danger delete">
            <i class="glyphicon glyphicon-trash"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>

    </div>
   </div>   

  <div class="hide" style="margin-top: 20px;" id="cropperDiv">
    <div class="cropper-panel"></div>
  </div>