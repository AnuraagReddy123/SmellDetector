define(['base/js/namespace', 'base/js/events'], function (Jupyter, events) {
  // This function will detect the smells
  var findSmells = function () {
    let cell = Jupyter.notebook.get_selected_cell();
    let text = cell.get_text();

    // Enter code to find different smells

    // Long Parameter List
    /*
    let long_params_smells = 0;
    let tokenizer = text.match(/\S+/g);
    console.log(tokenizer)

    for (let i = 0; i < tokenizer.length; i++) {
      if (tokenizer[i] == 'def') {
        //i+1 id .i+2 (
        let count = 0;
        for (j = i + 3; j < tokenizer.length; j++) {
          if (tokenizer[j] == ',') count += 1;
          else if (tokenizer[j] == ')') break;
        }
        console.log(count + 1);
        if (count + 1 > 4) long_params_smells += 1;
      }
    }
    */

    // Long methods

    // Wild Card Imports
    let count_wildimports = 0;
    let code_lines = text.split(/[\n]/); // Get each line of python code
    console.log(code_lines);
    for (let i = 0; i < code_lines.length; i++) {
      let line = code_lines[i];
      console.log(line);
      if (line.search(/import\*/) !== -1 || line.search(/import \*/) !== -1)
        count_wildimports++;
    }
    console.log("Wild Import Smells: " + count_wildimports);

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
