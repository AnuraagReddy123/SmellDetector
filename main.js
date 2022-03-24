define(['base/js/namespace', 'base/js/events'], function (Jupyter, events) {
  // This function will detect the smells
  var findSmells = function () {
    let cell = Jupyter.notebook.get_selected_cell();
    let text = cell.get_text();

    // Long Parameter List
    let count_long_params = 0;
    let code_lines = text.split(/[\n]/); // Get each line of python code
    for (let i = 0; i < code_lines.length; i++) {
      // Find def in code line
      let line = code_lines[i];
      if (line.search(/\bdef\b/) !== -1) {
        // Count the number of commas
        count_long_params += (line.match(/,/g) || []).length;
      }
    }
    if (count_long_params !== 0)
      count_long_params++;
    console.log('Long Parameter List smells: ' + count_long_params);

    // Long methods

    // Wild Card Imports
    let count_wildimports = 0;
    for (let i = 0; i < code_lines.length; i++) {
      let line = code_lines[i];
      if (line.search(/import\*/) !== -1 || line.search(/import \*/) !== -1) count_wildimports++;
    }
    console.log('Wild Import Smells: ' + count_wildimports);
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
