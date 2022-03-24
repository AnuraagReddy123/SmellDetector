define(['base/js/namespace', 'base/js/events'], function (Jupyter, events) {
  // This function will detect the smells
  var findSmells = function () {


    // Replace get_selected_cell with get_all_cell if necessary
    let cell = Jupyter.notebook.get_selected_cell();
    let text = cell.get_text();
    // console.log(text);

    // Enter code to find different smells

    // Long Parameter List
    /*let long_params_smells=0
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
        console.log(count+1);
        if(count+1>4)
        long_params_smells+=1;
      }
    }*/
    // Long methods
    lines = text.split("\n");
    console.log(lines);
    for(let i=0; i<lines.length; i++){
      if(lines[i].trim().split(' ')[0] == "def"){
        let cnt=1;
        let j=i;

        j++;
        while(j<lines.length && lines[j].search(/\S|$/) == lines[j].length){
          j++;
          continue;
        }

        let l = lines[j].search(/\S|$/);

        // console.log(lines[j].search(/\S|$/) + " : " + lines[j].length);

        j++;
        
        for(j; j<lines.length; j++){
          // console.log(lines[j].search(/\S|$/) + " : " + lines[j].length);

          if(lines[j].search(/\S|$/) == lines[j].length){
            continue;
          }
          else if(lines[j].search(/\S|$/) >= l){
            cnt++;
          }
          else{
            console.log("Line " + i + " , " + lines[i].trim().split(' ')[1].split('(')[0] + " : " + cnt);
            break;
          }
        }
        i=j-1;
      }
    }
    // Wild Card Imports
    
  };

  // Clickable button in toolbar
  var detectSmellButton = function () {
    Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register(
        {
          help: 'Detect smells',
          icon: 'fa-bolt',
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
