define(['base/js/namespace', 'base/js/events'], function (Jupyter, events) {
  // This function will detect the smells
  var findSmells = function () {


    // Replace get_selected_cell with get_all_cell if necessary
    let cell = Jupyter.notebook.get_selected_cell();
    let text = cell.get_text();

    // Enter code to find different smells

    // Long Parameter List
    let long_params_smells=0
    for  (let i=0 ;i<tokenizer.length;i++)
    {
      if(tokenizer[i]=="def")
      {
        //i+1 id .i+2 ( 
        let count=0
        for(j=i+3;j<tokenizer.length;j++)
        {
          if(tokenizer[j]==",")
          count+=1;
          else if(tokenizer[j]==")")
          break;
        }
        // console.log(count+1);
        if(count+1>4)
        long_params_smells+=1;
      }
    }
    // console.log(long_params_smells);
    // Long methods
    
    // Wild Card Imports
    
  };

  // Clickable button in toolbar
  var detectSmellButton = function () {
    Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register(
        {
          help: 'Detect smells',
          icon: 'fa-play-button',
          handler: findSmells,
        },
        'detect-code-smell',
        'Smell Detector'
      ),
    ]);
  };

  function load_ipython_extension() {
    detectSmellButton();
  }
  return {
    load_ipython_extension: load_ipython_extension,
  };
});
