define(['base/js/namespace', 'base/js/events'], function (Jupyter, events) {
  // This function will detect the smells
  var findSmells = function () {


    // Replace get_selected_cell with get_all_cell if necessary
    let cell = Jupyter.notebook.get_selected_cell();
    let text = cell.get_text();
    console.log(text);

    // Enter code to find different smells

    // Long Parameter List

    // Long methods

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
