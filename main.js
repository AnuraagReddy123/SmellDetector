define(['base/js/namespace', 'base/js/events'], function (Jupyter, events) {
  var defaultCellButton = function () {};

  function load_ipython_extension() {
    defaultCellButton();
  }
  return {
    load_ipython_extension: load_ipython_extension,
  };
});
